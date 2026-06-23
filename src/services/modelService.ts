import * as tf from '@tensorflow/tfjs';

export interface PredictionResult {
  breed: string;
  confidence: number;
}

/**
 * Helper to recursively extract keras_history references from Keras 3 inbound node configurations.
 */
/**
 * Helper to recursively extract keras_history references from Keras 3 inbound node configurations.
 */
function extractKerasHistory(arg: unknown): unknown[] {
  if (!arg) return [];
  if (Array.isArray(arg)) {
    let result: unknown[] = [];
    for (const item of arg) {
      result = result.concat(extractKerasHistory(item));
    }
    return result;
  }
  if (typeof arg === 'object') {
    const obj = arg as Record<string, unknown>;
    if (obj.class_name === '__keras_tensor__' && obj.config && typeof obj.config === 'object') {
      const config = obj.config as Record<string, unknown>;
      if (Array.isArray(config.keras_history)) {
        const history = config.keras_history; // [layer_name, node_index, tensor_index]
        return [[history[0], history[1], history[2], {}]];
      }
    }
  }
  return [];
}

/**
 * In-memory translator converting Keras 3 model topology JSON to Keras 2 style 
 * for compatibility with current TensorFlow.js layers deserializer.
 */
function convertKeras3ToKeras2(modelJson: unknown): unknown {
  const modified = JSON.parse(JSON.stringify(modelJson)) as Record<string, unknown>;
  if (!modified.modelTopology || typeof modified.modelTopology !== 'object') return modified;

  const topology = modified.modelTopology as Record<string, unknown>;
  topology.keras_version = '2.15.0';
  
  const modelConfig = topology.model_config as Record<string, unknown> | undefined;
  if (modelConfig) {
    if (modelConfig.class_name === 'Functional') {
      modelConfig.class_name = 'Model';
    }

    const config = modelConfig.config as Record<string, unknown> | undefined;
    const layers = config?.layers;
    if (Array.isArray(layers)) {
      layers.forEach((layerObj: unknown) => {
        if (!layerObj || typeof layerObj !== 'object') return;
        const layer = layerObj as Record<string, unknown>;

        // 2. InputLayer batch_shape -> batch_input_shape
        if (layer.class_name === 'InputLayer' && layer.config && typeof layer.config === 'object') {
          const layerConfig = layer.config as Record<string, unknown>;
          if (layerConfig.batch_shape && !layerConfig.batch_input_shape) {
            layerConfig.batch_input_shape = layerConfig.batch_shape;
            delete layerConfig.batch_shape;
          }
        }

        // 3. Convert inbound_nodes connections
        if (Array.isArray(layer.inbound_nodes)) {
          layer.inbound_nodes = layer.inbound_nodes.map((node: unknown) => {
            if (node && typeof node === 'object' && !Array.isArray(node)) {
              const nodeObj = node as Record<string, unknown>;
              if (nodeObj.args) {
                return extractKerasHistory(nodeObj.args);
              }
            }
            return node;
          });
        }

        // 4. Flatten DTypePolicy object to string
        if (layer.config && typeof layer.config === 'object') {
          const layerConfig = layer.config as Record<string, unknown>;
          if (typeof layerConfig.dtype === 'object' && layerConfig.dtype !== null) {
            const dtypeConfig = layerConfig.dtype as Record<string, unknown>;
            if (dtypeConfig.config && typeof dtypeConfig.config === 'object') {
              const dtypeInnerConfig = dtypeConfig.config as Record<string, unknown>;
              if (dtypeInnerConfig.name && typeof dtypeInnerConfig.name === 'string') {
                layerConfig.dtype = dtypeInnerConfig.name;
              } else {
                layerConfig.dtype = 'float32';
              }
            } else {
              layerConfig.dtype = 'float32';
            }
          }

          // 5. Convert L2 Regularizers -> L1L2
          const regularizerKeys = [
            'kernel_regularizer',
            'bias_regularizer',
            'activity_regularizer',
            'beta_regularizer',
            'gamma_regularizer'
          ];
          regularizerKeys.forEach(key => {
            const reg = layerConfig[key];
            if (reg && typeof reg === 'object') {
              const regObj = reg as Record<string, unknown>;
              if (regObj.class_name === 'L2') {
                const regConfig = regObj.config as Record<string, unknown> | undefined;
                layerConfig[key] = {
                  class_name: 'L1L2',
                  config: {
                    l1: 0.0,
                    l2: regConfig?.l2 || 0.0
                  }
                };
              }
            }
          });
        }
      });
    }
  }

  return modified;
}

export class ModelService {
  private model: tf.LayersModel | null = null;
  private labels: Record<string, string> | null = null;
  private isLoading = false;

  async loadModel(): Promise<void> {
    if (this.model && this.labels) {
      return;
    }

    if (this.isLoading) {
      while (this.isLoading) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      return;
    }

    this.isLoading = true;
    try {
      console.log('Loading TensorFlow.js model and class labels...');
      
      const [modelResponse, labelsResponse] = await Promise.all([
        fetch('/model/tfjs_model_v2/model.json'),
        fetch('/model/class_labels.json')
      ]);

      const rawModelJson = await modelResponse.json();
      this.labels = await labelsResponse.json();

      // Convert model topology in-memory
      const compatibleModelJson = convertKeras3ToKeras2(rawModelJson);

      // Load model using Blob URL to feed the converted JSON
      const blob = new Blob([JSON.stringify(compatibleModelJson)], { type: 'application/json' });
      const blobUrl = URL.createObjectURL(blob);

      this.model = await tf.loadLayersModel(blobUrl, {
        weightPathPrefix: '/model/tfjs_model_v2/'
      });

      // Revoke URL to prevent memory accumulation
      URL.revokeObjectURL(blobUrl);

      console.log('Model and class labels loaded successfully.');
    } catch (error) {
      console.error('Failed to load TensorFlow.js model or labels:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  async predict(imgElement: HTMLImageElement): Promise<PredictionResult> {
    await this.loadModel();

    if (!this.model || !this.labels) {
      throw new Error('Model or labels not initialized.');
    }

    const predictionTensor = tf.tidy(() => {
      // Bug Fix: Force 3 channels (RGB) during pixel extraction
      const tensor = tf.browser.fromPixels(imgElement, 3);
      const resized = tf.image.resizeBilinear(tensor, [224, 224]);
      const normalized = resized.toFloat().div(tf.scalar(127.5)).sub(tf.scalar(1.0));
      const batched = normalized.expandDims(0);
      return this.model!.predict(batched) as tf.Tensor;
    });

    try {
      const predictions = await predictionTensor.data();
      
      let maxIdx = 0;
      let maxVal = -1;
      for (let i = 0; i < predictions.length; i++) {
        if (predictions[i] > maxVal) {
          maxVal = predictions[i];
          maxIdx = i;
        }
      }

      const rawBreed = this.labels[maxIdx.toString()] || 'Unknown Breed';
      let breedName = rawBreed;
      if (rawBreed.includes('-')) {
        breedName = rawBreed.split('-')[1];
      }
      breedName = breedName.replace(/_/g, ' ');

      return {
        breed: breedName,
        confidence: maxVal,
      };
    } finally {
      predictionTensor.dispose();
    }
  }
}

export const modelService = new ModelService();
