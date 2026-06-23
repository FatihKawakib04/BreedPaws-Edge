import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    // Reset notification after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div className="page contact-page pb-5">
      {/* Jumbotron */}
      <div className="jumbotron jumbotron-fluid overlay">
        <div className="jumbo-heading">
          <div className="section-heading">
            <h1>Contact Us</h1>
          </div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item active" aria-current="page">Contact Us</li>
            </ol>
          </nav>
        </div>
      </div>
      {/* /jumbotron */}

      {/* Page Content */}
      <div className="container block-padding">
        <div className="row g-5">
          {/* Contact Form */}
          <div className="col-lg-6">
            <div className="card-premium p-4 p-md-5 border-0 shadow-sm">
              <h4 className="font-weight-bold mb-4">Send us a message!</h4>
              
              {isSubmitted && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <strong>Pesan terkirim!</strong> Terima kasih telah menghubungi kami. Kami akan merespon secepatnya.
                </div>
              )}

              <form onSubmit={handleSubmit} id="contact_form">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Name <span className="text-danger">*</span></label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-control" 
                      required 
                    /> 
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email Address <span className="text-danger">*</span></label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-control" 
                      required 
                    /> 
                  </div>
                  <div className="col-12">
                    <label className="form-label">Subject</label>
                    <input 
                      type="text" 
                      name="subject" 
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="form-control" 
                    /> 
                  </div>
                  <div className="col-12">
                    <label className="form-label">Message <span className="text-danger">*</span></label>
                    <textarea 
                      name="message" 
                      id="message" 
                      value={formData.message}
                      onChange={handleInputChange}
                      className="form-control" 
                      rows={5}  
                      required
                    ></textarea>
                  </div>
                  <div className="col-12 mt-4">
                    <button type="submit" id="submit_btn" className="btn btn-primary w-100 py-2.5">
                      Send message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="col-lg-6">
            <div className="card h-100 bg-secondary text-light border-0 rounded-4 shadow-sm p-4 p-md-5">
              <div className="contact-info">
                <h4 className="font-weight-bold text-white mb-4">Contact Information</h4>
                <p className="text-light-50 mb-5">
                  Hubungi kami melalui saluran komunikasi resmi di bawah ini atau kunjungi kantor sekretariat kami di Bogor.
                </p>

                <ul className="list-unstyled mt-4 list-contact">
                  <li className="h7 mb-4 d-flex align-items-start">
                    <i className="fa fa-envelope margin-icon text-primary me-3 mt-1" style={{ fontSize: '1.2rem' }}></i>
                    <div>
                      <span className="d-block text-white fw-bold">Email</span>
                      <a href="mailto:breedpaws@apps.ipb.ac.id" className="text-light text-decoration-none">
                        breedpaws@apps.ipb.ac.id
                      </a>
                    </div>
                  </li>
                  
                  <li className="h7 mb-4 d-flex align-items-start">
                    <i className="fa fa-phone margin-icon text-primary me-3 mt-1" style={{ fontSize: '1.2rem' }}></i>
                    <div>
                      <span className="d-block text-white fw-bold">WhatsApp / Telepon</span>
                      <a href="https://wa.me/6282114818279" className="d-block text-light text-decoration-none">+62 821-1481-8279</a>
                      <a href="https://wa.me/6281264223195" className="d-block text-light text-decoration-none">+62 812-6422-3195</a>
                      <a href="https://wa.me/6285158995655" className="d-block text-light text-decoration-none">+62 851-5899-5655</a>
                    </div>
                  </li>

                  <li className="h7 mb-4 d-flex align-items-start">
                    <i className="fa fa-map-marker margin-icon text-primary me-3 mt-1" style={{ fontSize: '1.2rem' }}></i>
                    <div>
                      <span className="d-block text-white fw-bold">Alamat</span>
                      <span className="text-light">
                        Jl. Kumbang No.14, RT.02/RW.06, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128
                      </span>
                    </div>
                  </li>

                  <li className="h7 d-flex align-items-start">
                    <i className="fab fa-instagram margin-icon text-primary me-3 mt-1" style={{ fontSize: '1.2rem' }}></i>
                    <div>
                      <span className="d-block text-white fw-bold">Social Media</span>
                      <a href="https://www.instagram.com/pvt.ipbofficial/" target="_blank" rel="noopener noreferrer" className="text-light text-decoration-none d-block">
                        Instagram: @pvt.ipbofficial
                      </a>
                      <a href="https://www.tiktok.com/@pvt.ipbuniversity?_t=8l9pZbzguKv&_r=1" target="_blank" rel="noopener noreferrer" className="text-light text-decoration-none d-block">
                        TikTok: pvt.ipbuniversity
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Embedded Google Map */}
        <div className="mt-5 rounded-4 overflow-hidden border shadow-sm">
          <iframe 
            src="https://maps.google.com/maps?q=Jl.%20Kumbang%20No.14,%20Babakan,%20Kecamatan%20Bogor%20Tengah,%20Kota%20Bogor,%20Jawa%20Barat%2016128&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps Location of BreedPaws"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Contact;
