import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaClock, FaEnvelope, FaPhone, FaTimes, FaMapMarkerAlt, FaGlobe } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Context from "../../context/Context";
import "./style.css";

const Rahbariyat = () => {
  const [t] = useTranslation("global");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const contextDatas = useContext(Context);
  const currentLang = contextDatas.currentLang || 'uz';

  // Fetch leadership data (query endpoint — /role/leadership ba'zi deploylarda 404 berishi mumkin)
  const fetchLeaders = async () => {
    const base = (BACKEND_URL || "").replace(/\/+$/, "");
    if (!base) {
      setError("VITE_BACKEND_URL sozlanmagan");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.get(`${base}/api/leadership`, {
        params: {
          role: "leadership",
          isActive: true,
          limit: 200,
          page: 1,
        },
        timeout: 25_000,
      });

      const rows = Array.isArray(data?.data) ? data.data : [];
      setLeaders(rows.filter((leader) => leader.isActive !== false));
    } catch (err) {
      const status = err.response?.status;
      const msg =
        status === 404
          ? "Ma'lumot topilmadi (404)"
          : err.response?.data?.message || err.message || "So'rov xatosi";
      console.error("Error fetching leadership data:", msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  // Open modal
  const openModal = (leader, type) => {
    setSelectedLeader(leader);
    setModalType(type);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto';
    setTimeout(() => {
      setSelectedLeader(null);
      setModalType(null);
    }, 300);
  };

  // Get localized field
  const getLocalizedField = (field) => {
    if (!field) return "";
    if (typeof field === 'string') return field;
    return field[currentLang] || field.uz || field.en || "";
  };

  // Format schedule days
  const formatSchedule = (schedule) => {
    if (!schedule || !schedule.days || schedule.days.length === 0) {
      return currentLang === 'en' 
        ? "By appointment" 
        : currentLang === 'ru' 
        ? "По записи" 
        : "Oldindan kelishilgan holda";
    }

    const daysMap = {
      uz: {
        monday: "Dushanba",
        tuesday: "Seshanba",
        wednesday: "Chorshanba",
        thursday: "Payshanba",
        friday: "Juma",
        saturday: "Shanba",
        sunday: "Yakshanba"
      },
      ru: {
        monday: "Понедельник",
        tuesday: "Вторник",
        wednesday: "Среда",
        thursday: "Четверг",
        friday: "Пятница",
        saturday: "Суббота",
        sunday: "Воскресенье"
      },
      en: {
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
        saturday: "Saturday",
        sunday: "Sunday"
      }
    };

    const translatedDays = schedule.days.map(day => 
      daysMap[currentLang][day.toLowerCase()] || day
    );

    return translatedDays.join(", ");
  };

  // Format time
  const formatTime = (schedule) => {
    if (!schedule || !schedule.start || !schedule.end) {
      return "15:00-17:00";
    }
    return `${schedule.start}-${schedule.end}`;
  };

  // Get modal title
  const getModalTitle = () => {
    if (modalType === 'duties') {
      return currentLang === 'en' ? 'VAZIFALARI' : currentLang === 'ru' ? 'ОБЯЗАННОСТИ' : 'VAZIFALARI';
    }
    return currentLang === 'en' ? 'BIOGRAFIYA' : currentLang === 'ru' ? 'БИОГРАФИЯ' : 'BIOGRAFIYA';
  };

  // Parse biography into sections
  const parseBiography = (bioText) => {
    if (!bioText) return { intro: '', sections: [] };

    const sections = [];
    let currentSection = null;
    let intro = '';
    const lines = bioText.split('\n');

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) return;

      // Detect section headers (ALL CAPS lines)
      if (trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length > 5 && !trimmedLine.match(/^\d{4}/)) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: trimmedLine,
          content: []
        };
      } else if (currentSection) {
        currentSection.content.push(trimmedLine);
      } else {
        // Lines before first section are intro
        intro += (intro ? '\n' : '') + trimmedLine;
      }
    });

    if (currentSection) {
      sections.push(currentSection);
    }

    return { intro, sections };
  };

  if (loading) {
    return (
      <div className="rahbariyat-container">
        <h2 className="section-title">{t("navbar.aboutUs.leadership")}</h2>
        <p style={{ textAlign: 'center', padding: '2rem' }}>
          {currentLang === 'en' ? 'Loading...' : currentLang === 'ru' ? 'Загрузка...' : 'Yuklanmoqda...'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rahbariyat-container">
        <h2 className="section-title">{t("navbar.aboutUs.leadership")}</h2>
        <p style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          {currentLang === 'en' 
            ? `Error: ${error}` 
            : currentLang === 'ru' 
            ? `Ошибка: ${error}` 
            : `Xatolik: ${error}`}
        </p>
      </div>
    );
  }

  return (
    <div className="rahbariyat-container">
      <h2 className="section-title">{t("navbar.aboutUs.leadership")}</h2>
      <div className="leaders-grid">
        {leaders.length > 0 ? (
          leaders.map((leader) => (
            <div className="leader-card" key={leader._id}>
              <img
                src={leader.img || "https://via.placeholder.com/150"}
                alt={getLocalizedField(leader.name)}
                className="leader-image"
              />
              <h3 className="leader-name">
                {getLocalizedField(leader.name)}
              </h3>
              <p className="leader-position">
                {getLocalizedField(leader.position)}
              </p>
              
              {leader.academicDegree && (
                <p className="leader-degree">
                  {getLocalizedField(leader.academicDegree)}
                </p>
              )}

              <div className="leader-buttons">
                <button 
                  className="btn-duties" 
                  onClick={() => openModal(leader, 'duties')}
                >
                  {currentLang === 'en' ? 'Vazifalari' : currentLang === 'ru' ? 'Обязанности' : 'Vazifalari'}
                </button>
                <button 
                  className="btn-biography" 
                  onClick={() => openModal(leader, 'biography')}
                >
                  {currentLang === 'en' ? 'Biografiya' : currentLang === 'ru' ? 'Биография' : 'Biografiya'}
                </button>
              </div>

              <div className="leader-contacts">
                {leader.email && (
                  <p className="leader-email">
                    <FaEnvelope /> {leader.email}
                  </p>
                )}
                {leader.phone && (
                  <p className="leader-phone">
                    <FaPhone /> {leader.phone}
                  </p>
                )}
                {leader.website && (
                  <p className="leader-website">
                    <FaGlobe /> {leader.website}
                  </p>
                )}
                {leader.address && (
                  <p className="leader-address">
                    <FaMapMarkerAlt /> {getLocalizedField(leader.address)}
                  </p>
                )}
              </div>

              <div className="admission">
                <p className="leader-schedule">
                  {formatSchedule(leader.schedule)}
                </p>
                <p className="leader-time">
                  <FaClock /> {formatTime(leader.schedule)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            {currentLang === 'en' 
              ? 'No leadership members found' 
              : currentLang === 'ru' 
              ? 'Руководство не найдено' 
              : 'Rahbariyat a\'zolari topilmadi'}
          </p>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedLeader && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <FaTimes />
            </button>
            
            <div className="modal-header">
              <div className="modal-header-line"></div>
              <h2 className="modal-title">{getModalTitle()}</h2>
              <div className="modal-header-line"></div>
            </div>
            
            <div className="modal-body">
              <h3 className="modal-leader-name">
                {getLocalizedField(selectedLeader.name)}
              </h3>
              
              {/* Duties Modal Content */}
              {modalType === 'duties' && (
                <div className="modal-duties-content">
                  {selectedLeader.position && (
                    <p className="modal-position-text">
                      {getLocalizedField(selectedLeader.position)}
                    </p>
                  )}
                  
                  {selectedLeader.duties && Array.isArray(selectedLeader.duties) && selectedLeader.duties.length > 0 && (
                    <ul className="modal-list">
                      {selectedLeader.duties.map((duty, index) => (
                        <li key={index}>{getLocalizedField(duty)}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              
              {/* Biography Modal Content */}
              {modalType === 'biography' && (
                <div className="modal-biography-content">
                  {(() => {
                    const bioText = getLocalizedField(selectedLeader.bio);
                    const { intro, sections } = parseBiography(bioText);

                    return (
                      <>
                        {/* Intro text before first section */}
                        {intro && (
                          <div className="modal-bio-text">
                            {intro.split('\n').map((paragraph, idx) => (
                              <p key={idx} className="modal-bio-paragraph">
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        )}

                        {/* Render parsed sections */}
                        {sections.map((section, sectionIndex) => (
                          <div className="modal-section" key={sectionIndex}>
                            <h4 className="modal-section-title">
                              {section.title}
                            </h4>
                            <div className="modal-section-text">
                              {section.content.map((line, lineIndex) => (
                                <p key={lineIndex} className="modal-bio-paragraph">
                                  {line}
                                </p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </>
                    );
                  })()}
                  
                  {/* Education */}
                  {selectedLeader.education && getLocalizedField(selectedLeader.education) && (
                    <div className="modal-section">
                      <h4 className="modal-section-title">
                        {currentLang === 'en' ? 'EDUCATION' : currentLang === 'ru' ? 'ОБРАЗОВАНИЕ' : 'TA\'LIM'}
                      </h4>
                      <p className="modal-section-text">
                        {getLocalizedField(selectedLeader.education)}
                      </p>
                    </div>
                  )}
                  
                  {/* Awards */}
                  {selectedLeader.awards && Array.isArray(selectedLeader.awards) && selectedLeader.awards.length > 0 && (
                    <div className="modal-section">
                      <h4 className="modal-section-title">
                        {currentLang === 'en' 
                          ? 'STATE AWARDS' 
                          : currentLang === 'ru' 
                          ? 'ГОСУДАРСТВЕННЫЕ НАГРАДЫ' 
                          : 'DAVLAT MUKOFOTLARI'}
                      </h4>
                      <ul className="modal-list">
                        {selectedLeader.awards.map((award, index) => (
                          <li key={index}>{getLocalizedField(award)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Work History */}
                  {selectedLeader.workHistory && Array.isArray(selectedLeader.workHistory) && selectedLeader.workHistory.length > 0 && (
                    <div className="modal-section">
                      <h4 className="modal-section-title">
                        {currentLang === 'en' ? 'WORK EXPERIENCE' : currentLang === 'ru' ? 'ТРУДОВАЯ ДЕЯТЕЛЬНОСТЬ' : 'MEHNAT FAOLIYATI'}
                      </h4>
                      <ul className="modal-list">
                        {selectedLeader.workHistory.map((work, index) => (
                          <li key={index}>{getLocalizedField(work)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rahbariyat;