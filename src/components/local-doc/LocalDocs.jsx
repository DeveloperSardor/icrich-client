import React, { useState, useEffect, useContext } from 'react';
import './style.css';
import { useTranslation } from 'react-i18next';
import { FaFilePdf, FaDownload, FaExternalLinkAlt } from 'react-icons/fa';
import axios from 'axios';
import Context from '../../context/Context';

const LocalDocs = () => {
  const [documents, setDocuments] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const contextDatas = useContext(Context);
  const currentLang = contextDatas.currentLang;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [t] = useTranslation('global');

  // Fetch documents from the backend API
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/api/local-list`);
        if (response.data.success) {
          setDocuments(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching document data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [BACKEND_URL]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % documents.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? documents.length - 1 : prevIndex - 1
    );
  };

  const currentDocument = documents[currentIndex];

  // Get text based on current language
  const getText = (field) => {
    if (!currentDocument) return '';
    
    if (currentLang === 'en') return currentDocument[`${field}_en`] || currentDocument[`${field}_uz`] || '';
    if (currentLang === 'ru') return currentDocument[`${field}_ru`] || currentDocument[`${field}_uz`] || '';
    return currentDocument[`${field}_uz`] || '';
  };

  if (loading) {
    return (
      <div className="document-viewer">
        <div className="skeleton-loader">
          <div className="skeleton-title"></div>
          <div className="skeleton-content"></div>
          <div className="skeleton-pdf"></div>
        </div>
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="document-viewer">
        <h2 className="title">{t('navbar.nmm.localList')}</h2>
        <div className="no-data">
          <p>
            {currentLang === 'uz'
              ? "Ma'lumot topilmadi"
              : currentLang === 'ru'
              ? 'Данные не найдены'
              : 'No data found'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="document-viewer">
      <h2 className="title">{t('navbar.nmm.localList')}</h2>
      {currentDocument && (
        <>
          {/* HTML Content with dangerouslySetInnerHTML like ExpeditionPage */}
          <div className="description-card">
            <p dangerouslySetInnerHTML={{ __html: getText('title') }} />
          </div>

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
              {currentLang === 'uz' ? 'Oldingi' : currentLang === 'ru' ? 'Предыдущий' : 'Previous'}
            </button>
            <span className="page-indicator">
              {currentIndex + 1} / {documents.length}
            </span>
            <button onClick={handleNext} disabled={documents.length <= 1}>
              {currentLang === 'uz' ? 'Keyingi' : currentLang === 'ru' ? 'Следующий' : 'Next'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LocalDocs;