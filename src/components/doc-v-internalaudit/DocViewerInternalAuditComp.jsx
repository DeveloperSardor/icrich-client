import React, { useState, useEffect, useContext } from 'react';
import './style.css';
import { useTranslation } from 'react-i18next';
import { FaFileAlt } from 'react-icons/fa';
import axios from 'axios';
import Context from '../../context/Context';

const DocViewerInternalAuditComp = () => {
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
        const response = await axios.get(`${BACKEND_URL}/api/audit`);
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

  // Get text based on current language
  const getText = (field) => {
    if (!currentCharter) return '';
    
    if (currentLang === 'en') return currentCharter[`${field}_en`] || currentCharter[`${field}_uz`] || '';
    if (currentLang === 'ru') return currentCharter[`${field}_ru`] || currentCharter[`${field}_uz`] || '';
    return currentCharter[`${field}_uz`] || '';
  };

  const currentCharter = charters[currentIndex];

  if (loading) {
    return (
      <div className="document-viewer">
        <div className="skeleton-audit-title"></div>
        <div className="skeleton-audit-card">
          <div className="skeleton-audit-icon"></div>
          <div className="skeleton-audit-content">
            <div className="skeleton-audit-heading"></div>
            <div className="skeleton-audit-line"></div>
            <div className="skeleton-audit-line short"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!charters || charters.length === 0) {
    return (
      <div className="document-viewer">
        <h2 className="title">{t('navbar.openData.internalAudit')}</h2>
        <div className="no-data-audit">
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
      <h2 className="title">{t('navbar.openData.internalAudit')}</h2>

      {currentCharter && (
        <>
          <div className="doc-card">
            <FaFileAlt className="doc-icon" />
            <div className="doc-details">
              {/* HTML Support for Title */}
              <h3 
                className="doc-title"
                dangerouslySetInnerHTML={{ __html: getText('title') }}
              />
              
              {/* HTML Support for Description */}
              <div 
                className="doc-description"
                dangerouslySetInnerHTML={{ __html: getText('desc') }}
              />

              {/* PDF Link */}
              {currentCharter.pdf_link && (
                <a
                  href={currentCharter.pdf_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pdf-link"
                >
                  📄 {currentLang === 'uz'
                    ? 'PDF-ni ko\'rish'
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
                {currentLang === 'uz' ? 'Oldingi' : currentLang === 'ru' ? 'Предыдущий' : 'Previous'}
              </button>
              <span className="page-indicator-audit">
                {currentIndex + 1} / {charters.length}
              </span>
              <button className="nav-btn next" onClick={handleNext}>
                {currentLang === 'uz' ? 'Keyingi' : currentLang === 'ru' ? 'Следующий' : 'Next'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DocViewerInternalAuditComp;