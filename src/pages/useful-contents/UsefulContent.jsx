import React, { useState, useEffect } from "react";
import "./style.css";
import { useTranslation } from "react-i18next";
import axios from "axios";

const UsefulContents = () => {
  const [t, i18n] = useTranslation("global");
  const [contents, setContents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const contentsPerPage = 6; // Har sahifada nechta content bo'lishi

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const getYoutubeId = (url) => {
    const regex =
      /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/]+\/[^\/\n\s]+\/\S+|\S+\/\S+|(?:v|e(?:mbed)?)\/([a-zA-Z0-9_-]{11}))|youtu\.be\/([a-zA-Z0-9_-]{11}))/;
    const match = url.match(regex);
    return match ? match[1] || match[2] : null;
  };

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/resources`);
        if (response.data.success) {
          setContents(response.data.data);
        } else {
          console.error("Failed to load contents");
        }
      } catch (error) {
        console.error("Error fetching contents:", error);
      }
    };

    fetchContents();
  }, []);

  // Pagination uchun hisoblash
  const indexOfLastContent = currentPage * contentsPerPage;
  const indexOfFirstContent = indexOfLastContent - contentsPerPage;
  const currentContents = contents.slice(indexOfFirstContent, indexOfLastContent);

  // Sahifa raqamlari
  const totalPages = Math.ceil(contents.length / contentsPerPage);
  const pageNumbers = [...Array(totalPages).keys()].map((num) => num + 1);

  return (
    <div className="contents-container">
      <h1 className="page-title">{t("navbar.library.resources")}</h1>
      <div className="contents-grid">
        {currentContents.map((content) => (
          <div
            className={`content-card ${content.pdf_link ? "pdf-card" : ""}`}
            key={content._id}
          >
            <div className="content-media">
              {content.youtube_link && (
                <iframe
                  src={`https://www.youtube.com/embed/${getYoutubeId(content.youtube_link)}`}
                  title={content.title}
                  allowFullScreen
                  className="video-frame"
                ></iframe>
              )}
              {content.pdf_link && (
                <div className="pdf-content">
                  <i className="fas fa-file-pdf pdf-icon"></i>
                  <a
                    href={content.pdf_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pdf-link"
                  >
                    📄 Open PDF
                  </a>
                </div>
              )}
            </div>
            <div className="content-details">
              <h2 className="content-title">
                {content[`title_${i18n.language}`]}
              </h2>
              <p className="content-description">
                {content[`text_${i18n.language}`]?.slice(0, 60) + "..."}
              </p>
              {content.link && (
                <a
                  href={content.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="content-link"
                >
                  🔗 Visit Resource
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          « Prev
        </button>

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={number === currentPage ? "active" : ""}
          >
            {number}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next »
        </button>
      </div>
    </div>
  );
};

export default UsefulContents;
