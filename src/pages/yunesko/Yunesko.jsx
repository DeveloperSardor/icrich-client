import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./style.css";
import Context from "../../context/Context.jsx";
import { useTranslation } from "react-i18next";

const YuneskoPage = () => {
  const contextDatas = useContext(Context);
  const currentLang = contextDatas.currentLang;
  const [showMoreImages, setShowMoreImages] = useState(false);
  const [uneskoData, setUneskoData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [t] = useTranslation("global");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleToggleImages = () => {
    setShowMoreImages(!showMoreImages);
  };

  const handleNextData = () => {
    if (currentIndex < uneskoData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowMoreImages(false);
    }
  };

  const handlePrevData = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowMoreImages(false);
    }
  };

  useEffect(() => {
    const fetchUneskoData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/api/unesko`);
        setUneskoData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUneskoData();
  }, [BACKEND_URL]);

  if (loading) {
    return (
      <div className="national-container">
        <div className="skeleton-loader">
          <div className="skeleton-title"></div>
          <div className="skeleton-video"></div>
          <div className="skeleton-content">
            <div className="skeleton-text-card">
              <div className="skeleton-heading"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
            </div>
            <div className="skeleton-image-card">
              <div className="skeleton-button"></div>
              <div className="skeleton-gallery">
                <div className="skeleton-image"></div>
                <div className="skeleton-image"></div>
                <div className="skeleton-image"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!uneskoData || uneskoData.length === 0) {
    return (
      <div className="national-container">
        <h1 className="page-title">{t("navbar.nmm.yunesko")}</h1>
        <div className="no-data">
          <p>
            {currentLang === "uz"
              ? "Ma'lumot topilmadi"
              : currentLang === "ru"
              ? "Данные не найдены"
              : "No data found"}
          </p>
        </div>
      </div>
    );
  }

  const images = uneskoData[currentIndex]?.images || [];
  const displayedImages = showMoreImages ? images : images.slice(0, 6);

  const getYouTubeEmbedUrl = (url) => {
    const videoId = url?.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|\S+\/?|\S+)?(?:v=|e(?:mbed\/)?)|youtu\.be\/)([\w\-]+)/
    );
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
  };

  const getText = (field) => {
    const item = uneskoData[currentIndex];
    if (!item) return "";

    if (currentLang === "en") return item[`${field}_en`] || item[`${field}_uz`] || "";
    if (currentLang === "ru") return item[`${field}_ru`] || item[`${field}_uz`] || "";
    return item[`${field}_uz`] || "";
  };

  return (
    <div className="national-container">
      <h1 className="page-title">{t("navbar.nmm.yunesko")}</h1>

      {/* Video Section */}
      <div className="video-section">
        <iframe
          width="853"
          height="480"
          src={getYouTubeEmbedUrl(uneskoData[currentIndex]?.youtube_link)}
          title="YUNESKO jahon merosi ro'yxati"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>

      {/* Main Content */}
      <div className="content-section">
        {/* Left Section - Text with HTML support */}
        <div className="text-card">
          <h3>{getText("title")}</h3>
          <p dangerouslySetInnerHTML={{ __html: getText("text") }} />
        </div>

        {/* Right Section - Images */}
        <div className="image-card">
          <button className="details-button" onClick={handleToggleImages}>
            {showMoreImages 
              ? (currentLang === "uz" ? "Yashirish" : currentLang === "ru" ? "Скрыть" : "Hide")
              : (currentLang === "uz" ? "Barcha rasmlar" : currentLang === "ru" ? "Все изображения" : "All Images")}
          </button>
          <div className="image-gallery">
            {displayedImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Gallery ${index + 1}`}
                className="gallery-image"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <button onClick={handlePrevData} disabled={currentIndex === 0}>
          {currentLang === "uz" ? "Oldingi" : currentLang === "ru" ? "Предыдущий" : "Previous"}
        </button>
        <span className="page-indicator">
          {currentIndex + 1} / {uneskoData.length}
        </span>
        <button
          onClick={handleNextData}
          disabled={currentIndex === uneskoData.length - 1}
        >
          {currentLang === "uz" ? "Keyingi" : currentLang === "ru" ? "Следующий" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default YuneskoPage;