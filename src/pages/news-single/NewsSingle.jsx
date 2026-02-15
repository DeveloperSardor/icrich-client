import React, { useState, useEffect, useContext } from 'react';
import './style.css';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Context from '../../context/Context';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const NewsSinglePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const contextDatas = useContext(Context);
  const currentLang = contextDatas.currentLang;
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // Yangilikni yuklash
  async function GetNews() {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BACKEND_URL}/api/news/${id}`);
      setNews(data?.data);
    } catch (error) {
      toast.error(error.message || 'Yangilikni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    GetNews();
  }, [id]);

  // Scroll to top button va reading progress
  useEffect(() => {
    const handleScroll = () => {
      // Scroll to top button
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      // Reading progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const trackLength = documentHeight - windowHeight;
      const progress = (scrollTop / trackLength) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top funksiyasi
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Share funksiyalari
  const handleShare = (platform) => {
    const url = window.location.href;
    const title = getTitle();
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url).then(() => {
        toast.success('Havola nusxalandi!');
      }).catch(() => {
        toast.error('Havolani nusxalashda xatolik');
      });
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  // Print funksiyasi
  const handlePrint = () => {
    window.print();
  };

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: news?.files?.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: news?.files?.length > 1,
    autoplaySpeed: 5000,
    arrows: true,
    pauseOnHover: true,
    adaptiveHeight: true,
  };

  // YouTube ID olish
  const getYouTubeID = (url) => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.slice(1);
      }
      if (urlObj.hostname.includes('youtube.com')) {
        return urlObj.searchParams.get('v');
      }
    } catch (error) {
      console.error('Invalid YouTube URL:', error);
    }
    return null;
  };

  // Sana formatlash
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${hours}:${minutes} / ${day}.${month}.${year}`;
  };

  // Til bo'yicha sarlavha
  const getTitle = () => {
    if (!news) return '';
    if (currentLang === 'uz') return news.title_uz;
    if (currentLang === 'ru') return news.title_ru;
    return news.title_en;
  };

  // Til bo'yicha matn
  const getText = () => {
    if (!news) return '';
    if (currentLang === 'uz') return news.text_uz;
    if (currentLang === 'ru') return news.text_ru;
    return news.text_en;
  };

  // Matndan excerpt olish (HTML taglarni olib tashlash)
  const getExcerpt = (html, maxLength = 250) => {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Loading holati
  if (loading) {
    return (
      <div className="news-single">
        <div className="news-container">
          <div className="loading-wrapper">
            <div className="spinner"></div>
            <p className="loading-text">Yuklanmoqda...</p>
          </div>
        </div>
      </div>
    );
  }

  // Yangilik topilmasa
  if (!news) {
    return (
      <div className="news-single">
        <div className="news-container">
          <div className="error-wrapper">
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">Yangilik topilmadi</h2>
            <p className="error-text">
              Kechirasiz, bu yangilik mavjud emas yoki o'chirilgan bo'lishi mumkin
            </p>
            <button onClick={() => navigate('/')} className="action-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Bosh sahifaga qaytish
            </button>
          </div>
        </div>
      </div>
    );
  }

  const videoID = getYouTubeID(news.youtube_link);
  const imageFiles = news?.files?.filter((file) => file.type_file === 'image') || [];

  return (
    <div className="news-single">
      {/* Reading Progress Bar */}
      <div className="reading-progress">
        <div 
          className="reading-progress-bar" 
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      <div className="news-container">
        {/* Header */}
        <div className="news-header">
          <div className="news-breadcrumb">
            <a 
              href="/" 
              onClick={(e) => { 
                e.preventDefault(); 
                navigate('/'); 
              }}
            >
              Bosh sahifa
            </a>
            <span className="news-breadcrumb-separator">/</span>
            <a 
              href="/news" 
              onClick={(e) => { 
                e.preventDefault(); 
                navigate('/news'); 
              }}
            >
              Yangiliklar
            </a>
            <span className="news-breadcrumb-separator">/</span>
            <span>{currentLang === 'uz' ? 'O\'qish' : currentLang === 'ru' ? 'Читать' : 'Read'}</span>
          </div>

          <div className="news-meta-info">
            <div className="meta-item">
              <span className="news-category">
                {currentLang === 'uz' ? 'Yangilik' : currentLang === 'ru' ? 'Новость' : 'News'}
              </span>
            </div>
            <span className="meta-separator"></span>
            <div className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>{formatDate(news.createdAt)}</span>
            </div>
            <span className="meta-separator"></span>
            <div className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <span>{news.views || '—'}</span>
            </div>
          </div>

          <h1 className="news-title">{getTitle()}</h1>
        </div>

        {/* Lead/Excerpt */}
        <div className="news-lead">
          <p className="news-excerpt">{getExcerpt(getText())}</p>
        </div>

        {/* Featured Media */}
        {(imageFiles.length > 0 || (news?.youtube_link && videoID)) && (
          <div className="news-media">
            {news?.youtube_link && videoID ? (
              <div className="youtube-wrapper">
                <iframe
                  src={`https://www.youtube.com/embed/${videoID}`}
                  title={getTitle()}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : imageFiles.length === 1 ? (
              <img
                className="news-image"
                src={imageFiles[0].link}
                alt={getTitle()}
                loading="lazy"
              />
            ) : imageFiles.length > 1 ? (
              <div className="news-slider">
                <Slider {...sliderSettings}>
                  {imageFiles.map((file, index) => (
                    <div key={index}>
                      <img
                        className="news-image"
                        src={file.link}
                        alt={`${getTitle()} - ${index + 1}`}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            ) : null}
          </div>
        )}

        {/* Article Body */}
        <div className="news-body">
          <div 
            className="news-content"
            dangerouslySetInnerHTML={{ __html: getText() }}
          />
        </div>

        {/* Footer Actions */}
        <div className="news-footer">
          <div className="news-actions">
            <button onClick={() => navigate(-1)} className="action-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              {currentLang === 'uz' ? 'Ortga' : currentLang === 'ru' ? 'Назад' : 'Back'}
            </button>
            <button onClick={() => navigate('/')} className="action-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              {currentLang === 'uz' ? 'Bosh sahifa' : currentLang === 'ru' ? 'Главная' : 'Home'}
            </button>
            <button onClick={handlePrint} className="action-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 6 2 18 2 18 9"/>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
              {currentLang === 'uz' ? 'Chop etish' : currentLang === 'ru' ? 'Печать' : 'Print'}
            </button>
          </div>

          {/* Share Actions */}
          <div className="share-actions">
            <button 
              onClick={() => handleShare('facebook')} 
              className="share-btn facebook"
              title="Facebook'da ulashish"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button 
              onClick={() => handleShare('twitter')} 
              className="share-btn twitter"
              title="Twitter'da ulashish"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </button>
            <button 
              onClick={() => handleShare('telegram')} 
              className="share-btn telegram"
              title="Telegram'da ulashish"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </button>
            <button 
              onClick={() => handleShare('copy')} 
              className="share-btn copy"
              title="Havolani nusxalash"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button 
        className={`scroll-top-btn ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Yuqoriga ko'tarish"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
      </button>
    </div>
  );
};

export default NewsSinglePage;