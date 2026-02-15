import React, { useState, useEffect, useContext } from 'react';
import './style.css';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import Context from '../../context/Context';

const DocsPage = () => {
  const [t, i18n] = useTranslation('global');
  const contextDatas = useContext(Context);
  const currentLang = contextDatas.currentLang;
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [documentsPerPage] = useState(6);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // API'dan dokumentlarni olish
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/api/docs`);
        if (response.data.success) {
          setDocuments(response.data.data);
        } else {
          console.error('Failed to load documents');
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [BACKEND_URL]);

  // Get text based on current language
  const getText = (doc, field) => {
    if (!doc) return '';
    
    if (currentLang === 'en') return doc[`${field}_en`] || doc[`${field}_uz`] || '';
    if (currentLang === 'ru') return doc[`${field}_ru`] || doc[`${field}_uz`] || '';
    return doc[`${field}_uz`] || '';
  };

  // Strip HTML tags for description preview
  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Dokumentlarni sahifalarga ajratish
  const indexOfLastDocument = currentPage * documentsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
  const currentDocuments = documents.slice(indexOfFirstDocument, indexOfLastDocument);

  const totalPages = Math.ceil(documents.length / documentsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Sahifani o'zgartirish
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));

  if (loading) {
    return (
      <div className="docs-container">
        <div className="skeleton-docs-header"></div>
        <div className="docs-list">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton-doc-card">
              <div className="skeleton-doc-icon"></div>
              <div className="skeleton-doc-content">
                <div className="skeleton-doc-title"></div>
                <div className="skeleton-doc-desc"></div>
              </div>
              <div className="skeleton-doc-link"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="docs-container">
        <h1 className="page-title doc">{t('navbar.docs')}</h1>
        <div className="no-docs">
          <p>
            {currentLang === 'uz'
              ? "Hujjatlar topilmadi"
              : currentLang === 'ru'
              ? 'Документы не найдены'
              : 'No documents found'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="docs-container">
      <h1 className="page-title doc">{t('navbar.docs')}</h1>
      <div className="docs-list">
        {currentDocuments.map((doc) => {
          const titleText = getText(doc, 'title');
          const descText = getText(doc, 'description');
          const plainDesc = stripHtml(descText);

          return (
            <div className="doc-card" key={doc._id || doc.id}>
              <div className="doc-icon">
                <img 
                  src={doc.img || "https://uzmarkaz.uz/uploads/2023/02/unnamed.jpg"} 
                  alt="Document logo" 
                  loading="lazy"
                />
              </div>
              <div className="doc-info">
                {/* HTML Support for Title */}
                <a 
                  href={doc.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="doc-title"
                  dangerouslySetInnerHTML={{ __html: titleText }}
                />
                {/* Plain text for Description */}
                <p className="doc-description">
                  {plainDesc.length > 100 ? plainDesc.slice(0, 100) + '...' : plainDesc}
                </p>
              </div>
              <div className="doc-link">
                <a href={doc.link} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={goPrev}
            disabled={currentPage === 1}
            aria-label={
              currentLang === 'uz'
                ? 'Oldingi'
                : currentLang === 'ru'
                ? 'Предыдущий'
                : 'Previous'
            }
          >
            ‹
          </button>

          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={number === currentPage ? 'active' : ''}
              aria-current={number === currentPage ? 'page' : undefined}
            >
              {number}
            </button>
          ))}

          <button
            onClick={goNext}
            disabled={currentPage === totalPages}
            aria-label={
              currentLang === 'uz'
                ? 'Keyingi'
                : currentLang === 'ru'
                ? 'Следующий'
                : 'Next'
            }
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

export default DocsPage;