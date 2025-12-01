import React, { useState, useEffect, useContext } from 'react';
import './style.css';
import {useTranslation} from 'react-i18next'
import { FaFilePdf, FaDownload, FaExternalLinkAlt } from 'react-icons/fa';
import axios from 'axios';
import Context from '../../context/Context';

const DocumentViewer = () => {
  const [charters, setCharters] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
const contextDatas = useContext(Context);
const currentLang = contextDatas.currentLang;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const [t, i18n] = useTranslation('global')
  useEffect(() => {
    const fetchCharters = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/charter`);
        if (response.data.success) {
          setCharters(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching charter data:', error);
      }
    };

    fetchCharters();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % charters.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? charters.length - 1 : prevIndex - 1
    );
  };

  const currentCharter = charters[currentIndex];

  return (
    <div className="document-viewer">
      <h2 className="title">{t('navbar.aboutUs.charter')}</h2>
      {currentCharter ? (
        <>
          <p className="description">{ currentLang == 'uz' ? currentCharter.title_uz : currentLang == 'ru' ? currentCharter.title_ru  : currentCharter.title_en}</p>

          {/* PDF Viewer Section */}
          <div className="pdf-file">
            <FaFilePdf className="pdf-icon" />
            <div className="pdf-details">
              <h3 className="pdf-title">{t('navbar.aboutUs.charter')}</h3>
              <p className="pdf-subtext">PDF file</p>
            </div>
            <div className="pdf-actions">
              <button
                className="icon-button"
                onClick={() => window.open(currentCharter.link, '_blank')}
                title="Yuklab olish"
              >
                <FaDownload />
              </button>
              <button
                className="icon-button"
                onClick={() => window.open(currentCharter.link, '_blank')}
                title="Ochish"
              >
                <FaExternalLinkAlt />
              </button>
            </div>
          </div>

          {/* Navigation Buttons */}
          {/* <div className="navigation-buttons">
            <button onClick={handlePrevious} disabled={charters.length <= 1}>
              {t('prev')}
            </button>
            <button onClick={handleNext} disabled={charters.length <= 1}>
              {t('next')}
            </button>
          </div> */}
        </>
      ) : (
        <p>Ma'lumotlar yuklanmoqda...</p>
      )}
    </div>
  );
};

export default DocumentViewer;
