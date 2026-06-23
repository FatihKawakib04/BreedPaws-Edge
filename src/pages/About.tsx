import { useState } from 'react';
import { Link } from 'react-router-dom';

type AccordionKey = 'tujuan' | 'mengapa' | 'akurasi';

function About() {
  const [activeItem, setActiveItem] = useState<AccordionKey | null>('tujuan');

  const toggleAccordion = (item: AccordionKey) => {
    if (activeItem === item) {
      setActiveItem(null); // collapse if clicked again
    } else {
      setActiveItem(item);
    }
  };

  return (
    <div className="page about-page">
      {/* Jumbotron */}
      <div className="jumbotron jumbotron-fluid overlay">
        <div className="jumbo-heading">
          <div className="section-heading">
            <h1>About Us</h1>
          </div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active" aria-current="page">About us</li>
            </ol>
          </nav>
        </div>
      </div>
      {/* /jumbotron */}

      {/* Page Content */}
      <div className="container block-padding">
        <div className="row align-items-center mb-5">
          <div className="col-lg-5 mb-4 mb-lg-0 text-center">
            <img 
              src="/static/img/gambar13.jpg" 
              alt="Automatic Dog classification description" 
              className="img-fluid border-irregular2 border-double" 
              style={{ maxHeight: '420px', objectFit: 'cover' }}
            />
          </div>
          <div className="col-lg-7 ps-lg-5">
            <h3 className="font-weight-bold">Deteksi Ras Anjing Secara Otomatis</h3>
            <p className="mt-3">
              Sistem ini dirancang untuk mengenali ras anjing dari gambar menggunakan teknologi Computer Vision.
              Fitur ini membantu proses identifikasi visual tanpa perlu keahlian khusus.
            </p>
            <p className="text-muted">
              Seluruh proses klasifikasi berjalan di sisi klien (browser Anda). Gambar Anda tidak pernah dikirim ke server luar, menjaga privasi data Anda tetap aman dan proses klasifikasi berjalan sangat cepat tanpa beban lalu lintas internet.
            </p>
          </div>
        </div>

        <div className="row mt-5 pt-3">
          <div className="col-lg-7">
            <h3 className="font-weight-bold">Fokus pada Klasifikasi Ras Anjing</h3>
            <p className="mt-3 text-secondary">
              Model AI kami mampu mengklasifikasikan berbagai ras anjing dengan akurat berdasarkan ciri visual.
              Prediksi ditampilkan secara instan berdasarkan gambar yang kamu unggah.
            </p>
            <p className="mt-4 fw-bold">Fitur yang tersedia:</p>
            <ul className="custom ps-0 mt-2">
              <li className="mb-2">Menampilkan hasil prediksi ras anjing secara jelas</li>
              <li className="mb-2">Disertai tingkat keyakinan (%) untuk menilai akurasi model</li>
              <li className="mb-2">Gambar input ditampilkan sebagai referensi visual pengguna</li>
              <li className="mb-2">Tidak memerlukan login atau input tambahan</li>
              <li className="mb-2">Mendukung format gambar umum seperti JPG, JPEG, dan PNG</li>
            </ul>
          </div>

          <div className="col-lg-5 mt-4 mt-lg-0">
            <div id="accordion" className="accordion-cards">
              {/* Card 1: Tujuan */}
              <div className="card shadow-sm border-0">
                <div 
                  className={`card-header d-flex justify-content-between align-items-center ${activeItem === 'tujuan' ? 'bg-primary text-white' : ''}`}
                  onClick={() => toggleAccordion('tujuan')}
                  style={{ cursor: 'pointer' }}
                >
                  <h6 className={`mb-0 accordion-header ${activeItem === 'tujuan' ? 'text-white' : 'text-dark'}`}>
                    Tujuan
                  </h6>
                  <i className={`fas ${activeItem === 'tujuan' ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </div>
                <div className={`collapse ${activeItem === 'tujuan' ? 'show' : ''}`}>
                  <div className="card-body bg-white text-secondary">
                    <p className="mb-0">
                      Proyek ini dikembangkan sebagai solusi untuk mengenali ras anjing secara otomatis.
                      Pendekatannya berfokus pada implementasi teknologi deteksi berbasis citra digital dan kecerdasan buatan.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Mengapa */}
              <div className="card shadow-sm border-0 mt-3">
                <div 
                  className={`card-header d-flex justify-content-between align-items-center ${activeItem === 'mengapa' ? 'bg-primary text-white' : ''}`}
                  onClick={() => toggleAccordion('mengapa')}
                  style={{ cursor: 'pointer' }}
                >
                  <h6 className={`mb-0 accordion-header ${activeItem === 'mengapa' ? 'text-white' : 'text-dark'}`}>
                    Mengapa Sistem Ini?
                  </h6>
                  <i className={`fas ${activeItem === 'mengapa' ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </div>
                <div className={`collapse ${activeItem === 'mengapa' ? 'show' : ''}`}>
                  <div className="card-body bg-white text-secondary">
                    <p className="mb-0">
                      Sistem ini dapat digunakan tanpa pengalaman teknis, cukup dengan mengunggah gambar anjing.
                      Hasil deteksi ditampilkan secara cepat dan informatif untuk setiap input gambar.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3: Akurasi */}
              <div className="card shadow-sm border-0 mt-3">
                <div 
                  className={`card-header d-flex justify-content-between align-items-center ${activeItem === 'akurasi' ? 'bg-primary text-white' : ''}`}
                  onClick={() => toggleAccordion('akurasi')}
                  style={{ cursor: 'pointer' }}
                >
                  <h6 className={`mb-0 accordion-header ${activeItem === 'akurasi' ? 'text-white' : 'text-dark'}`}>
                    Akurasi Berbasis Dataset Gambar
                  </h6>
                  <i className={`fas ${activeItem === 'akurasi' ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </div>
                <div className={`collapse ${activeItem === 'akurasi' ? 'show' : ''}`}>
                  <div className="card-body bg-white text-secondary">
                    <p className="mb-0">
                      Model dilatih menggunakan dataset gambar ras anjing dari berbagai sumber publik.
                      Algoritma yang digunakan mendeteksi fitur visual utama untuk mengenali ras secara tepat.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
