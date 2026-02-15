import React, { useState, useEffect, useContext } from 'react';
import './style.css';
import { useTranslation } from 'react-i18next';
import { FaFilePdf, FaDownload, FaExternalLinkAlt } from 'react-icons/fa';
import axios from 'axios';
import Context from '../../context/Context';

const DocumentViewer = () => {
  const [charters, setCharters] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const contextDatas = useContext(Context);
  const currentLang = contextDatas.currentLang;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [t] = useTranslation('global');

  useEffect(() => {
    const fetchCharters = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/api/charter`);
        if (response.data.success) {
          setCharters(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching charter data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharters();
  }, [BACKEND_URL]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % charters.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? charters.length - 1 : prevIndex - 1
    );
  };

  const currentCharter = charters[currentIndex];

  const getTitle = () => {
    if (!currentCharter) return '';
    if (currentLang === 'uz') return currentCharter.title_uz || '';
    if (currentLang === 'ru') return currentCharter.title_ru || '';
    return currentCharter.title_en || '';
  };

  const getDescription = () => {
    if (!currentCharter) return '';
    if (currentLang === 'uz') return currentCharter.description_uz || '';
    if (currentLang === 'ru') return currentCharter.description_ru || '';
    return currentCharter.description_en || '';
  };

  const getLoadingText = () => {
    if (currentLang === 'uz') return 'Yuklanmoqda...';
    if (currentLang === 'ru') return 'Загрузка...';
    return 'Loading...';
  };

  if (loading) {
    return (
      <div className="document-viewer">
        <div className="doc-loading">
          <div className="doc-spinner"></div>
          <p>{getLoadingText()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="document-viewer">
      <h2 className="doc-title">{t('navbar.aboutUs.charter')}</h2>
      
      {currentCharter ? (
        <>
          {/* Title */}
          {getTitle() && (
            <h3 className="doc-subtitle">{getTitle()}</h3>
          )}

          {/* Description (React Quill HTML) */}
          {getDescription() && (
            <div 
              className="doc-description"
              dangerouslySetInnerHTML={{ __html: getDescription() }}
            />
          )}

          {/* PDF File Section */}
          <div className="pdf-file">
            <FaFilePdf className="pdf-icon" />
            <div className="pdf-details">
              <h4 className="pdf-title">{t('navbar.aboutUs.charter')}</h4>
              <p className="pdf-subtext">PDF file</p>
            </div>
            <div className="pdf-actions">
              <button
                className="icon-button"
                onClick={() => window.open(currentCharter.link, '_blank')}
                title={currentLang === 'uz' ? 'Yuklab olish' : currentLang === 'ru' ? 'Скачать' : 'Download'}
              >
                <FaDownload />
              </button>
              <button
                className="icon-button"
                onClick={() => window.open(currentCharter.link, '_blank')}
                title={currentLang === 'uz' ? 'Ochish' : currentLang === 'ru' ? 'Открыть' : 'Open'}
              >
                <FaExternalLinkAlt />
              </button>
            </div>
          </div>

          {/* Navigation Buttons (if multiple charters) */}
          {charters.length > 1 && (
            <div className="navigation-buttons">
              <button 
                className="nav-btn" 
                onClick={handlePrevious}
                disabled={charters.length <= 1}
              >
                {currentLang === 'uz' ? 'Oldingi' : currentLang === 'ru' ? 'Предыдущий' : 'Previous'}
              </button>
              <span className="page-indicator">
                {currentIndex + 1} / {charters.length}
              </span>
              <button 
                className="nav-btn" 
                onClick={handleNext}
                disabled={charters.length <= 1}
              >
                {currentLang === 'uz' ? 'Keyingi' : currentLang === 'ru' ? 'Следующий' : 'Next'}
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="no-data">
          {currentLang === 'uz' 
            ? "Ma'lumotlar topilmadi" 
            : currentLang === 'ru' 
            ? 'Данные не найдены' 
            : 'No data found'}
        </p>
      )}
    </div>
  );
};

export default DocumentViewer;