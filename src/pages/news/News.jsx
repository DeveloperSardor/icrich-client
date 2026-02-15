import React, { useEffect, useState, useContext, useMemo } from "react";
import "./style.css";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Context from "../../context/Context";
import { useNavigate } from "react-router-dom";

const NewsPage = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [t] = useTranslation("global");
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 6;
  const currentLang = useContext(Context)?.currentLang || "uz";
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${BACKEND_URL}/api/news`);
        const sortedNews = data?.data?.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNews(sortedNews || []);
      } catch (error) {
        toast.error(error?.message || "Xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    })();
  }, [BACKEND_URL]);

  const totalPages = Math.ceil(news.length / newsPerPage);
  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = useMemo(
    () => news.slice(indexOfFirstNews, indexOfLastNews),
    [news, indexOfFirstNews, indexOfLastNews]
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  // YouTube video ID extraction
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

  // HTML text truncation
  const truncateHtmlText = (html, maxLength) => {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || "";
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;
  };

  // Get title by language
  const getTitle = (item) => {
    if (currentLang === 'uz') return item.title_uz;
    if (currentLang === 'ru') return item.title_ru;
    return item.title_en;
  };

  // Get text by language
  const getText = (item) => {
    const text = currentLang === 'uz' ? item.text_uz 
      : currentLang === 'ru' ? item.text_ru 
      : item.text_en;
    return truncateHtmlText(text, 150);
  };

  if (loading) {
    return (
      <div className="news-page">
        <h1 className="page-title">{t("navbar.news.news")}</h1>
        <div className="news-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-media"></div>
              <div className="skeleton-content">
                <div className="skeleton-title"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line short"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="news-page">
        <h1 className="page-title">{t("navbar.news.news")}</h1>
        <div className="no-news">
          <p>
            {currentLang === "uz"
              ? "Yangiliklar topilmadi"
              : currentLang === "ru"
              ? "Новости не найдены"
              : "No news found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="news-page">
      <h1 className="page-title">{t("navbar.news.news")}</h1>

      <div className="news-grid">
        {currentNews.map((item) => {
          const videoID = getYouTubeID(item.youtube_link);
          const title = getTitle(item);
          const text = getText(item);

          return (
            <div 
              key={item._id} 
              className="news-card" 
              onClick={() => navigate(`/news/${item._id}`)}
            >
              {/* Media */}
              <div className="news-media-container">
                {item.files?.length > 0 ? (
                  <img 
                    src={item.files[0].link} 
                    alt={title} 
                    className="news-image" 
                    loading="lazy"
                  />
                ) : videoID ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoID}`}
                    title={title}
                    className="news-video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                ) : (
                  <div className="news-placeholder">
                    {currentLang === "uz" 
                      ? "Rasm mavjud emas" 
                      : currentLang === "ru" 
                      ? "Нет изображения" 
                      : "No Image Available"}
                  </div>
                )}
              </div>

              {/* Content */}
              <h3 className="newss-title">{title}</h3>
              <p className="news-text">{text}</p>
              <button className="news-button">
                {currentLang === "uz" 
                  ? "Batafsil" 
                  : currentLang === "ru" 
                  ? "Подробнее" 
                  : "Read More"}
              </button>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={goPrev}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            ‹
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => paginate(n)}
              className={`page-btn ${n === currentPage ? "active" : ""}`}
              aria-label={`Page ${n}`}
              aria-current={n === currentPage ? "page" : undefined}
            >
              {n}
            </button>
          ))}

          <button
            className="page-btn"
            onClick={goNext}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsPage;