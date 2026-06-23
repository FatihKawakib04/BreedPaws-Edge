import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="page home-page">
      {/* Video Header */}
      <div id="video-header" className="ratio ratio-16x9">
        <div className="video-overlay"></div>
        <video id="bgvid" playsInline autoPlay muted loop poster="/static/videos/placeholder-video.jpg">
          <source src="/static/videos/video1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-text">
          <h1>Welcome to</h1>
          <div className="navbar-brand m-0">
            <i className="flaticon-dog-training-3"></i><span>BreedPaws!</span>
          </div>
        </div>
      </div>
      {/* Video Ends */}

      {/* Section Services */}
      <section id="services" className="cat-bg3 py-5">
        <div className="container">
          <div className="section-heading text-center mb-5">
            <h2>Our Services</h2>
          </div>
          <div className="container pt-0">
            <div className="row align-items-center">
              <div className="col-xl-6 my-auto mb-4 mb-xl-0">
                <h3>Deteksi Cepat Ras Anjing dari Gambar</h3>
                <p className="mt-3">
                  Solusi cerdas identifikasi ras anjing, coba deteksi rasnya sekarang!
                  Cukup unggah foto dan biarkan teknologi kami bekerja mengenali ras anjing hanya dalam hitungan detik.
                </p>
                <ul className="custom ps-0 mt-4">
                  <li>Unggah gambar anjing</li>
                  <li>Sistem akan memproses dan menampilkan ras</li>
                  <li>Hasil akurat, cepat, dan mudah digunakan di browser Anda</li>
                </ul>
                <div className="mt-4">
                  <Link to="/services" className="btn btn-primary">
                    Mulai Deteksi Sekarang
                  </Link>
                </div>
              </div>
              <div className="col-xl-6 text-center">
                <img 
                  src="/static/img/gambar1.jpg" 
                  alt="Dog classification illustration" 
                  className="img-fluid border-irregular1 border-double" 
                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Triangle SVG Divider */}
      <svg 
        id="bigTriangleColor" 
        className="d-none d-sm-block" 
        xmlns="http://www.w3.org/2000/svg" 
        version="1.1" 
        width="100%" 
        height="100" 
        viewBox="0 0 100 102" 
        preserveAspectRatio="none"
        style={{ fill: '#f8f9fa', background: 'transparent' }}
      >
        <path d="M0 0 L50 100 L100 0 Z" />
      </svg>

      {/* Section About Us */}
      <section id="about" className="dog-bg2 py-5 bg-light">
        <div className="container">
          <div className="section-heading text-center mb-5">
            <h2>About Us</h2>
          </div>
          <div className="row align-items-center">
            <div className="col-lg-6 order-2 order-lg-1 text-center">
              <img 
                src="/static/img/gambar3.jpg" 
                alt="About BreedPaws" 
                className="img-fluid border-irregular1"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
            </div>
            <div className="col-lg-6 order-1 order-lg-2 my-auto mb-4 mb-lg-0">
              <h3>Mengenali Anjing dengan Teknologi</h3>
              <p className="mt-3">
                Website ini dibuat untuk membantu mengidentifikasi ras anjing secara cepat dan akurat menggunakan teknologi Computer Vision.
                Kami hadir sebagai solusi bagi relawan, klinik hewan, dan pecinta hewan dalam mengenali ras anjing, terutama yang tidak memiliki dokumen resmi.
              </p>
              <p className="mt-3"><strong>Langkah Mudah:</strong></p>
              <ul className="custom ps-0">
                <li>Buka halaman <strong>Services</strong></li>
                <li>Unggah atau seret foto anjing Anda</li>
                <li>Model AI lokal di browser akan mendeteksi ras secara instan</li>
              </ul>
              <div className="mt-4">
                <Link to="/about" className="btn btn-secondary">
                  Pelajari Lebih Lanjut
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Contact Us */}
      <section id="contact" className="dog-bg3 py-5">
        <div className="container">
          <div className="section-heading text-center mb-5">
            <h2>Contact Us</h2>
          </div>
          
          <div className="row text-center g-4">
            <div className="col-md-6 col-lg-3">
              <div className="contact-icon p-4 card-premium h-100">
                <i className="fa fa-envelope top-icon mb-3" style={{ fontSize: '2rem', color: '#f39c12' }}></i>
                <h5>Send us a Message</h5>
                <p className="mb-0">
                  <a href="mailto:breedpaws@apps.ipb.ac.id" className="text-secondary">
                    breedpaws@apps.ipb.ac.id
                  </a>
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="contact-icon p-4 card-premium h-100">
                <i className="fa fa-map-marker top-icon mb-3" style={{ fontSize: '2rem', color: '#f39c12' }}></i>
                <h5>Visit our Location</h5>
                <p className="mb-0 text-secondary" style={{ fontSize: '0.9rem' }}>
                  Jl. Kumbang No.14, RT.02/RW.06, Babakan, Kec. Bogor Tengah, Kota Bogor, Jawa Barat 16128
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="contact-icon p-4 card-premium h-100">
                <i className="fa fa-phone top-icon mb-3" style={{ fontSize: '2rem', color: '#f39c12' }}></i>
                <h5>Call us today</h5>
                <p className="mb-0 text-secondary" style={{ fontSize: '0.9rem' }}>
                  <a href="https://wa.me/6282114818279" className="d-block text-secondary">+62 821-1481-8279</a>
                  <a href="https://wa.me/6281264223195" className="d-block text-secondary">+62 812-6422-3195</a>
                  <a href="https://wa.me/6285158995655" className="d-block text-secondary">+62 851-5899-5655</a>
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="contact-icon p-4 card-premium h-100">
                <i className="fab fa-instagram top-icon mb-3" style={{ fontSize: '2rem', color: '#f39c12' }}></i>
                <h5>Social Media</h5>
                <p className="mb-0">
                  <a href="https://www.instagram.com/pvt.ipbofficial/" target="_blank" rel="noopener noreferrer" className="d-block text-secondary">
                    @pvt.ipbofficial
                  </a>
                  <a href="https://www.tiktok.com/@pvt.ipbuniversity?_t=8l9pZbzguKv&_r=1" target="_blank" rel="noopener noreferrer" className="d-block text-secondary">
                    TikTok: pvt.ipbuniversity
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 text-center">
            <Link to="/contact" className="btn btn-primary">
              Hubungi Kami & Peta Lokasi
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
