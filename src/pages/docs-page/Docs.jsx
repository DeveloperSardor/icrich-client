import React, { useState, useEffect } from 'react';
import './style.css';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

const DocsPage = () => {
  const [t, i18n] = useTranslation('global');
  const [documents, setDocuments] = useState([]);  // Dokumentlar state'i
  const [currentPage, setCurrentPage] = useState(1);  // Hozirgi sahifa
  const [documentsPerPage] = useState(6);  // Har sahifada ko'rsatiladigan dokumentlar soni
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;  // Backend URLni o'zgartiring

  // API'dan dokumentlarni olish
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/docs`);
        if (response.data.success) {
          setDocuments(response.data.data);
        } else {
          console.error('Failed to load documents');
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocuments();
  }, []);

  // E'lonlarni sahifalarga ajratish
  const indexOfLastDocument = currentPage * documentsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
  const currentDocuments = documents.slice(indexOfFirstDocument, indexOfLastDocument);

  // Sahifa navigatsiyasi uchun
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(documents.length / documentsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Sahifani o'zgartirish
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="docs-container">
      <h1 className="page-title">{t('navbar.docs')}</h1>
      <div className="docs-list">
        {currentDocuments.map((doc) => (
          <div className="doc-card" key={doc.id}>
            <div className="doc-icon">
              <img src={doc.img || "https://uzmarkaz.uz/uploads/2023/02/unnamed.jpg"} alt="Document logo" />
            </div>
            <div className="doc-info">
              <a href={doc.link} target="_blank" rel="noopener noreferrer" className="doc-title">
                {doc[`title_${i18n.language}`]} {/* Tilga qarab sarlavhani ko'rsatish */}
              </a>
              <p className="doc-description">
                {doc[`description_${i18n.language}`]} {/* Tilga qarab matnni ko'rsatish */}
              </p>
            </div>
            <div className="doc-link">
              <a href={doc.link} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faExternalLinkAlt} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={number === currentPage ? 'active' : ''}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DocsPage;
