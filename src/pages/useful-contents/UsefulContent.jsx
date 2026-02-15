import React, { useState, useEffect, useContext } from "react";
import "./style.css";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Context from "../../context/Context";

const UsefulContents = () => {
  const [t, i18n] = useTranslation("global");
  const contextDatas = useContext(Context);
  const currentLang = contextDatas?.currentLang || i18n.language;
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const contentsPerPage = 6;

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const getYoutubeId = (url) => {
    const regex =
      /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/]+\/[^\/\n\s]+\/\S+|\S+\/\S+|(?:v|e(?:mbed)?)\/([a-zA-Z0-9_-]{11}))|youtu\.be\/([a-zA-Z0-9_-]{11}))/;
    const match = url?.match(regex);
    return match ? match[1] || match[2] : null;
  };

  const getText = (item, field) => {
    if (!item) return "";
    const langField = `${field}_${currentLang}`;
    return item[langField] || item[`${field}_uz`] || "";
  };

  // Strip HTML tags for description preview
  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  useEffect(() => {
    const fetchContents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/api/resources`);
        if (response.data.success) {
          setContents(response.data.data);
        } else {
          console.error("Failed to load contents");
        }
      } catch (error) {
        console.error("Error fetching contents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, [BACKEND_URL]);

  const indexOfLastContent = currentPage * contentsPerPage;
  const indexOfFirstContent = indexOfLastContent - contentsPerPage;
  const currentContents = contents.slice(
    indexOfFirstContent,
    indexOfLastContent
  );

  const totalPages = Math.ceil(contents.length / contentsPerPage);
  const pageNumbers = [...Array(totalPages).keys()].map((num) => num + 1);

  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));

  if (loading) {
    return (
      <div className="contents-container">
        <div className="skeleton-contents-header"></div>
        <div className="contents-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton-content-card">
              <div className="skeleton-content-media"></div>
              <div className="skeleton-content-details">
                <div className="skeleton-content-title"></div>
                <div className="skeleton-content-line"></div>
                <div className="skeleton-content-line short"></div>
                <div className="skeleton-content-button"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!contents || contents.length === 0) {
    return (
      <div className="contents-container">
        <div className="contents-header">
          <h1 className="page-title">{t("navbar.library.resources")}</h1>
        </div>
        <div className="no-contents">
          <p>
            {currentLang === "uz"
              ? "Resurslar topilmadi"
              : currentLang === "ru"
                ? "Ресурсы не найдены"
                : "No resources found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="contents-container">
      <div className="contents-header">
        <h1 className="page-title">{t("navbar.library.resources")}</h1>
      </div>

      <div className="contents-grid">
        {currentContents.map((content) => {
          const hasVideo = !!content.youtube_link;
          const hasPdf = !!content.pdf_link;
          const hasLink = !!content.link;
          const textContent = getText(content, "text");
          const plainText = stripHtml(textContent);
          const truncatedText = plainText.length > 100 
            ? plainText.slice(0, 100) + "..." 
            : plainText;

          return (
            <article className="content-card" key={content._id}>
              {/* Media Section */}
              <div className="content-media">
                {hasVideo && (
                  <div className="video-wrapper">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYoutubeId(
                        content.youtube_link
                      )}`}
                      title={getText(content, "title")}
                      allowFullScreen
                      className="video-frame"
                      loading="lazy"
                    ></iframe>
                  </div>
                )}
                {hasPdf && !hasVideo && (
                  <div className="content-icon-wrapper">
                    <i className="fas fa-file-pdf content-icon"></i>
                  </div>
                )}
                {hasLink && !hasVideo && !hasPdf && (
                  <div className="content-icon-wrapper">
                    <i className="fas fa-link content-icon"></i>
                  </div>
                )}
              </div>

              {/* Content Details */}
              <div className="content-details">
                {/* HTML Support for Title */}
                <h3 
                  className="content-title"
                  dangerouslySetInnerHTML={{ __html: getText(content, "title") }}
                />
                
                {/* Plain text for Description */}
                <p className="content-description">
                  {truncatedText}
                </p>

                {/* Action Buttons */}
                <div className="content-actions">
                  {hasPdf && (
                    <a
                      href={content.pdf_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="content-btn"
                    >
                      {currentLang === "uz"
                        ? "PDF ochish"
                        : currentLang === "ru"
                          ? "Открыть PDF"
                          : "Open PDF"}
                      <i className="fas fa-arrow-right"></i>
                    </a>
                  )}
                  {hasLink && (
                    <a
                      href={content.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="content-btn"
                    >
                      {currentLang === "uz"
                        ? "Manba"
                        : currentLang === "ru"
                          ? "Источник"
                          : "Visit"}
                      <i className="fas fa-arrow-right"></i>
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-arrow"
            onClick={goPrev}
            disabled={currentPage === 1}
            aria-label={
              currentLang === "uz"
                ? "Oldingi"
                : currentLang === "ru"
                  ? "Предыдущий"
                  : "Previous"
            }
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`pagination-btn ${number === currentPage ? "active" : ""}`}
              aria-current={number === currentPage ? "page" : undefined}
            >
              {number}
            </button>
          ))}

          <button
            className="pagination-arrow"
            onClick={goNext}
            disabled={currentPage === totalPages}
            aria-label={
              currentLang === "uz"
                ? "Keyingi"
                : currentLang === "ru"
                  ? "Следующий"
                  : "Next"
            }
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default UsefulContents;