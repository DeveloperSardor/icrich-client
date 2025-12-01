import React, { useState, useEffect } from 'react';
import './style.css';  // Import custom styles
import { useTranslation } from 'react-i18next';  // i18n for translations
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';  // Updated import for React Router v6

function SingleArticle() {
  const { id } = useParams();  // Get the article ID from the URL
  const [t, i18n] = useTranslation('global');
  const [article, setArticle] = useState(null);  // State for storing a single article
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  // Using useNavigate instead of useHistory

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;  // Backend URL (you need to set this in .env file)

  // Fetch single article by ID
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/articles/${id}`);
        if (response.data.success) {
          setArticle(response.data.data);  // Set the article in state
          setLoading(false);
        } else {
          console.error('Failed to load article');
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;  // Show loading message until the article is fetched
  }

  return (
    <div className="single-article-container">
      <button onClick={() => navigate(-1)} className="back-btn">{t('buttons.back')}</button> {/* navigate(-1) for going back */}
      <div className="article-detail">
        <img src={article.img || "https://via.placeholder.com/350x200"} alt={article.title} className="article-image" />
        <div className="article-content">
          <h1 className="article-title">{article[`title_${i18n.language}`]}</h1>
          <p className="article-description">{article[`desc_${i18n.language}`]}</p>
        </div>
      </div>
    </div>
  );
}

export default SingleArticle;
