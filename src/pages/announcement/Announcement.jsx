import React, { useState, useEffect, useContext } from 'react';
import './style.css';
import axios from 'axios';
import Context from '../../context/Context';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const AnnouncementsPage = () => {
  const contextDatas = useContext(Context);
  const currentLang = contextDatas.currentLang;
  const [t] = useTranslation('global');
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [announcementsPerPage] = useState(6);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/api/announcement`);
        if (response.data.success) {
          const sortedAnnouncements = response.data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setAnnouncements(sortedAnnouncements);
        } else {
          console.error('Failed to load announcements');
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [BACKEND_URL]);

  const getText = (item, field) => {
    if (!item) return '';
    const langField = `${field}_${currentLang}`;
    return item[langField] || item[`${field}_uz`] || '';
  };

  // Strip HTML tags for preview text
  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const indexOfLastAnnouncement = currentPage * announcementsPerPage;
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
  const currentAnnouncements = announcements.slice(
    indexOfFirstAnnouncement,
    indexOfLastAnnouncement
  );

  const totalPages = Math.ceil(announcements.length / announcementsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));

  if (loading) {
    return (
      <div className="ann_container">
        <div className="skeleton-ann-header"></div>
        <div className="ann_grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton-ann-card">
              <div className="skeleton-ann-image"></div>
              <div className="skeleton-ann-content">
                <div className="skeleton-ann-title"></div>
                <div className="skeleton-ann-date"></div>
                <div className="skeleton-ann-line"></div>
                <div className="skeleton-ann-line short"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!announcements || announcements.length === 0) {
    return (
      <div className="ann_container">
        <header className="ann_header">
          <h1>{t('navbar.news.announcements')}</h1>
        </header>
        <div className="no-announcements">
          <p>
            {currentLang === 'uz'
              ? "E'lonlar topilmadi"
              : currentLang === 'ru'
              ? 'Объявления не найдены'
              : 'No announcements found'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ann_container">
      <header className="ann_header">
        <h1>{t('navbar.news.announcements')}</h1>
      </header>

      <div className="ann_grid">
        {currentAnnouncements.map((announcement) => {
          const descText = getText(announcement, 'desc');
          const plainText = stripHtml(descText);
          const truncatedText = plainText.length > 120 
            ? plainText.slice(0, 120) + '...' 
            : plainText;

          return (
            <article
              className="ann_card"
              onClick={() => navigate(`/announcements/${announcement._id}`)}
              key={announcement._id}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === 'Enter' && navigate(`/announcements/${announcement._id}`)
              }
            >
              <div className="ann_card_image_wrapper">
                <img
                  src={announcement.img}
                  alt={getText(announcement, 'title')}
                  className="ann_card_image"
                  loading="lazy"
                />
                <div className="ann_card_overlay"></div>
              </div>

              <div className="ann_card_content">
                <div className="ann_card_meta">
                  <span className="ann_card_date">
                    {new Date(announcement.createdAt).toLocaleDateString(
                      currentLang === 'ru'
                        ? 'ru-RU'
                        : currentLang === 'en'
                        ? 'en-US'
                        : 'uz-UZ',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </span>
                </div>

                {/* HTML Support for Title */}
                <h3 
                  className="ann_card_title"
                  dangerouslySetInnerHTML={{ __html: getText(announcement, 'title') }}
                />

                {/* Plain text for description preview */}
                <p className="ann_card_description">
                  {truncatedText}
                </p>

                <button
                  className="ann_card_button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/announcements/${announcement._id}`);
                  }}
                >
                  {t('moreBtn') || 'Batafsil'}
                  <span className="ann_arrow">→</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="ann_pagination">
          <button
            className="ann_page_btn"
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
              className={`ann_page_btn ${number === currentPage ? 'active' : ''}`}
              aria-current={number === currentPage ? 'page' : undefined}
            >
              {number}
            </button>
          ))}

          <button
            className="ann_page_btn"
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

export default AnnouncementsPage;