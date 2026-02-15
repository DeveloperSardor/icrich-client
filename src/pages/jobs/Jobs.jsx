import React, { useEffect, useState, useContext } from 'react';
import './style.css';
import { useTranslation } from 'react-i18next';
import Context from '../../context/Context';

const JobVacancies = () => {
  const { t } = useTranslation('global');  
  const contextDatas = useContext(Context);
  const currentLang = contextDatas.currentLang;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    text: '',
    resume: '',
  });
  const [appliedVacancies, setAppliedVacancies] = useState([]);

  // Fetch job vacancies
  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/api/job-vacancies`);
        const data = await response.json();
        if (data.success) {
          setVacancies(data.data);
        }
      } catch (error) {
        console.error('Error fetching job vacancies:', error);
      } finally {
        setLoading(false);
      }
    };

    // Load applied vacancies from localStorage
    const savedApplications = JSON.parse(localStorage.getItem('appliedVacancies')) || [];
    setAppliedVacancies(savedApplications);

    fetchVacancies();
  }, [BACKEND_URL]);

  // Determine language-specific field
  const getField = (item, field) => {
    if (!item) return '';
    if (currentLang === 'en') return item[`${field}_en`] || item[`${field}_uz`] || '';
    if (currentLang === 'ru') return item[`${field}_ru`] || item[`${field}_uz`] || '';
    if (currentLang === 'uz') return item[`${field}_uz`] || '';
    return item[`${field}_en`] || ''; // Fallback to English
  };

  // Strip HTML tags for preview text
  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/api/vacancy-applications`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          vacancy: selectedVacancy?._id,
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert(t('application.success')); // Replace with localized success message

        // Save application in localStorage
        const newApplications = [...appliedVacancies, selectedVacancy._id];
        setAppliedVacancies(newApplications);
        localStorage.setItem('appliedVacancies', JSON.stringify(newApplications));

        setShowModal(false);
        setFormData({
          name: '',
          phone: '',
          text: '',
          resume: '',
        });
      } else {
        alert(t('application.error')); // Replace with localized error message
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert(t('application.error'));
    }
  };

  if (loading) {
    return (
      <div className="job-container">
        <div className="skeleton-job-title"></div>
        <div className="job-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-job-card">
              <div className="skeleton-job-heading"></div>
              <div className="skeleton-job-subheading"></div>
              <div className="skeleton-job-line"></div>
              <div className="skeleton-job-line short"></div>
              <div className="skeleton-job-button"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!vacancies || vacancies.length === 0) {
    return (
      <div className="job-container">
        <h1 className="job-title">{t('navbar.aboutUs.jobs')}</h1>
        <div className="no-vacancies">
          <p>
            {currentLang === 'uz'
              ? "Ish o'rinlari topilmadi"
              : currentLang === 'ru'
              ? 'Вакансии не найдены'
              : 'No vacancies found'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="job-container">
      <h1 className="job-title">{t('navbar.aboutUs.jobs')}</h1>
      <div className="job-list">
        {vacancies.map((vacancy) => {
          const textContent = getField(vacancy, 'text');
          const plainText = stripHtml(textContent);
          const truncatedText = plainText.length > 150 
            ? plainText.slice(0, 150) + '...' 
            : plainText;

          return (
            <div className="job-card" key={vacancy._id}>
              {/* HTML Support for Heading */}
              <h3 
                className="job-heading"
                dangerouslySetInnerHTML={{ __html: getField(vacancy.role, 'name') }}
              />
              
              {/* HTML Support for Subheading */}
              <h4 
                className="job-subheading"
                dangerouslySetInnerHTML={{ __html: getField(vacancy, 'title') }}
              />
              
              {/* Plain text preview for Description */}
              <p className="job-description">{truncatedText}</p>
              
              <button
                className={`apply-button ${appliedVacancies.includes(vacancy._id) ? 'disabled' : ''}`}
                onClick={() => {
                  setSelectedVacancy(vacancy);
                  setShowModal(true);
                }}
                disabled={appliedVacancies.includes(vacancy._id)}
              >
                {appliedVacancies.includes(vacancy._id)
                  ? t('alreadyApplied')
                  : t('applyNow')}
              </button>
            </div>
          );
        })}
      </div>

      {showModal && selectedVacancy && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">
              {t('applyFor')} <span dangerouslySetInnerHTML={{ __html: getField(selectedVacancy.role, 'name') }} />
            </h2>
            
            {/* Full HTML content in modal */}
            <div 
              className="modal-vacancy-details"
              dangerouslySetInnerHTML={{ __html: getField(selectedVacancy, 'text') }}
            />

            <form onSubmit={handleSubmit}>
              <label>{t('name')}:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <label>{t('phone')}:</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />

              <label>{t('coverLetter')}:</label>
              <textarea
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                required
              />

              <label>{t('resume')} (URL):</label>
              <input
                type="text"
                value={formData.resume}
                onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
              />

              <div className="modal-buttons">
                <button type="submit" className="submit-button">
                  {t('submitApplication')}
                </button>
                <button type="button" className="close-button" onClick={() => setShowModal(false)}>
                  {t('close')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobVacancies;