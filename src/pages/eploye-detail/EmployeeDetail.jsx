import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Context from '../../context/Context';
import './employee-detail.css';
import { ArrowLeft } from 'lucide-react';

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
  }, [id, currentLang]);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BACKEND_URL}/api/leadership/${id}`);
      setEmployee(data.data);
      
      if (data.data.departmentId) {
        if (typeof data.data.departmentId === 'object') {
          setDepartment(data.data.departmentId);
        } else {
          const deptResponse = await axios.get(`${BACKEND_URL}/api/department/${data.data.departmentId}`);
          setDepartment(deptResponse.data.data);
        }
      }
    } catch (error) {
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
    if (!emp) return '';
    if (emp.name && typeof emp.name === 'object') {
      return emp.name[currentLang] || emp.name.uz || emp.name.ru || emp.name.en || '';
    }
    return emp.name || '';
  };

  const getLabel = (key) => {
    const labels = {
      position: { uz: 'Lavozim:', ru: 'Должность:', en: 'Position:' },
      department: { uz: 'Bo\'lim:', ru: 'Отдел:', en: 'Department:' },
      birthDate: { uz: 'Tug\'ilgan sanasi:', ru: 'Дата рождения:', en: 'Date of Birth:' },
      birthPlace: { uz: 'Tug\'ilgan joyi:', ru: 'Место рождения:', en: 'Place of Birth:' },
      education: { uz: 'Ta\'lim:', ru: 'Образование:', en: 'Education:' },
      workHistory: { uz: 'Mehnat faoliyati:', ru: 'Трудовая деятельность:', en: 'Work History:' },
      degree: { uz: 'Ilmiy daraja:', ru: 'Ученая степень:', en: 'Academic Degree:' },
      interests: { uz: 'Ilmiy qiziqishlar:', ru: 'Область интересов:', en: 'Research Interests:' },
      research: { uz: 'Tadqiqotlar:', ru: 'Полевые исследования:', en: 'Field Research:' },
      membership: { uz: 'A\'zolik:', ru: 'Членство в обществах:', en: 'Memberships:' },
      awards: { uz: 'Mukofotlar:', ru: 'Награды:', en: 'Awards:' },
      contact: { uz: 'Aloqa:', ru: 'Контакты:', en: 'Contact:' },
      email: { uz: 'Email:', ru: 'Email:', en: 'Email:' },
      phone: { uz: 'Telefon:', ru: 'Телефон:', en: 'Phone:' },
      back: { uz: 'Orqaga', ru: 'Назад', en: 'Back' },
      loading: { uz: 'Yuklanmoqda...', ru: 'Загрузка...', en: 'Loading...' },
      notFound: { uz: 'Xodim topilmadi', ru: 'Сотрудник не найден', en: 'Employee not found' }
    };
    return labels[key]?.[currentLang] || labels[key]?.uz || '';
  };

  if (loading) {
    return (
      <div className="emp-loading">
        <div className="emp-spinner"></div>
        <p>{getLabel('loading')}</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="emp-loading">
        <p>{getLabel('notFound')}</p>
        <button onClick={() => navigate(-1)} className="emp-btn-back">
          {getLabel('back')}
        </button>
      </div>
    );
  }

  return (
    <div className="emp-page">
      <div className="emp-wrapper">
        
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="emp-nav-back">
          <ArrowLeft size={16} />
          <span>{getLabel('back')}</span>
        </button>

        {/* Main Content */}
        <div className="emp-content-box">
          
          {/* Name Title */}
          <h1 className="emp-title">{getEmployeeName(employee).toUpperCase()}</h1>

          {/* Layout: Photo + Content */}
          <div className="emp-layout">
            
            {/* Photo */}
            <div className="emp-photo-box">
              <img
                src={employee.img || 'https://via.placeholder.com/220x280/cccccc/333333?text=Photo'}
                alt={getEmployeeName(employee)}
                onError={(e) => e.target.src = 'https://via.placeholder.com/220x280/cccccc/333333?text=Photo'}
              />
            </div>

            {/* Text Content */}
            <div className="emp-text-content">
              
              {/* Position & Department */}
              {getText(employee, 'position') && (
                <p className="emp-paragraph">
                  {getText(employee, 'position')}
                  {department && `, ${getText(department, 'title')}`}
                </p>
              )}

              {/* Academic Degree */}
              {employee.academicDegree && (
                <p className="emp-paragraph">
                  <strong>{getLabel('degree')}</strong> {employee.academicDegree}
                </p>
              )}

              {/* Bio (React Quill HTML) */}
              {getText(employee, 'bio') && (
                <div className="emp-bio">
                  <div dangerouslySetInnerHTML={{ __html: getText(employee, 'bio') }} />
                </div>
              )}

              {/* Education (React Quill HTML) */}
              {getText(employee, 'education') && (
                <div className="emp-section">
                  <h2 className="emp-section-heading">{getLabel('education')}</h2>
                  <div 
                    className="emp-section-content"
                    dangerouslySetInnerHTML={{ __html: getText(employee, 'education') }}
                  />
                </div>
              )}

              {/* Work History */}
              {Array.isArray(employee.workHistory) && employee.workHistory.length > 0 && (
                <div className="emp-section">
                  <h2 className="emp-section-heading">{getLabel('workHistory')}</h2>
                  {employee.workHistory.map((work, idx) => {
                    const workText = getText({ text: work }, 'text');
                    return (
                      <div 
                        key={idx} 
                        className="emp-section-content"
                        dangerouslySetInnerHTML={{ __html: workText }}
                      />
                    );
                  })}
                </div>
              )}

              {/* Research Interests */}
              {Array.isArray(employee.scientificInterests) && employee.scientificInterests.length > 0 && (
                <div className="emp-section">
                  <h2 className="emp-section-heading">{getLabel('interests')}</h2>
                  <p className="emp-paragraph">
                    {employee.scientificInterests.join(', ')}
                  </p>
                </div>
              )}

              {/* Awards */}
              {Array.isArray(employee.awards) && employee.awards.length > 0 && (
                <div className="emp-section">
                  <h2 className="emp-section-heading">{getLabel('awards')}</h2>
                  {employee.awards.map((award, idx) => {
                    const awardText = getText({ text: award }, 'text');
                    return (
                      <div 
                        key={idx} 
                        className="emp-section-content"
                        dangerouslySetInnerHTML={{ __html: awardText }}
                      />
                    );
                  })}
                </div>
              )}

              {/* Contact */}
              {(employee.email || employee.phone) && (
                <div className="emp-section">
                  <h2 className="emp-section-heading">{getLabel('contact')}</h2>
                  {employee.email && (
                    <p className="emp-paragraph">
                      <strong>{getLabel('email')}</strong> {employee.email}
                    </p>
                  )}
                  {employee.phone && (
                    <p className="emp-paragraph">
                      <strong>{getLabel('phone')}</strong> {employee.phone}
                    </p>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;