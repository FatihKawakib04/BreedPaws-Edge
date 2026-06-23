import React, { useState, useEffect, useRef } from 'react';
import { modelService } from './services/modelService';
import type { PredictionResult } from './services/modelService';

function App() {
  // Preloader State
  const [loading, setLoading] = useState(true);

  // Navigation and Layout State
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Model Loading State
  const [modelStatus, setModelStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  // Prediction State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);

  // Ref for file input and tracking latest preview URL to prevent race conditions
  const fileInputRef = useRef<HTMLInputElement>(null);
  const latestPreviewUrlRef = useRef<string | null>(null);

  // Fade out preloader on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Listen to window scroll to apply fixed nav classes
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load TensorFlow.js model in the background on mount
  useEffect(() => {
    const initModel = async () => {
      try {
        await modelService.loadModel();
        setModelStatus('ready');
      } catch (error) {
        console.error('Failed to pre-load model:', error);
        setModelStatus('error');
      }
    };
    initModel();
  }, []);

  // Handle image file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPrediction(null);
      setPredictionError(null);
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      latestPreviewUrlRef.current = url; // Record url in ref
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (isPredicting) return; // Prevent change during prediction
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPrediction(null);
      setPredictionError(null);
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      latestPreviewUrlRef.current = url; // Record url in ref

      if (fileInputRef.current) {
        // Create a new DataTransfer object to sync back to file input if needed
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  };

  // Run TensorFlow.js local inference
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl) {
      setPredictionError('Silakan pilih gambar terlebih dahulu.');
      return;
    }

    setIsPredicting(true);
    setPredictionError(null);
    setPrediction(null);

    const submittedUrl = previewUrl;

    try {
      // Create a temporary HTMLImageElement
      const img = new Image();
      img.src = previewUrl;

      // Wait for image loading
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Gagal memuat gambar pratinjau.'));
      });

      // Run local inference
      const result = await modelService.predict(img);
      
      // Prevent race conditions: check if the preview URL is still what was submitted
      if (latestPreviewUrlRef.current === submittedUrl) {
        setPrediction(result);
      }
    } catch (err) {
      console.error('Inference error:', err);
      if (latestPreviewUrlRef.current === submittedUrl) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memproses gambar.';
        setPredictionError(errorMessage);
      }
    } finally {
      if (latestPreviewUrlRef.current === submittedUrl) {
        setIsPredicting(false);
      }
    }
  };

  // Reset predictor interface
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction(null);
    setPredictionError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      {/* Preloader */}
      {loading && (
        <div id="preloader" style={{ opacity: 1, visibility: 'visible', transition: 'all 0.5s ease' }}>
          <div className="spinner">
            <div className="bounce1"></div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav id="main-nav" className={`navbar-expand-xl ${scrolled ? 'fixed-top' : ''}`}>
        {/* Start Top Bar */}
        <div className="container-fluid top-bar" style={{ display: scrolled ? 'none' : 'block' }}>
          <div className="container">
            <div className="row">
              {/* Optional top-bar details can go here */}
            </div>
          </div>
        </div>
        {/* End Top bar */}
        
        {/* Navbar */}
        <div className="navbar container-fluid">
          <div className="container">
            {/* Logo */}
            <a className="navbar-brand" href="#top">
              <i className="flaticon-dog-training-3"></i><span>BreedPaws!</span>
            </a>

            {/* Navbartoggler */}
            <button 
              className="navbar-toggler" 
              type="button" 
              onClick={() => setNavOpen(!navOpen)}
              aria-controls="navbarResponsive" 
              aria-expanded={navOpen} 
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggle-icon">
                <i className="fas fa-bars"></i>
              </span>
            </button>

            {/* Collapse responsive menu */}
            <div className={`collapse navbar-collapse ${navOpen ? 'show' : ''}`} id="navbarResponsive">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <a className="nav-link active" href="#top" onClick={() => setNavOpen(false)}>Home</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#services" onClick={() => setNavOpen(false)}>Services</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#about" onClick={() => setNavOpen(false)}>About</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#contact" onClick={() => setNavOpen(false)}>Contact</a>
                </li>
                
                {/* Dropdown menu */}
                <li 
                  className={`nav-item dropdown ${dropdownOpen ? 'show' : ''}`}
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <a 
                    className="nav-link dropdown-toggle" 
                    href="#" 
                    id="others-dropdown" 
                    role="button"
                    aria-expanded={dropdownOpen}
                  >
                    Other pages
                  </a>
                  <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`} aria-labelledby="others-dropdown">
                    <a className="dropdown-item" href="#about" onClick={() => { setDropdownOpen(false); setNavOpen(false); }}>Our Team</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Video Header */}
      <div id="video-header" className="ratio ratio-16x9">
        <div className="video-overlay"></div>
        <video id="bgvid" playsInline autoPlay muted loop>
          <source src="/static/videos/video1.mp4" type="video/mp4" />
        </video>
        <div className="video-text">
          <h1>Welcome to</h1>
          <div className="navbar-brand">
            <i className="flaticon-dog-training-3"></i><span>BreedPaws!</span>
          </div>
        </div>
      </div>

      {/* Section Services & Dog Breed Prediction */}
      <section id="services" className="cat-bg3 block-padding">
        <div className="container">
          <div className="section-heading text-center">
            <h2>Our Services</h2>
          </div>

          <div className="container block-padding pt-0">
            <div className="row">
              {/* Left Column: Copy & Details */}
              <div className="col-xl-5 my-auto">
                <h3>Deteksi Cepat Ras Anjing dari Gambar</h3>
                <p>Solusi cerdas identifikasi ras anjing, coba deteksi rasnya sekarang!
                   Cukup unggah foto dan biarkan teknologi kami bekerja mengenali ras anjing hanya dalam hitungan detik.</p>
                
                <ul className="custom ps-0">
                  <li>Unggah gambar anjing pilihan Anda</li>
                  <li>Sistem akan memproses gambar secara instan</li>
                  <li>Hasil identifikasi ditampilkan langsung di browser Anda</li>
                </ul>

                {/* Model status indicator badge */}
                <div className="mt-4 p-3 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)', border: '1px solid #ddd' }}>
                  <h6 className="mb-2"><i className="fas fa-microchip me-2 text-primary"></i>Status Model AI:</h6>
                  {modelStatus === 'loading' && (
                    <span className="text-warning">
                      <i className="fas fa-spinner fa-spin me-2"></i>Memuat model di browser (100% Client-side)...
                    </span>
                  )}
                  {modelStatus === 'ready' && (
                    <span className="text-success fw-bold">
                      <i className="fas fa-check-circle me-2"></i>Model AI Siap (Edge Computing)
                    </span>
                  )}
                  {modelStatus === 'error' && (
                    <span className="text-danger">
                      <i className="fas fa-times-circle me-2"></i>Gagal memuat model. Hubungkan internet untuk memuat file shard.
                    </span>
                  )}
                </div>
              </div>

              {/* Right Column: Prediction Engine Form Card */}
              <div className="col-xl-7 mt-5 mt-xl-0">
                <div className="card shadow border-irregular1 border-double bg-white">
                  <div className="card-body p-4">
                    <h4 className="card-title text-center mb-4" style={{ color: '#555' }}>
                      <i className="flaticon-dog-training-3 me-2"></i>Prediksi Ras Anjing
                    </h4>

                    <form onSubmit={handleSubmit}>
                      {/* Drag & Drop Upload Zone */}
                      <div 
                        className="border rounded p-4 text-center mb-4 position-relative"
                        style={{
                          borderStyle: 'dashed !important',
                          borderColor: selectedFile ? '#28a745' : '#ccc',
                          backgroundColor: '#f8f9fa',
                          cursor: isPredicting ? 'not-allowed' : 'pointer',
                          opacity: isPredicting ? 0.7 : 1,
                          transition: 'all 0.2s'
                        }}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => {
                          if (!isPredicting) {
                            fileInputRef.current?.click();
                          }
                        }}
                      >
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="d-none" 
                          accept="image/*" 
                          onChange={handleFileChange}
                          disabled={isPredicting}
                        />
                        {previewUrl ? (
                          <div className="position-relative">
                            <img 
                              src={previewUrl} 
                              alt="Dog Preview" 
                              className="img-fluid rounded shadow-sm" 
                              style={{ maxHeight: '220px', objectFit: 'contain' }}
                            />
                            <p className="mt-2 text-success small"><i className="fas fa-check-circle"></i> Gambar berhasil dipilih</p>
                          </div>
                        ) : (
                          <div>
                            <i className="fas fa-cloud-upload-alt fa-3x mb-3 text-muted"></i>
                            <p className="mb-1 fw-bold">Klik untuk memilih gambar atau seret file ke sini</p>
                            <p className="text-muted small">Mendukung format JPG, JPEG, PNG</p>
                          </div>
                        )}
                      </div>

                      {/* Prediction Control Buttons */}
                      <div className="d-flex gap-2 justify-content-center">
                        <button 
                          type="submit" 
                          className="btn btn-primary px-4 py-2" 
                          disabled={isPredicting || !selectedFile || modelStatus !== 'ready'}
                          style={{ minWidth: '150px' }}
                        >
                          {isPredicting ? (
                            <>
                              <i className="fas fa-spinner fa-spin me-2"></i>Memproses...
                            </>
                          ) : (
                            'Prediksi Ras'
                          )}
                        </button>
                        {selectedFile && (
                          <button 
                            type="button" 
                            className="btn btn-secondary px-3 py-2" 
                            onClick={handleReset}
                            disabled={isPredicting}
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </form>

                    {/* Inference Results Section */}
                    {isPredicting && (
                      <div className="mt-4 text-center">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2 text-muted">TensorFlow.js sedang menganalisis piksel gambar...</p>
                      </div>
                    )}

                    {prediction && (
                      <div className="mt-4 p-3 rounded" style={{ backgroundColor: '#eef9f1', borderLeft: '5px solid #28a745' }}>
                        <h5 className="alert-heading text-success mb-3">
                          <i className="fas fa-check-double me-2"></i>Hasil Prediksi
                        </h5>
                        <p className="mb-2 fs-5">
                          <strong>Ras Anjing:</strong> <span className="text-primary fw-bold">{prediction.breed}</span>
                        </p>
                        <p className="mb-1">
                          <strong>Tingkat Keyakinan (Confidence):</strong> <span className="fw-bold">{(prediction.confidence * 100).toFixed(2)}%</span>
                        </p>
                        
                        {/* Dynamic Progress Bar */}
                        <div className="progress mt-2" style={{ height: '12px', borderRadius: '6px' }}>
                          <div 
                            className="progress-bar progress-bar-striped progress-bar-animated bg-success" 
                            role="progressbar" 
                            style={{ width: `${prediction.confidence * 100}%` }}
                            aria-valuenow={prediction.confidence * 100} 
                            aria-valuemin={0} 
                            aria-valuemax={100}
                          ></div>
                        </div>
                      </div>
                    )}

                    {predictionError && (
                      <div className="mt-4 alert alert-danger" role="alert">
                        <i className="fas fa-exclamation-triangle me-2"></i>{predictionError}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SVG Separation Effect */}
      <svg id="bigTriangleColor" className="d-none d-sm-block" xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="100" viewBox="0 0 100 102" preserveAspectRatio="none">
        <path d="M0 0 L50 100 L100 0 Z" />
      </svg>

      {/* Section About Us */}
      <section id="about" className="dog-bg2 block-padding">
        <div className="container">
          <div className="section-heading text-center">
            <h2>About Us</h2>
          </div>
          
          <div className="container block-padding pt-0">
            <div className="row">
              <div className="col-lg-6 my-auto">
                <h3>Mengenali Anjing dengan Teknologi</h3>
                <p>Website ini dibuat untuk membantu mengidentifikasi ras anjing secara cepat dan akurat menggunakan teknologi Computer Vision. Kami hadir sebagai solusi bagi relawan, klinik hewan, dan pecinta hewan dalam mengenali ras anjing, terutama yang tidak memiliki dokumen resmi.</p>
                <p>Proyek ini mengimplementasikan machine learning berbasis <strong>Edge Computing</strong>. Ini berarti model kecerdasan buatan dijalankan 100% secara lokal di browser Anda (melalui TensorFlow.js) tanpa mengirimkan gambar Anda ke server backend, menjaga privasi data Anda tetap aman dan menghemat bandwidth.</p>
                
                <h5 className="mt-4">Cara Kerja:</h5>
                <ul className="custom ps-0">
                  <li>Unggah foto anjing dari komputer atau handphone Anda.</li>
                  <li>Aplikasi melakukan pra-pemrosesan gambar (resizing, normalisasi).</li>
                  <li>Model Deep Learning (InceptionV3) melakukan prediksi langsung secara lokal.</li>
                </ul>
              </div>
              <div className="col-lg-6 mt-5 mt-lg-0 text-center">
                <img 
                  src="/static/img/gambar3.jpg" 
                  alt="About Us Dog" 
                  className="img-fluid border-irregular1 shadow-lg" 
                  style={{ maxWidth: '90%', border: '10px double #fff' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Contact */}
      <section id="contact" className="dog-bg3 block-padding">
        <div className="container">
          <div className="section-heading text-center">
            <h2>Contact Us</h2>
          </div>
        </div>
        
        <div className="container">
          <div className="row">
            {/* Embedded Responsive Google Map */}
            <div className="col-lg-12 text-center">
              <div className="mt-3 border-irregular1 mx-auto shadow-sm" style={{ maxWidth: '800px', overflow: 'hidden', height: '350px' }}>
                <iframe 
                  title="BreedPaws Location Map"
                  src="https://maps.google.com/maps?q=Jl.%20Kumbang%20No.14,%20RT.02/RW.06,%20Babakan,%20Bogor&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true}
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>

          <div className="row res-margin mt-5">
            {/* Contact Details Grid */}
            <div className="col-lg-6 mt-5">
              <div className="contact-icon">
                <i className="fa fa-envelope top-icon"></i>
                <div className="contact-icon-info">
                  <h5>Send us a Message</h5>
                  <p className="h7"><a href="mailto:breedpaws@xyz.com">breedpaws@xyz.com</a></p>
                </div>
              </div>
            </div>

            <div className="col-lg-6 mt-5">
              <div className="contact-icon">
                <i className="fa fa-map-marker top-icon"></i>
                <div className="contact-icon-info">
                  <h5>Visit our Location</h5>
                  <p className="h7">Jl. Kumbang No.14, RT.02/RW.06, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128</p>
                </div>
              </div>
            </div>

            <div className="col-lg-6 mt-5">
              <div className="contact-icon">
                <i className="fa fa-phone top-icon"></i>
                <div className="contact-icon-info">
                  <h5>Call us today</h5>
                  <p className="h7">| 
                    <a href="https://wa.me/6282114818279" className="ms-1" target="_blank" rel="noreferrer">+62 821-1481-8279</a> | 
                    <a href="https://wa.me/6281264223195" className="ms-1" target="_blank" rel="noreferrer">+62 812-6422-3195</a> | 
                    <a href="https://wa.me/6285158995655" className="ms-1" target="_blank" rel="noreferrer">+62 851-5899-5655</a> |
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-6 mt-5">
              <div className="contact-icon">
                <i className="fa fa-heart top-icon"></i>
                <div className="contact-icon-info">
                  <h5>Follow us on Social Media</h5>
                  <ul className="social-media">
                    <li><a href="https://www.tiktok.com/@pvt.ipbuniversity?_t=8l9pZbzguKv&_r=1" target="_blank" rel="noreferrer"><i className="fab fa-tiktok"></i></a></li>
                    <li><a href="https://www.instagram.com/pvt.ipbofficial/" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <a className="navbar-brand" href="#top"><i className="flaticon-dog-training-3"></i><span>BreedPaws!</span></a>
              <p className="mt-3">BreedPaws uses AI technology to help identify dog breeds from images, improving decision-making for adoption and care. 
                 By focusing on local breeds, our system contributes to better animal welfare in Indonesia.</p>
            </div>
            
            <div className="col-lg-3">
              <h6><i className="fas fa-envelope margin-icon"></i>Contact Us</h6>
              <ul className="list-unstyled">
                <li>+62 821-1481-8279 | +62 812-6422-3195 | +62 851-5899-5655 |</li>
                <li><a href="mailto:breedpaws@apps.ipb.ac.id">breedpaws@apps.ipb.ac.id</a></li>
                <li>Jl. Kumbang No.14, RT.02/RW.06, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128</li>
              </ul>
            </div>
            
            <div className="col-lg-3">
              <h6><i className="far fa-clock margin-icon"></i>Working Hours</h6>
              <ul className="list-unstyled">
                <li>Open 7am - 7pm</li>
                <li>Holidays - Closed</li>
                <li>Weekends - Closed</li>
              </ul>
            </div>
          </div>
          
          <div className="row">
            <div className="credits col-sm-12">
              <p>Designed by <a href="#top">Fatih | Yordi | Najla</a> &copy; {new Date().getFullYear()}</p>
            </div>
          </div>
        </div>

        {/* Go To Top Link */}
        <div className="d-none d-md-block">
          <a href="#top" className="back-to-top" style={{ display: scrolled ? 'block' : 'none', opacity: scrolled ? 1 : 0, transition: 'opacity 0.3s' }}>
            <i className="fa fa-angle-up"></i>
          </a>
        </div>
      </footer>
    </>
  );
}

export default App;
