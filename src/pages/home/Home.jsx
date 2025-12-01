import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import NewsCard from "../../components/news-card/NewsCard";
import Context from "../../context/Context";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./style.css";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Users,
  Calendar,
  MapPin,
  ExternalLink,
  Briefcase,
  ArrowRight
} from "lucide-react";

const Home = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { t } = useTranslation("global");
  const navigate = useNavigate();

  const contextDatas = useContext(Context);
  const currentLang = contextDatas.currentLang;

  // States
  const [news, setNews] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [newsCurrentPage, setNewsCurrentPage] = useState(1);
  const [deptCurrentPage, setDeptCurrentPage] = useState(1);
  const [newsPerPage] = useState(6);
  const [deptsPerPage] = useState(6);
  const [loading, setLoading] = useState(true);

  // API calls
  const GetNews = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/news`);
      setNews(data.data || []);
    } catch (error) {
      toast.error(t("error.fetchNews"));
      console.error("Error fetching news:", error.message);
    }
  };

  const GetDocuments = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/docs`);
      setDocuments(data.data || []);
    } catch (error) {
      toast.error(t("error.fetchDocuments"));
      console.error("Error fetching documents:", error.message);
    }
  };

  const GetDepartments = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/department?limit=100`);
      setDepartments(data.data || []);
    } catch (error) {
      toast.error(t("error.fetchDepartments"));
      console.error("Error fetching departments:", error.message);
    }
  };

  const GetAnnouncements = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/announcement`);
      setAnnouncements(data.data || []);
    } catch (error) {
      toast.error(t("error.fetchAnnouncements"));
      console.error("Error fetching announcements:", error.message);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        GetNews(),
        GetDocuments(),
        GetDepartments(),
        GetAnnouncements()
      ]);
      setLoading(false);
    };
    fetchAllData();
  }, []);

  // Helper functions
  const getText = (item, field) => {
    if (!item) return '';
    if (item[field] && typeof item[field] === 'object' && !Array.isArray(item[field])) {
      const value = item[field][currentLang] || item[field].uz || item[field].ru || item[field].en || '';
      return String(value);
    }
    const fieldWithLang = `${field}_${currentLang}`;
    if (item[fieldWithLang]) {
      return String(item[fieldWithLang]);
    }
    if (item[field]) {
      return String(item[field]);
    }
    return '';
  };

  const getEmployeeName = (emp) => {
    if (!emp) return 'Noma\'lum';
    if (emp.name && typeof emp.name === 'object') {
      return emp.name[currentLang] || emp.name.uz || emp.name.ru || emp.name.en || 'Noma\'lum';
    }
    return emp.name || 'Noma\'lum';
  };

  // News Pagination
  const newsIndexOfLast = newsCurrentPage * newsPerPage;
  const newsIndexOfFirst = newsIndexOfLast - newsPerPage;
  const currentNews = news.slice(newsIndexOfFirst, newsIndexOfLast);
  const newsTotalPages = Math.ceil(news.length / newsPerPage);

  // Departments Pagination
  const deptIndexOfLast = deptCurrentPage * deptsPerPage;
  const deptIndexOfFirst = deptIndexOfLast - deptsPerPage;
  const currentDepartments = departments.slice(deptIndexOfFirst, deptIndexOfLast);
  const deptTotalPages = Math.ceil(departments.length / deptsPerPage);

  const getPaginationRange = (currentPage, totalPages) => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      if (totalPages > 1) rangeWithDots.push(totalPages);
    }

    return rangeWithDots.filter((item, index, arr) => arr.indexOf(item) === index && item !== 1 || index === 0);
  };

  const sliderSettings = {
    dots: false,
    arrows: true,
    infinite: announcements.length > 3,
    speed: 500,
    slidesToShow: Math.min(3, announcements.length),
    slidesToScroll: 1,
    autoplay: announcements.length > 1,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    prevArrow: <button type="button" className="slick-prev"><ChevronLeft size={24} /></button>,
    nextArrow: <button type="button" className="slick-next"><ChevronRight size={24} /></button>,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, announcements.length),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (currentLang === 'uz') {
        const uzMonths = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
        return `${date.getDate()} ${uzMonths[date.getMonth()]}, ${date.getFullYear()}`;
      } else if (currentLang === 'ru') {
        return date.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
      } else {
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      }
    } catch (error) {
      return new Date(dateString).toLocaleDateString();
    }
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    const textStr = String(text);
    return textStr.length > maxLength ? textStr.slice(0, maxLength) + '...' : textStr;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">{t("loading") || "Yuklanmoqda..."}</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero */}
      <div className="hero_section">
        <div className="content_">
          <h1 className="title">{t("nmm")}</h1>
        </div>
      </div>

      {/* News */}
      <div className="news_section">
        <div className="container_">
          <h2 className="heading">{t("navbar.news.news") || "Yangiliklar"}</h2>
          <div className="news_wrp">
            {currentNews.length > 0 ? (
              currentNews.map((item) => <NewsCard key={item._id} data={item} />)
            ) : (
              <div className="no-news-message">
                <FileText size={48} className="no-content-icon" />
                <p>{t("noNews") || "Yangiliklar topilmadi"}</p>
              </div>
            )}
          </div>

          {newsTotalPages > 1 && (
            <div className="news-pagination">
              <button onClick={() => setNewsCurrentPage(p => Math.max(1, p - 1))} disabled={newsCurrentPage === 1} className="pagination-btn">
                <ChevronLeft size={16} />
              </button>
              <div className="pagination-numbers">
                {getPaginationRange(newsCurrentPage, newsTotalPages).map((num, i) => (
                  num === '...' ? <span key={i} className="pagination-dots">...</span> :
                    <button key={i} className={`pagination-number ${num === newsCurrentPage ? 'active' : ''}`} onClick={() => setNewsCurrentPage(num)}>{num}</button>
                ))}
              </div>
              <button onClick={() => setNewsCurrentPage(p => Math.min(newsTotalPages, p + 1))} disabled={newsCurrentPage === newsTotalPages} className="pagination-btn">
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Announcements */}
      <div className="announcements_section">
        <div className="container_">
          <div className="section_header">
            <h2 className="heading">{t("navbar.news.announcements") || "E'lonlar"}</h2>
            <div className="section_subtitle"><span>{t('navbar.news.latestAnnouncements')}</span></div>
          </div>
          {announcements.length > 0 ? (
            <div className="announcements_container">
              <Slider {...sliderSettings}>
                {announcements.map((ann) => (
                  <div key={ann._id} className="slide_wrapper">
                    <article className="ann_card" onClick={() => navigate(`/announcements/${ann._id}`)}>
                      <div className="card_image_container">
                        <img src={ann.img} alt={ann[`title_${currentLang}`]} onError={(e) => e.target.src = '/placeholder.jpg'} />
                        <div className="image_overlay"><div className="new_badge">Yangi</div></div>
                      </div>
                      <div className="card_content">
                        <time className="card_date">{formatDate(ann.createdAt)}</time>
                        <h3 className="card_title">{truncateText(ann[`title_${currentLang}`], 70)}</h3>
                        <p className="card_description">{truncateText(ann[`desc_${currentLang}`], 100)}</p>
                        <div className="card_footer">
                          <span className="read_more">{t('moreBtn')}</span>
                          <svg className="arrow_icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        </div>
                      </div>
                    </article>
                  </div>
                ))}
              </Slider>
            </div>
          ) : (
            <div className="no_content_message">
              <div className="empty_icon"><Calendar size={48} /></div>
              <h3 className="empty_title">{t("announcements.noContent")}</h3>
              <p className="empty_subtitle">{t("announcements.comingSoon")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Departments */}
      <div className="departments_section">
        <div className="container_">
          <h2 className="heading">{t("navbar.aboutUs.departments") || "Bo'limlar"}</h2>
          <div className="departments_wrp">
            {currentDepartments.map((dep) => {
              const employees = Array.isArray(dep.employees) ? dep.employees : [];
              return (
                <div key={dep._id} className="department_card" onClick={() => navigate(`/departments/${dep._id}`)}>
                  <div className="department_header">
                    <div className="department_icon_wrapper">
                      <img src={dep.img} alt={getText(dep, 'title')} className="department_img" onError={(e) => e.target.src = 'https://via.placeholder.com/120'} />
                    </div>
                    <div className="department_info">
                      <h3 className="dep_title">{getText(dep, 'title')}</h3>
                      {employees.length > 0 && (
                        <div className="department_badge"><Users size={16} /><span>{employees.length} {currentLang === 'uz' ? 'xodim' : 'employees'}</span></div>
                      )}
                    </div>
                  </div>
                  <div className="department_body">
                    <div className="department_employees_header"><Briefcase size={20} /><span>{currentLang === 'uz' ? 'Xodimlar' : 'Employees'}</span></div>
                    {employees.length > 0 ? (
                      <div className="department_employees_list">
                        {employees.slice(0, 5).map((emp) => (
                          <div
                            key={emp._id}
                            className="department_employee_item"
                            onClick={(e) => {
                              e.stopPropagation();
                              // MUHIM: emp._id ni to'g'ri yuborish
                              if (emp._id) {
                                navigate(`/employees/${emp._id}`);
                              } else {
                                console.error('Employee ID mavjud emas:', emp);
                              }
                            }}
                          >
                            <div className="department_employee_info">
                              <div className="department_employee_position">{getText(emp, 'position') || 'Lavozim'}</div>
                              <div className="department_employee_name">{getEmployeeName(emp)}</div>
                            </div>
                            <ArrowRight size={20} className="department_employee_arrow" />
                          </div>
                        ))}
                        {employees.length > 5 && <div className="department_more_text">+{employees.length - 5} {currentLang === 'uz' ? "ko'proq" : 'more'}</div>}
                      </div>
                    ) : (
                      <div className="department_empty_employees"><Users size={48} /><p>{currentLang === 'uz' ? 'Xodimlar yo\'q' : 'No employees'}</p></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {deptTotalPages > 1 && (
            <div className="departments-pagination">
              <button onClick={() => setDeptCurrentPage(p => Math.max(1, p - 1))} disabled={deptCurrentPage === 1} className="pagination-btn">
                <ChevronLeft size={16} />
              </button>
              <div className="pagination-numbers">
                {getPaginationRange(deptCurrentPage, deptTotalPages).map((num, i) => (
                  num === '...' ? <span key={i} className="pagination-dots">...</span> :
                    <button key={i} className={`pagination-number ${num === deptCurrentPage ? 'active' : ''}`} onClick={() => setDeptCurrentPage(num)}>{num}</button>
                ))}
              </div>
              <button onClick={() => setDeptCurrentPage(p => Math.min(deptTotalPages, p + 1))} disabled={deptCurrentPage === deptTotalPages} className="pagination-btn">
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Documents */}
      <div className="documents_section">
        <div className="container_">
          <h2 className="heading">{t("navbar.docs") || "Hujjatlar"}</h2>
          <div className="documents_wrp">
            {documents.slice(0, 3).map((doc) => (
              <div key={doc._id} className="document_card">
                <FileText size={36} className="doc_icon" />
                <h3 className="doc_title">{truncateText(doc[`title_${currentLang}`], 50)}</h3>
                <p className="doc_text">{truncateText(doc[`text_${currentLang}`], 80)}</p>
                {doc.link && <a href={doc.link} className="doc_link" target="_blank" rel="noopener noreferrer"><ExternalLink size={14} />{t("viewDocument")}</a>}
              </div>
            ))}
          </div>
          {documents.length > 3 && <button className="more_btn" onClick={() => navigate("/docs")}>{t("moreBtn")}</button>}
        </div>
      </div>

      {/* Map */}
      <div className="map">
        <div className="container_">
          <div className="map-header">
            <h2><MapPin size={20} />{t("ourLocation")}</h2>
            <p>{t("findUsOnMap")}</p>
          </div>
          <iframe src="https://yandex.uz/map-widget/v1/-/CHQrFz4nT" width="100%" height="400px" frameBorder="0" title="Map" allowFullScreen loading="lazy" />
        </div>
      </div>
    </div>
  );
};

export default Home;