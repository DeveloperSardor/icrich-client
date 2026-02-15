import React, { useContext } from "react";
import Context from '../../context/Context.jsx';
import "./style.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const NewsCard = ({ data }) => {
  const [t, i18n] = useTranslation('global');
  const contextDatas = useContext(Context);
  const navigate = useNavigate();
  const currentLang = contextDatas.currentLang;
  
  const {
    _id, 
    title_uz, 
    title_ru, 
    title_en,  
    text_uz, 
    text_en, 
    text_ru, 
    files, 
    youtube_link 
  } = data;

  // Extract YouTube video ID
  const getYouTubeID = (link) => {
    if (!link) return null;
    try {
      const url = new URL(link);
      if (url.hostname === "youtu.be") {
        return url.pathname.slice(1);
      }
      if (url.hostname.includes("youtube.com")) {
        return url.searchParams.get("v");
      }
    } catch (error) {
      console.error("Invalid YouTube URL:", error);
    }
    return null;
  };

  // HTML matnni qisqartirish funksiyasi
  const truncateHtmlText = (html, maxLength) => {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || "";
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;
  };

  // Til bo'yicha title olish
  const getTitle = () => {
    if (currentLang === 'uz') return title_uz;
    if (currentLang === 'ru') return title_ru;
    return title_en;
  };

  // Til bo'yicha text olish
  const getText = () => {
    if (currentLang === 'uz') return truncateHtmlText(text_uz, 150);
    if (currentLang === 'ru') return truncateHtmlText(text_ru, 150);
    return truncateHtmlText(text_en, 150);
  };

  const videoID = getYouTubeID(youtube_link);

  return (
    <div className="news_card" onClick={() => navigate(`/news/${_id}`)}>
      {/* Media Container */}
      <div className="news_card_media_container">
        {files?.length > 0 ? (
          <img 
            src={files[0].link} 
            alt={getTitle()} 
            className="news_card_image" 
            loading="lazy"
          />
        ) : videoID ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoID}`}
            title={getTitle()}
            className="news_card_video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <div className="news_card_placeholder">
            {currentLang === "uz" 
              ? "Rasm mavjud emas" 
              : currentLang === "ru" 
              ? "Нет изображения" 
              : "No Image Available"}
          </div>
        )}
      </div>

      {/* Content */}
      <h3 className="news_card_title">{getTitle()}</h3>
      <p className="news_card_text">{getText()}</p>
      <button className="news_card_button">
        {currentLang === "uz" 
          ? "Batafsil" 
          : currentLang === "ru" 
          ? "Подробнее" 
          : "Read More"}
      </button>
    </div>
  );
};

export default NewsCard;