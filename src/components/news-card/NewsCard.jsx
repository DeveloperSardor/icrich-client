import React, { useContext } from "react";
import Context from '../../context/Context.jsx'
import "./style.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const NewsCard = ({ data }) => {
  const [t, i18n] = useTranslation('global');
  const contextDatas = useContext(Context)
  const navigate = useNavigate()
  const currentLang = contextDatas.currentLang;
  const {_id, title_uz, title_ru, title_en,  text_uz, text_en, text_ru, files, youtube_link } = data;

  // Extract YouTube video ID
  const getYouTubeID = (link) => {
    if (!link) return null;
    const url = new URL(link);
    if (url.hostname === "youtu.be") {
      return url.pathname.slice(1); // Extract ID from 'https://youtu.be/ID'
    }
    if (url.hostname.includes("youtube.com")) {
      return url.searchParams.get("v"); // Extract ID from 'https://www.youtube.com/watch?v=ID'
    }
    return null;
  };

  const videoID = getYouTubeID(youtube_link);

  return (
    <div className="news_card" onClick={()=> navigate(`/news/${_id}`)}>
      {/* Render image or YouTube thumbnail */}
      {files?.length > 0 ? (
      <img src={files[0].link} alt={title_uz} className="news_image" />
      ) : videoID ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoID}`}
          title={title_uz}
          className="news_video"
          frameBorder="0"
          style={{ height: "60%" }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <div className="news_placeholder">No Media Available</div>
      )}

      {/* Render title and text */}
      <h3 className="title"> {currentLang == 'uz' ? title_uz : currentLang == 'ru' ? title_ru : title_en}  </h3>
      <p className="txt">{currentLang == 'uz' ? text_uz.slice(0,150) + '...' : currentLang == 'ru' ? text_ru.slice(0, 150) + '...' : text_en.slice(0, 150) + '...'} </p>

      <button className="details_button">{t('moreBtn')}</button>
    </div>
  );
};

export default NewsCard;
