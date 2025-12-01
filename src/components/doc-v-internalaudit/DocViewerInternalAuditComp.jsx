import React, { useState, useEffect, useContext } from 'react';
import './style.css';
import { useTranslation } from 'react-i18next';
import { FaFileAlt } from 'react-icons/fa';
import axios from 'axios';
import Context from '../../context/Context';

const DocumentViewer = () => {
  const [charters, setCharters] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const contextDatas = useContext(Context);
  const currentLang = contextDatas.currentLang;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [t, i18n] = useTranslation('global');

  useEffect(() => {
    const fetchCharters = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/audit`);
        if (response.data.success) {
          setCharters(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching charter data:', error);
      }
    };

    fetchCharters();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % charters.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? charters.length - 1 : prevIndex - 1
    );
  };

  const currentCharter = charters[currentIndex];

  return (
    <div className="document-viewer">
      <h2 className="title">{t('navbar.openData.internalAudit')}</h2>

      {currentCharter ? (
        <>
          <div className="doc-card">
            <FaFileAlt className="doc-icon" />
            <div className="doc-details">
              <h3 className="doc-title">
                {currentLang === 'uz' ? currentCharter.title_uz : currentLang === 'ru' ? currentCharter.title_ru : currentCharter.title_en}
              </h3>
              <p className="doc-description">
                {currentLang === 'uz' ? currentCharter.desc_uz : currentLang === 'ru' ? currentCharter.desc_ru : currentCharter.desc_en}
              </p>

              {/* ✅ PDF LINKNI KO‘RSATISH */}
             {currentCharter.pdf_link && (
  <a
    href={currentCharter.pdf_link}
    target="_blank"
    rel="noopener noreferrer"
    className="pdf-link"
  >
    📄 {currentLang === 'uz'
      ? 'PDF-ni ko‘rish'
      : currentLang === 'ru'
      ? 'Открыть PDF'
      : 'View PDF'}
  </a>
)}

            </div>
          </div>

          {/* Navigation Buttons */}
          {charters.length > 1 && (
            <div className="navigation-buttons">
              <button className="nav-btn prev" onClick={handlePrevious}>
                {t('prev')}
              </button>
              <button className="nav-btn next" onClick={handleNext}>
                {t('next')}
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="loading-text">{t('loading')}</p>
      )}
    </div>
  );
};

export default DocumentViewer;
