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
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 6;
  const currentLang = useContext(Context)?.currentLang || "uz";
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/news`);
        const sortedNews = data?.data?.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNews(sortedNews || []);
      } catch (error) {
        toast.error(error?.message || "Xatolik yuz berdi");
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

  const toEmbed = (url = "") =>
    url
      .replace("watch?v=", "embed/")
      .replace("youtu.be/", "www.youtube.com/embed/")
      .split("&")[0];

  return (
    <div className="news-page">
      <h1 className="news-header">{t("navbar.news.news")}</h1>

      <div className="news-grid">
        {currentNews.map((item) => {
          const isImage = item?.files?.[0]?.type_file === "image";
          const hasYouTube = !!item?.youtube_link;
          const title = item[`title_${currentLang}`] || item?.title_uz || "";
          const desc = item[`text_${currentLang}`] || item?.text_uz || "";

          return (
            <article
              key={item._id}
              className="news-card"
              onClick={() => navigate(`/news/${item._id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate(`/news/${item._id}`)}
            >
              <div className="news-media">
                {isImage ? (
                  <img src={item.files[0].link} alt={title} loading="lazy" />
                ) : hasYouTube ? (
                  <iframe
                    src={toEmbed(item.youtube_link)}
                    title={title}
                    frameBorder="0"
                    allowFullScreen
                  />
                ) : (
                  <div className="news-placeholder">No media</div>
                )}
                {/* <span className="media-badge"> */}
                  {/* {isImage ? "Image" : hasYouTube ? "Video" : "Post"} */}
                {/* </span> */}
              </div>

              <div className="news-content">
                <div className="news-meta">
                  <span className="news-date">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="news-title">{title}</h3>
                <p className="news-description">{desc}</p>
              </div>

              <div className="news-footer">
                <button
                  className="news-cta"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/news/${item._id}`);
                  }}
                  aria-label="Batafsil"
                >
                  {t("moreBtn") || "Batafsil"}
                  <span className="arrow">→</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={goPrev}
            disabled={currentPage === 1}
            aria-label="Oldingi"
          >
            ‹
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => paginate(n)}
              className={`page-btn ${n === currentPage ? "active" : ""}`}
              aria-current={n === currentPage ? "page" : undefined}
            >
              {n}
            </button>
          ))}

          <button
            className="page-btn"
            onClick={goNext}
            disabled={currentPage === totalPages}
            aria-label="Keyingi"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsPage;
