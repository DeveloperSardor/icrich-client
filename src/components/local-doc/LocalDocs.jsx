import React, { useState, useEffect, useContext } from 'react';
import './style.css';
import { useTranslation } from 'react-i18next';
import { FaFilePdf, FaDownload, FaExternalLinkAlt } from 'react-icons/fa';
import axios from 'axios';
import Context from '../../context/Context';

const LocalDocs = () => {
  const [documents, setDocuments] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const contextDatas = useContext(Context);
  const currentLang = contextDatas.currentLang;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [t] = useTranslation('global');

  // Fetch documents from the backend API
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/local-list`);
        if (response.data.success) {
          setDocuments(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching document data:', error);
      }
    };

    fetchDocuments();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % documents.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? documents.length - 1 : prevIndex - 1
    );
  };

  const currentDocument = documents[currentIndex];

  return (
    <div className="document-viewer">
      <h2 className="title">{t('navbar.nmm.localList')}</h2>
      {currentDocument ? (
        <>
          <p className="description">
            {currentLang === 'uz'
              ? currentDocument.title_uz
              : currentLang === 'ru'
              ? currentDocument.title_ru
              : currentDocument.title_en}
          </p>

          {/* PDF Viewer Section */}
          <div className="pdf-file">
            <FaFilePdf className="pdf-icon" />
            <div className="pdf-details">
              <h3 className="pdf-title">{t('navbar.nmm.localList')}</h3>
              <p className="pdf-subtext">PDF file</p>
            </div>
            <div className="pdf-actions">
              <button
                className="icon-button"
                onClick={() => window.open(currentDocument.link, '_blank')}
                title="Yuklab olish"
              >
                <FaDownload />
              </button>
              <button
                className="icon-button"
                onClick={() => window.open(currentDocument.link, '_blank')}
                title="Ochish"
              >
                <FaExternalLinkAlt />
              </button>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="navigation-buttons">
            <button onClick={handlePrevious} disabled={documents.length <= 1}>
              {t('prev')}
            </button>
            <button onClick={handleNext} disabled={documents.length <= 1}>
              {t('next')}
            </button>
          </div>
        </>
      ) : (
        <p> {currentLang == 'uz' ? "Ma'lumotlar yuklanmoqda..." : currentLang == 'ru' ? "Загрузка данных..." : "Loading data..."} </p>
      )}
    </div>
  );
};

export default LocalDocs;
