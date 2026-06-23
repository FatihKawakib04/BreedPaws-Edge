import { useState } from 'react';

interface GalleryImage {
  src: string;
  breed: string;
}

const galleryImages: GalleryImage[] = [
  { src: '/static/img/gallery/gallery-Chihuahua.jpg', breed: 'Chihuahua' },
  { src: '/static/img/gallery/gallery-cute-husky-sitting-grass.jpg', breed: 'Siberian Husky' },
  { src: '/static/img/gallery/gallery-cute-pomeranian-dog-park.jpg', breed: 'Pomeranian' },
  { src: '/static/img/gallery/gallery-french-bulldog-puppy-looking-camera-with-its-head-tilted-side.jpg', breed: 'French Bulldog' },
  { src: '/static/img/gallery/gallery-happy-pet-dogs-playing-park.jpg', breed: 'Playful Dogs' },
  { src: '/static/img/gallery/gallery-portrait-cute-white-longhaired-maltese-puppy-is-4-month-old-picture.jpg', breed: 'Maltese' },
  { src: '/static/img/gallery/gallery-rottweiler-nature.jpg', breed: 'Rottweiler' },
  { src: '/static/img/gallery/gallery-selective-focus-shot-adorable-german-shepherd-outdoors-daylight.jpg', breed: 'German Shepherd' },
  { src: '/static/img/gallery/gallery-shih-tzu-dog-relaxing-sofa-living-room.jpg', breed: 'Shih Tzu' },
  { src: '/static/img/gallery/gallery-side-view-cute-dog-park.jpg', breed: 'Happy Dog' }
];

function Gallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const openLightbox = (img: GalleryImage) => {
    setSelectedImage(img);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <div className="page gallery-page">
      {/* Jumbotron */}
      <div className="jumbotron jumbotron-fluid overlay">
        <div className="jumbo-heading">
          <div className="section-heading">
            <h1>Gallery</h1>
          </div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item active" aria-current="page">Gallery</li>
            </ol>
          </nav>
        </div>
      </div>
      {/* /jumbotron */}

      {/* Page Content */}
      <div className="container block-padding">
        <div className="text-center mb-4">
          <h3>Galeri Foto Anjing</h3>
          <p className="subtitle text-muted">
            Koleksi foto menggemaskan dari berbagai ras anjing populer. Klik gambar untuk melihat ukuran penuh.
          </p>
        </div>

        {/* CSS Grid Gallery */}
        <div className="gallery-grid">
          {galleryImages.map((image, index) => (
            <div 
              key={index} 
              className="gallery-card"
              onClick={() => openLightbox(image)}
            >
              <img 
                src={image.src} 
                alt={image.breed} 
                className="border-double border-irregular1"
              />
              <div className="gallery-overlay">
                <span className="gallery-overlay-text">{image.breed}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="lightbox-modal" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              <i className="fas fa-times"></i>
            </button>
            <img src={selectedImage.src} alt={selectedImage.breed} />
            <div className="lightbox-caption">{selectedImage.breed}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
