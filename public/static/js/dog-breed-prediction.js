// JavaScript untuk menangani prediksi ras anjing
document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('upload-form');
    const predictionResult = document.getElementById('prediction-result');
    const predictionImage = document.getElementById('prediction-image');
    const predictionImageElement = predictionImage.querySelector('img');

    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Tampilkan loading
            predictionResult.innerHTML = '<p class="text-center"><i class="fas fa-spinner fa-spin"></i> Sedang memproses gambar...</p>';
            
            const formData = new FormData(this);
            
            // Kirim gambar ke server untuk prediksi
            fetch('/predict', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Tampilkan hasil prediksi
                    let predictionHTML = `
                        <div class="alert alert-success">
                            <h5>Hasil Prediksi:</h5>
                            <p><strong>Ras Anjing:</strong> ${data.breed}</p>
                            <p><strong>Tingkat Keyakinan:</strong> ${(data.confidence * 100).toFixed(2)}%</p>
                    `;
                    
                    
                    predictionHTML += `</div>`;
                    predictionResult.innerHTML = predictionHTML;
                    
                    // Tampilkan gambar yang diunggah
                    predictionImageElement.src = data.image_path;
                    predictionImage.style.display = 'block';
                } else {
                    // Tampilkan pesan error
                    predictionResult.innerHTML = `
                        <div class="alert alert-danger">
                            <p><strong>Error:</strong> ${data.error || 'Terjadi kesalahan saat memproses gambar'}</p>
                        </div>
                    `;
                    predictionImage.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                predictionResult.innerHTML = `
                    <div class="alert alert-danger">
                        <p><strong>Error:</strong> Terjadi kesalahan saat menghubungi server</p>
                    </div>
                `;
                predictionImage.style.display = 'none';
            });
        });
    }
});