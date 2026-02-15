import React, { useState, useEffect, useContext } from 'react';
import './style.css';  
import { useTranslation } from 'react-i18next';  
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Context from '../../context/Context';

function ScientificArticles() {
  const [t, i18n] = useTranslation('global');
  const contextDatas = useContext(Context);
  const currentLang = contextDatas?.currentLang || i18n.language;
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(6);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/api/articles`);
        if (response.data.success) {
          setArticles(response.data.data);
        } else {
          console.error('Failed to load articles');
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [BACKEND_URL]);

  // Get text based on current language
  const getText = (article, field) => {
    if (!article) return '';
    const langField = `${field}_${currentLang}`;
    return article[langField] || article[`${field}_uz`] || '';
  };

  // Strip HTML tags for description preview
  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));

  if (loading) {
    return (
      <div className="articles-container">
        <div className="skeleton-articles-header"></div>
        <div className="articles-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton-article-card">
              <div className="skeleton-article-icon"></div>
              <div className="skeleton-article-content">
                <div className="skeleton-article-title"></div>
                <div className="skeleton-article-line"></div>
                <div className="skeleton-article-line"></div>
                <div className="skeleton-article-line short"></div>
                <div className="skeleton-article-button"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="articles-container">
        <div className="articles-header">
          <h1 className="page-title">{t('navbar.library.articles')}</h1>
        </div>
        <div className="no-articles">
          <p>
            {currentLang === 'uz'
              ? "Maqolalar topilmadi"
              : currentLang === 'ru'
              ? 'Статьи не найдены'
              : 'No articles found'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="articles-container">
      <div className="articles-header">
        <h1 className="page-title">{t('navbar.library.articles')}</h1>
      </div>

      <div className="articles-grid">
        {currentArticles.map(article => {
          const descText = getText(article, 'desc');
          const plainDesc = stripHtml(descText);
          const truncatedDesc = plainDesc.length > 120 
            ? plainDesc.slice(0, 120) + '...' 
            : plainDesc;

          return (
            <div className="article-card" key={article._id}>
              <div className="article-icon">
                <i className="fas fa-file-pdf"></i>
              </div>
              <div className="article-content">
                {/* HTML Support for Title */}
                <h3 
                  className="article-title"
                  dangerouslySetInnerHTML={{ __html: getText(article, 'title') }}
                />
                
                {/* Plain text for Description */}
                <p className="article-description">
                  {truncatedDesc}
                </p>
                
                <a 
                  href={`${article.pdf_file}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="read-more-link"
                >
                  <button className="read-more-btn">
                    {t('moreBtn') || 'Batafsil'}
                    <i className="fas fa-arrow-right"></i>
                  </button>
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
            className="pagination-arrow"
            aria-label={
              currentLang === 'uz'
                ? 'Oldingi'
                : currentLang === 'ru'
                ? 'Предыдущий'
                : 'Previous'
            }
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`pagination-btn ${number === currentPage ? 'active' : ''}`}
              aria-current={number === currentPage ? 'page' : undefined}
            >
              {number}
            </button>
          ))}
          
          <button 
            onClick={goNext}
            disabled={currentPage === totalPages}
            className="pagination-arrow"
            aria-label={
              currentLang === 'uz'
                ? 'Keyingi'
                : currentLang === 'ru'
                ? 'Следующий'
                : 'Next'
            }
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
}

export default ScientificArticles;