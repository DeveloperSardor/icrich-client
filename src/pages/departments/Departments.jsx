import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Context from '../../context/Context';
import './style.css';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Mail,
  Phone,
  MapPin,
  Briefcase
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
  const [deptsPerPage] = useState(6);

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
  }, [currentLang]);

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

  // Filter departments
  const filteredDepartments = departments.filter((dep) => {
    const title = getText(dep, 'title').toLowerCase();
    return title.includes(searchQuery.toLowerCase());
  });

  // Pagination
  const indexOfLast = currentPage * deptsPerPage;
  const indexOfFirst = indexOfLast - deptsPerPage;
  const currentDepartments = filteredDepartments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredDepartments.length / deptsPerPage);

  const getPaginationRange = () => {
    const range = [];
    const delta = 1;
    
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      } else if (range[range.length - 1] !== '...') {
        range.push('...');
      }
    }
    return range;
  };

  const getSearchPlaceholder = () => {
    if (currentLang === 'uz') return "Qidirish...";
    if (currentLang === 'ru') return "Поиск...";
    return "Search...";
  };

  const getNoEmployeesText = () => {
    if (currentLang === 'uz') return "Xodimlar yo'q";
    if (currentLang === 'ru') return "Нет сотрудников";
    return "No employees";
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="loading-wrap">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dept-page">
      <div className="dept-container">
        
        {/* Header */}
        <div className="dept-header">
          <h1 className="dept-header-title">
            {t('navbar.aboutUs.departments') || "Bo'limlar"}
          </h1>
          
          {/* Search */}
          <div className="dept-search">
            <Search size={18} />
            <input
              type="text"
              placeholder={getSearchPlaceholder()}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Departments */}
        {currentDepartments.length > 0 ? (
          <>
            {currentDepartments.map((dep) => {
              const employees = Array.isArray(dep.employees) ? dep.employees : [];
              const description = getText(dep, 'description');
              
              return (
                <div key={dep._id} className="dept-block">
                  
                  {/* Department Title */}
                  <div className="dept-title-row">
                    <img 
                      src={dep.img} 
                      alt="" 
                      className="dept-icon"
                      onError={(e) => e.target.src = 'https://via.placeholder.com/40'}
                    />
                    <h2>{getText(dep, 'title')}</h2>
                  </div>

                  {/* Department Description (if exists) */}
                  {description && (
                    <div className="dept-description">
                      <div 
                        className="dept-description-content"
                        dangerouslySetInnerHTML={{ __html: description }}
                      />
                    </div>
                  )}

                  {/* Employees */}
                  {employees.length > 0 ? (
                    <div className="emp-grid">
                      {employees.map((emp) => (
                        <div
                          key={emp._id}
                          className="emp-card"
                          onClick={() => emp._id && navigate(`/employees/${emp._id}`)}
                        >
                          <img
                            src={emp.img || "https://via.placeholder.com/80"}
                            alt={getEmployeeName(emp)}
                          />
                          <div className="emp-info">
                            <h3>{getEmployeeName(emp)}</h3>
                            <p className="emp-pos">{getText(emp, 'position')}</p>
                            {emp.academicDegree && (
                              <p className="emp-degree">{getText(emp, 'academicDegree')}</p>
                            )}
                            <div className="emp-contacts">
                              {emp.email && (
                                <span title={emp.email}>
                                  <Mail size={12} /> {emp.email}
                                </span>
                              )}
                              {emp.phone && (
                                <span title={emp.phone}>
                                  <Phone size={12} /> {emp.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="emp-empty">
                      <Briefcase size={32} />
                      <p>{getNoEmployeesText()}</p>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="dept-pagination">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                </button>
                
                {getPaginationRange().map((num, i) => (
                  num === '...' ? (
                    <span key={i} className="dots">...</span>
                  ) : (
                    <button 
                      key={i} 
                      className={num === currentPage ? 'active' : ''}
                      onClick={() => setCurrentPage(num)}
                    >
                      {num}
                    </button>
                  )
                ))}
                
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-results">
            <Search size={48} />
            <p>
              {currentLang === 'uz' && "Hech narsa topilmadi"}
              {currentLang === 'ru' && "Ничего не найдено"}
              {currentLang === 'en' && "Nothing found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Departments;