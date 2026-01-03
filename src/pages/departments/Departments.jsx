import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Context from '../../context/Context';
import './style.css';
import {
  Users,
  Briefcase,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Search,
  Building2
} from 'lucide-react';

const Departments = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { t } = useTranslation('global');
  const navigate = useNavigate();
  
  const contextDatas = useContext(Context);
  const currentLang = contextDatas.currentLang;

  // States
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deptsPerPage] = useState(9);

  // API call
  const GetDepartments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BACKEND_URL}/api/department?limit=100`);
      setDepartments(data.data || []);
    } catch (error) {
      toast.error(t('error.fetchDepartments') || 'Xatolik yuz berdi');
      console.error('Error fetching departments:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetDepartments();
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

  // Filter departments based on search
  const filteredDepartments = departments.filter((dep) => {
    const title = getText(dep, 'title').toLowerCase();
    return title.includes(searchQuery.toLowerCase());
  });

  // Pagination
  const indexOfLast = currentPage * deptsPerPage;
  const indexOfFirst = indexOfLast - deptsPerPage;
  const currentDepartments = filteredDepartments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredDepartments.length / deptsPerPage);

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

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">{t('loading') || 'Yuklanmoqda...'}</p>
      </div>
    );
  }

  return (
    <div className="departments-page">
      {/* Hero Section */}
      <div className="departments-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <Building2 size={64} className="hero-icon" />
          <h1 className="hero-title">{t('navbar.aboutUs.departments') || "Bo'limlar"}</h1>
          <p className="hero-subtitle">
            {currentLang === 'uz' 
              ? `Jami ${departments.length} ta bo'lim` 
              : `Total ${departments.length} departments`}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="departments-content">
        <div className="container_">
          {/* Search Bar */}
          <div className="search-section">
            <div className="search-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder={currentLang === 'uz' ? "Bo'limlarni qidirish..." : "Search departments..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="results-count">
              {filteredDepartments.length} {currentLang === 'uz' ? "ta bo'lim topildi" : "departments found"}
            </div>
          </div>

          {/* Departments Grid */}
          {currentDepartments.length > 0 ? (
            <>
              <div className="departments_wrp">
                {currentDepartments.map((dep) => {
                  const employees = Array.isArray(dep.employees) ? dep.employees : [];
                  return (
                    <div 
                      key={dep._id} 
                      className="department_card" 
                      onClick={() => navigate(`/departments/${dep._id}`)}
                    >
                      <div className="department_header">
                        <div className="department_icon_wrapper">
                          <img 
                            src={dep.img} 
                            alt={getText(dep, 'title')} 
                            className="department_img" 
                            onError={(e) => e.target.src = 'https://via.placeholder.com/130'}
                          />
                        </div>
                        <div className="department_info">
                          <h3 className="dep_title">{getText(dep, 'title')}</h3>
                          {employees.length > 0 && (
                            <div className="department_badge">
                              <Users size={16} />
                              <span>
                                {employees.length} {currentLang === 'uz' ? 'xodim' : 'employees'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="department_body">
                        <div className="department_employees_header">
                          <Briefcase size={20} />
                          <span>{currentLang === 'uz' ? 'Xodimlar' : 'Employees'}</span>
                        </div>
                        
                        {employees.length > 0 ? (
                          <div className="department_employees_list">
                            {employees.slice(0, 5).map((emp) => (
                              <div
                                key={emp._id}
                                className="department_employee_item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (emp._id) {
                                    navigate(`/employees/${emp._id}`);
                                  } else {
                                    console.error('Employee ID mavjud emas:', emp);
                                  }
                                }}
                              >
                                <div className="department_employee_info">
                                  <div className="department_employee_position">
                                    {getText(emp, 'position') || 'Lavozim'}
                                  </div>
                                  <div className="department_employee_name">
                                    {getEmployeeName(emp)}
                                  </div>
                                </div>
                                <ArrowRight size={20} className="department_employee_arrow" />
                              </div>
                            ))}
                            {employees.length > 5 && (
                              <div className="department_more_text">
                                +{employees.length - 5} {currentLang === 'uz' ? "ko'proq" : 'more'}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="department_empty_employees">
                            <Users size={48} />
                            <p>{currentLang === 'uz' ? 'Xodimlar yo\'q' : 'No employees'}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="departments-pagination">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                    disabled={currentPage === 1} 
                    className="pagination-btn"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  <div className="pagination-numbers">
                    {getPaginationRange(currentPage, totalPages).map((num, i) => (
                      num === '...' ? (
                        <span key={i} className="pagination-dots">...</span>
                      ) : (
                        <button 
                          key={i} 
                          className={`pagination-number ${num === currentPage ? 'active' : ''}`} 
                          onClick={() => setCurrentPage(num)}
                        >
                          {num}
                        </button>
                      )
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                    disabled={currentPage === totalPages} 
                    className="pagination-btn"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-results">
              <Building2 size={80} className="no-results-icon" />
              <h3 className="no-results-title">
                {currentLang === 'uz' ? "Bo'limlar topilmadi" : "No departments found"}
              </h3>
              <p className="no-results-text">
                {currentLang === 'uz' 
                  ? "Qidiruv so'rovingizni o'zgartiring yoki filtrlarni tozalang" 
                  : "Try changing your search query or clearing filters"}
              </p>
              {searchQuery && (
                <button 
                  className="clear-search-btn" 
                  onClick={() => setSearchQuery('')}
                >
                  {currentLang === 'uz' ? "Qidiruvni tozalash" : "Clear search"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Departments;