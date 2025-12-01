import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './style.css';
import Context from '../../context/Context.jsx'
import {useTranslation} from 'react-i18next'

const ExpeditionPage = () => {
  const contextDatas = useContext(Context)
  const currentLang = contextDatas.currentLang;
  const [showMoreImages, setShowMoreImages] = useState(false);
  const [uneskoData, setUneskoData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [t, i18n] = useTranslation('global')
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

  const handleToggleImages = () => {
    setShowMoreImages(!showMoreImages);
  };

  const handleNextData = () => {
    if (currentIndex < uneskoData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevData = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  useEffect(() => {
    const fetchUneskoData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/expedition`);
        setUneskoData(response.data.data); // Assuming your API returns data in 'data' field
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchUneskoData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const images = uneskoData[currentIndex]?.images || [];
  const displayedImages = showMoreImages ? images : images.slice(0, 6);

  // Extract the video ID from YouTube link to ensure correct URL format
  const getYouTubeEmbedUrl = (url) => {
    const videoId = url?.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|\S+\/?|\S+)?(?:v=|e(?:mbed\/)?)|youtu\.be\/)([\w\-]+)/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
  };

  return (
    <div className="expedition-container">
      <h1 className="page-title"> {t('navbar.nmm.expedition')}</h1>

      {/* Video Section */}
      <div className="video-section">
        <iframe
          width="853"
          height="480"
          src={getYouTubeEmbedUrl(uneskoData[currentIndex]?.youtube_link)}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>

      {/* Main Content */}
      <div className="content-section">
        {/* Left Section */}
        <div className="text-card">
          <h3>  {currentLang == 'en' ? uneskoData[currentIndex].title_en : currentLang == 'ru' ? uneskoData[currentIndex].title_ru : uneskoData[currentIndex].title_uz}  </h3>
          <p>  {currentLang == 'en' ? uneskoData[currentIndex].text_en : currentLang == 'ru' ? uneskoData[currentIndex].text_ru : uneskoData[currentIndex].text_uz}  </p>

        </div>

        {/* Right Section */}
        <div className="image-card">
          <div className="image-gallery">
            {displayedImages.map((src, index) => (
              <img key={index} src={src} alt={`Gallery ${index + 1}`} className="gallery-image" />
            ))}
          </div>
          <button className="details-button" onClick={handleToggleImages}>
            {showMoreImages ? t('hide') : t('allImages')}
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <button onClick={handlePrevData} disabled={currentIndex === 0}>{t('prev')}</button>
        <button onClick={handleNextData} disabled={currentIndex === uneskoData.length - 1}>{t('next')}</button>
      </div>
    </div>
  );
};

export default ExpeditionPage;
