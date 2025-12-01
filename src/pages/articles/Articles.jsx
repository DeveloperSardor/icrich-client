import React, { useState, useEffect } from 'react';
import './style.css';  
import { useTranslation } from 'react-i18next';  
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ScientificArticles() {
  const [t, i18n] = useTranslation('global');
  const [articles, setArticles] = useState([]);  
  const [currentPage, setCurrentPage] = useState(1);  
  const [articlesPerPage] = useState(6);  
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/articles`);
        if (response.data.success) {
          setArticles(response.data.data);
        } else {
          console.error('Failed to load articles');
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(articles.length / articlesPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="articles-container">
      <h1 className="page-title">{t('navbar.library.articles')}</h1>
      <div className="articles-grid">
        {currentArticles.map(article => (
          <div className="article-card" key={article._id}>
            <div className="article-content">
              <h5 className="article-title">{article[`title_${i18n.language}`]}</h5>
              <p className="article-description">{article[`desc_${i18n.language}`]?.slice(0, 80) + '...'}</p>
              <a href={`${article.pdf_file}`} target="_blank" rel="noopener noreferrer">
                <button className="read-more-btn">
                  <i className="fas fa-file-pdf"></i> {t('moreBtn')}
                </button>
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
}

export default ScientificArticles;
