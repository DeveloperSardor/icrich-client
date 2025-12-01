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
  }, []);

  // Determine language-specific field
  const getField = (item, field) => {
    if (currentLang === 'en') return item[`${field}_en`];
    if (currentLang === 'ru') return item[`${field}_ru`];
    if (currentLang === 'uz') return item[`${field}_uz`];
    return item[`${field}_en`]; // Fallback to English
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

  return (
    <div className="job-container">
      <h1 className="job-title">{t('navbar.aboutUs.jobs')}</h1>
      {loading ? (
        <p>{t('loading')}</p>
      ) : (
        <div className="job-list">
          {vacancies.map((vacancy) => (
            <div className="job-card" key={vacancy._id}>
              <h3 className="job-heading">{getField(vacancy.role, 'name')}</h3>
              <h4 className="job-subheading">{getField(vacancy, 'title')}</h4>
              <p className="job-description">{getField(vacancy, 'text')}</p>
              <button
                className="apply-button"
                onClick={() => {
                  setSelectedVacancy(vacancy);
                  setShowModal(true);
                }}
                disabled={appliedVacancies.includes(vacancy._id)} // Disable if already applied
              >
                {appliedVacancies.includes(vacancy._id)
                  ? t('alreadyApplied')
                  : t('applyNow')}
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>
              {t('applyFor')} {getField(selectedVacancy.role, 'name')}
            </h2>
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

              <button type="submit">{t('submitApplication')}</button>
              <button type="button" onClick={() => setShowModal(false)}>
                {t('close')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobVacancies;
