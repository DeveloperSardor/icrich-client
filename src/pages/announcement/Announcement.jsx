import React, { useState, useEffect, useContext } from 'react';
import './style.css';
import axios from 'axios';
import Context from '../../context/Context';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const AnnouncementsPage = () => {
  const contextDatas = useContext(Context);
  const currentLang = contextDatas.currentLang;
  const [t, i18n] = useTranslation('global');
  const [announcements, setAnnouncements] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);  // Hozirgi sahifa
  const [announcementsPerPage] = useState(6);  // Sahifada ko'rsatiladigan e'lonlar soni
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;  // Backend URLni o'zgartiring
  const navigate = useNavigate();


  // API'dan e'lonlarni olish
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/announcement`);
        if (response.data.success) {
          setAnnouncements(response.data.data);
        } else {
          console.error('Failed to load announcements');
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  // E'lonlarni sahifalarga ajratish
  const indexOfLastAnnouncement = currentPage * announcementsPerPage;  // Oxirgi ko'rsatilgan e'lon
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;  // Birinchi ko'rsatilgan e'lon
  const currentAnnouncements = announcements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);  // Hozirgi sahifada ko'rsatiladigan e'lonlar

  // Sahifa navigatsiyasi uchun
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(announcements.length / announcementsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Sahifani o'zgartirish
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="ann_container">
      <header className="ann_header">
        <h1>{t('navbar.news.announcements')}</h1>
      </header>
      <div className="ann_grid">
        {currentAnnouncements.map((announcement) => (
          <div
            className="ann_card"
            onClick={() => navigate(`/announcements/${announcement._id}`)}
            key={announcement._id}
          >
            <img
              src={announcement.img}
              alt={announcement.title_uz}
              className="card-image"
            />
            <div className="card-content">
              <h3 className="card-title">
                {announcement[`title_${currentLang}`]} {/* Dynamic language support */}
              </h3>
              <p className="card-date">{new Date(announcement.createdAt).toLocaleDateString()}</p>
              <p className="card-description">
                {announcement[`desc_${currentLang}`]}
              </p>
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

export default AnnouncementsPage;
