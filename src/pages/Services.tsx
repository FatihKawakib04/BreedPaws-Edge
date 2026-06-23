import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { modelService, type PredictionResult } from '../services/modelService';

function Services() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-load the model when component mounts
  useEffect(() => {
    async function loadModel() {
      setIsModelLoading(true);
      setModelError(null);
      try {
        await modelService.loadModel();
      } catch (err) {
        console.error('Error pre-loading model:', err);
        setModelError('Gagal memuat model machine learning. Silakan muat ulang halaman.');
      } finally {
        setIsModelLoading(false);
      }
    }
    loadModel();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create local URL for preview and prediction
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
      // Reset previous prediction
      setPrediction(null);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreviewUrl) return;

    setIsLoading(true);
    setPrediction(null);

    try {
      // Create HTMLImageElement in memory to pass to TensorFlow.js
      const img = new Image();
      img.src = imagePreviewUrl;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = (err) => reject(err);
      });

      // Run prediction locally
      const result = await modelService.predict(img);
      setPrediction(result);
    } catch (err) {
      console.error('Error during prediction:', err);
      alert('Gagal mendeteksi gambar. Pastikan file yang Anda unggah adalah gambar valid.');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImageFile(null);
    setImagePreviewUrl(null);
    setPrediction(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="page services-page">
      {/* Jumbotron */}
      <div className="jumbotron jumbotron-fluid overlay">
        <div className="jumbo-heading">
          <div className="section-heading">
            <h1>Our Services</h1>
          </div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Services</li>
            </ol>
          </nav>
        </div>
      </div>
      {/* /jumbotron */}

      {/* Page Content */}
      <div className="container block-padding">
        {/* Breed Prediction Tool */}
        <div className="bg-light-custom p-4 p-md-5 rounded-4 shadow-sm mb-5">
          <div className="section-heading text-center mb-4">
            <h3>Prediksi Ras Anjing</h3>
            <p className="subtitle text-muted">
              Unggah gambar anjing Anda dan sistem kami akan mengenali rasnya secara instan di browser Anda
            </p>
          </div>

          {modelError && (
            <div className="alert alert-danger text-center mb-4">
              <i className="fas fa-exclamation-triangle me-2"></i> {modelError}
            </div>
          )}

          {isModelLoading && (
            <div className="alert alert-warning text-center mb-4">
              <i className="fas fa-spinner fa-spin me-2"></i> Memuat model TensorFlow.js... Mohon tunggu sebentar.
            </div>
          )}

          <div className="row g-4 mt-2">
            {/* Upload Area */}
            <div className="col-md-6">
              <div className="card h-100 card-premium border-0">
                <div className="card-body p-4 d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title mb-3 font-weight-bold">Unggah Gambar Anjing</h5>
                    <form onSubmit={handleFormSubmit} id="upload-form">
                      <div className="form-group mb-4">
                        <label htmlFor="dog-image" className="form-label text-muted">Pilih file gambar:</label>
                        <input 
                          type="file" 
                          className="form-control d-none" 
                          id="dog-image" 
                          accept="image/*" 
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          required
                        />
                        <div 
                          className="border border-2 border-dashed rounded-3 p-4 text-center cursor-pointer bg-white hover-bg-light"
                          style={{ borderStyle: 'dashed', cursor: 'pointer' }}
                          onClick={triggerFileInput}
                        >
                          <i className="fas fa-cloud-upload-alt text-primary mb-2" style={{ fontSize: '2.5rem' }}></i>
                          {imageFile ? (
                            <p className="mb-0 text-success fw-bold">{imageFile.name}</p>
                          ) : (
                            <p className="mb-0 text-muted">Klik untuk memilih file gambar (JPG, PNG)</p>
                          )}
                        </div>
                      </div>
                      
                      {imagePreviewUrl ? (
                        <div className="d-flex gap-2">
                          <button 
                            type="submit" 
                            className="btn btn-primary flex-grow-1 py-2.5" 
                            disabled={isLoading || isModelLoading}
                          >
                            {isLoading ? (
                              <>
                                <i className="fas fa-spinner fa-spin me-2"></i> Memproses...
                              </>
                            ) : 'Prediksi Ras'}
                          </button>
                          <button 
                            type="button" 
                            className="btn btn-secondary py-2.5 px-4"
                            onClick={handleReset}
                            disabled={isLoading}
                          >
                            Reset
                          </button>
                        </div>
                      ) : (
                        <button 
                          type="submit" 
                          className="btn btn-primary w-100 py-2.5" 
                          disabled={isLoading || isModelLoading || !imagePreviewUrl}
                        >
                          Prediksi Ras
                        </button>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Area */}
            <div className="col-md-6">
              <div className="card h-100 card-premium border-0">
                <div className="card-body p-4 d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title mb-3 font-weight-bold">Hasil Prediksi</h5>
                    <div id="prediction-result" className="mb-3">
                      {isLoading ? (
                        <div className="spinner-wrapper text-center my-4">
                          <i className="fas fa-spinner fa-spin text-primary mb-2" style={{ fontSize: '2rem' }}></i>
                          <p className="text-muted mb-0">Sedang memproses gambar di browser...</p>
                        </div>
                      ) : prediction ? (
                        <div className="alert alert-success border-0 shadow-sm p-4">
                          <h5 className="alert-heading font-weight-bold mb-3">Hasil Analisis Model:</h5>
                          <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">Kemungkinan Ras:</span>
                            <span className="fw-bold text-dark text-capitalize">{prediction.breed}</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted">Tingkat Keyakinan:</span>
                            <span className="badge bg-success p-2" style={{ fontSize: '0.95rem' }}>
                              {(prediction.confidence * 100).toFixed(2)}%
                            </span>
                          </div>
                          <div className="progress mt-3" style={{ height: '8px' }}>
                            <div 
                              className="progress-bar bg-success" 
                              role="progressbar" 
                              style={{ width: `${prediction.confidence * 100}%` }} 
                              aria-valuenow={prediction.confidence * 100} 
                              aria-valuemin={0} 
                              aria-valuemax={100}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-center text-muted py-5 my-3">
                          Unggah gambar anjing di sebelah kiri, kemudian klik tombol "Prediksi Ras" untuk melihat hasil deteksi.
                        </p>
                      )}
                    </div>
                  </div>

                  {imagePreviewUrl && (
                    <div id="prediction-image" className="text-center mt-3">
                      <div className="prediction-img-container d-inline-block">
                        <img 
                          src={imagePreviewUrl} 
                          alt="Pratinjau Anjing" 
                          className="img-fluid rounded" 
                          style={{ maxHeight: '200px', objectFit: 'contain' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
