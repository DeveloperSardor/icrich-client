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
  const [showModal, setShowModal] = useState(false);
  const contextDatas = useContext(Context);
  const currentLang = contextDatas.currentLang || 'uz';

  // Rahbariyatni olish
  const fetchLeaders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Faqat rahbariyat a'zolarini olish
      const { data } = await axios.get(`${BACKEND_URL}/api/leadership/role/leadership`);
      
      console.log("Leadership data:", data);
      
      // Faqat faol rahbarlarni filter qilish
      const activeLeaders = data.data.filter(leader => leader.isActive);
      setLeaders(activeLeaders);
    } catch (error) {
      console.error("Error fetching leadership data:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  // Modal ochish
  const openModal = (leader) => {
    setSelectedLeader(leader);
    setShowModal(true);
    document.body.style.overflow = 'hidden'; // Scroll-ni to'xtatish
  };

  // Modal yopish
  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto'; // Scroll-ni qaytarish
    setTimeout(() => setSelectedLeader(null), 300);
  };

  // Tilga mos ma'lumotni olish helper funksiyasi
  const getLocalizedField = (field) => {
    if (!field) return "";
    if (typeof field === 'string') return field;
    return field[currentLang] || field.uz || field.en || "";
  };

  // Qabul kunlarini formatlash
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

  // Vaqtni formatlash
  const formatTime = (schedule) => {
    if (!schedule || !schedule.start || !schedule.end) {
      return "15:00-17:00";
    }
    return `${schedule.start}-${schedule.end}`;
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
              
              {/* Ilmiy daraja */}
              {leader.academicDegree && (
                <p className="leader-degree">
                  {getLocalizedField(leader.academicDegree)}
                </p>
              )}

              {/* Biografiya tugmalari */}
              <div className="leader-buttons">
                <button className="btn-duties" onClick={() => openModal(leader)}>
                  {currentLang === 'en' ? 'Duties' : currentLang === 'ru' ? 'Обязанности' : 'Vazifalari'}
                </button>
                <button className="btn-biography" onClick={() => openModal(leader)}>
                  {currentLang === 'en' ? 'Biography' : currentLang === 'ru' ? 'Биография' : 'Biografiya'}
                </button>
              </div>

              {/* Aloqa ma'lumotlari */}
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

              {/* Qabul vaqti */}
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

      {/* Modal oyna */}
      {showModal && selectedLeader && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <FaTimes />
            </button>
            
            <div className="modal-header">
              <h2 className="modal-title">
                {currentLang === 'en' ? 'BIOGRAPHY' : currentLang === 'ru' ? 'БИОГРАФИЯ' : 'BIOGRAFIYA'}
              </h2>
            </div>
            
            <div className="modal-body">
              <h3 className="modal-leader-name">
                {getLocalizedField(selectedLeader.name)}
              </h3>
              
              {/* Biografiya */}
              {selectedLeader.bio && getLocalizedField(selectedLeader.bio) && (
                <p className="modal-bio">
                  {getLocalizedField(selectedLeader.bio)}
                </p>
              )}
              
              {/* Ta'lim */}
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
              
              {/* Mukofotlar */}
              {selectedLeader.awards && Array.isArray(selectedLeader.awards) && selectedLeader.awards.length > 0 && (
                <div className="modal-section">
                  <h4 className="modal-section-title">
                    {currentLang === 'en' 
                      ? 'AWARDED WITH THE FOLLOWING STATE AWARDS' 
                      : currentLang === 'ru' 
                      ? 'НАГРАЖДЕН СЛЕДУЮЩИМИ ГОСУДАРСТВЕННЫМИ НАГРАДАМИ' 
                      : 'QUYIDAGI DAVLAT MUKOFOTLARI BILAN TAQDIRLANGAN'}
                  </h4>
                  <ul className="modal-list">
                    {selectedLeader.awards.map((award, index) => (
                      <li key={index}>{getLocalizedField(award)}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Mehnat faoliyati */}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Rahbariyat;