import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import Context from '../../context/Context';
import './employee-detail.css';
import {
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Award,
  Building,
  ArrowLeft,
  Globe
} from 'lucide-react';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('global');
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  
  const contextDatas = useContext(Context);
  const currentLang = contextDatas.currentLang;

  const [employee, setEmployee] = useState(null);
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployeeData();
  }, [id]);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BACKEND_URL}/api/leadership/${id}`);
      console.log('Employee data:', data);
      setEmployee(data.data);
      
      if (data.data.departmentId) {
        const deptResponse = await axios.get(`${BACKEND_URL}/api/department/${data.data.departmentId}`);
        setDepartment(deptResponse.data.data);
      }
    } catch (error) {
    //   toast.error(t('error.fetchEmployee') || "Xodim ma'lumotlarini yuklashda xatolik");
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getText = (item, field) => {
    if (!item) return '';
    if (item[field] && typeof item[field] === 'object' && !Array.isArray(item[field])) {
      return item[field][currentLang] || item[field].uz || item[field].ru || item[field].en || '';
    }
    const fieldWithLang = `${field}_${currentLang}`;
    if (item[fieldWithLang]) return item[fieldWithLang];
    return item[field] || '';
  };

  const getEmployeeName = (emp) => {
    if (!emp) return 'Noma\'lum';
    if (emp.name && typeof emp.name === 'object') {
      return emp.name[currentLang] || emp.name.uz || emp.name.ru || emp.name.en || 'Noma\'lum';
    }
    return emp.name || 'Noma\'lum';
  };

  if (loading) {
    return (
      <div className="emp-loading-container">
        <div className="emp-loading-spinner"></div>
        <p className="emp-loading-text">{t('loading') || 'Yuklanmoqda...'}</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="emp-not-found">
        <p className="emp-not-found-text">Xodim topilmadi</p>
        <button onClick={() => navigate(-1)} className="emp-back-btn">
          Orqaga qaytish
        </button>
      </div>
    );
  }

  return (
    <div className="emp-detail-page">
      <div className="emp-container">
        <button onClick={() => navigate(-1)} className="emp-back-link">
          <ArrowLeft className="emp-back-icon" />
          <span>Orqaga</span>
        </button>

        <div className="emp-card">
          {/* Header */}
          <div className="emp-header">
            <div className="emp-avatar-wrapper">
              <div className="emp-avatar">
                <img
                  src={employee.img || '/placeholder-avatar.jpg'}
                  alt={getEmployeeName(employee)}
                  onError={(e) => e.target.src = 'https://via.placeholder.com/220x220/6366f1/ffffff?text=User'}
                />
              </div>
            </div>

            <div className="emp-header-info">
              <h1 className="emp-name">{getEmployeeName(employee)}</h1>

              <div className="emp-badges">
                <div className="emp-badge emp-badge-position">
                  <Briefcase size={18} />
                  <span>{getText(employee, 'position') || 'Lavozim'}</span>
                </div>

                {department && (
                  <div className="emp-badge emp-badge-dept">
                    <Building size={18} />
                    <span>{getText(department, 'title')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="emp-content">
            {/* Contact */}
            {(employee.email || employee.phone) && (
              <section className="emp-section">
                <h2 className="emp-section-title">
                  <div className="emp-section-icon emp-icon-mail">
                    <Mail size={20} />
                  </div>
                  {currentLang === 'uz' ? "Aloqa ma'lumotlari" : currentLang === 'ru' ? 'Контактная информация' : 'Contact Information'}
                </h2>

                <div className="emp-contact-grid">
                  {employee.email && (
                    <a href={`mailto:${employee.email}`} className="emp-contact-item">
                      <div className="emp-contact-icon emp-contact-icon-email">
                        <Mail size={20} />
                      </div>
                      <div>
                        <div className="emp-contact-label">Email</div>
                        <div className="emp-contact-value">{employee.email}</div>
                      </div>
                    </a>
                  )}

                  {employee.phone && (
                    <a href={`tel:${employee.phone}`} className="emp-contact-item">
                      <div className="emp-contact-icon emp-contact-icon-phone">
                        <Phone size={20} />
                      </div>
                      <div>
                        <div className="emp-contact-label">
                          {currentLang === 'uz' ? 'Telefon' : currentLang === 'ru' ? 'Телефон' : 'Phone'}
                        </div>
                        <div className="emp-contact-value">{employee.phone}</div>
                      </div>
                    </a>
                  )}
                </div>
              </section>
            )}

            {/* Bio */}
            {getText(employee, 'bio') && (
              <section className="emp-section">
                <h2 className="emp-section-title">
                  <div className="emp-section-icon emp-icon-award">
                    <Award size={20} />
                  </div>
                  {currentLang === 'uz' ? 'Biografiya' : currentLang === 'ru' ? 'Биография' : 'Biography'}
                </h2>
                <div className="emp-bio">
                  <p>{getText(employee, 'bio')}</p>
                </div>
              </section>
            )}

            {/* Academic Degree */}
            {employee.academicDegree && (
              <section className="emp-section">
                <h2 className="emp-section-title">
                  <div className="emp-section-icon emp-icon-graduation">
                    <GraduationCap size={20} />
                  </div>
                  {currentLang === 'uz' ? 'Ilmiy daraja' : currentLang === 'ru' ? 'Ученая степень' : 'Academic Degree'}
                </h2>
                <div className="emp-degree">
                  <p>{employee.academicDegree}</p>
                </div>
              </section>
            )}

            {/* Scientific Interests */}
            {Array.isArray(employee.scientificInterests) && employee.scientificInterests.length > 0 && (
              <section className="emp-section">
                <h2 className="emp-section-title">
                  <div className="emp-section-icon emp-icon-globe">
                    <Globe size={20} />
                  </div>
                  {currentLang === 'uz' ? 'Ilmiy qiziqishlar' : currentLang === 'ru' ? 'Научные интересы' : 'Scientific Interests'}
                </h2>
                <div className="emp-interests">
                  {employee.scientificInterests.map((interest, idx) => (
                    <div key={idx} className="emp-interest-item">
                      <div className="emp-interest-dot"></div>
                      <p>{interest}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;