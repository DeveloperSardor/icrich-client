import React from 'react';
import './style.css'; // Add custom styles here

const Fotogalereya = () => {
  const photos = [
    { src: 'https://admin.ichlinks.uz/uploads/onalar_allasi_81ce528467.jpg', alt: 'Image 1 Description' },
    { src: 'https://admin.ichlinks.uz/uploads/badiiy_jamoa_48ed0c2b16.jpeg', alt: 'Image 2 Description' },
    { src: 'https://admin.ichlinks.uz/uploads/onalar_allasi_81ce528467.jpg', alt: 'Image 3 Description' },
    { src: 'https://admin.ichlinks.uz/uploads/photo_2024_08_16_12_54_21_e571edebf0.jpg', alt: 'Image 4 Description' },
    { src: 'https://admin.ichlinks.uz/uploads/badiiy_jamoa_48ed0c2b16.jpeg', alt: 'Image 5 Description' },
  ];

  return (
    <section className="fotogalereya">
      <div className="header__">
        <h2>Fotogalereya</h2>
        <a href="/all-photos" className="view-all">Barcha suratlar →</a>
      </div>
      <div className="photo-grid">
        {photos.map((photo, index) => (
          <div key={index} className="photo-card">
            <img src={photo.src} alt={photo.alt} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Fotogalereya;
