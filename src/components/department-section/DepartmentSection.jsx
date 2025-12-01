import React, { useState, useEffect, useContext } from 'react';
import { X, Mail, Phone, Users, Building2, Briefcase } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Context from '../../context/Context';
import './departments-employees.css';

const DepartmentsWithEmployees = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const contextDatas = useContext(Context);
  const currentLang = contextDatas.currentLang;

  const [departments, setDepartments] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BACKEND_URL}/api/department`);
      console.log('Departments data:', data.data); // Debug uchun
      setDepartments(data.data || []);
    } catch (error) {
      toast.error('Bo\'limlarni yuklashda xatolik');
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEmployeeModal = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
    document.body.style.overflow = 'auto';
  };

  // Helper function to get text by language
  const getText = (item, field) => {
    if (!item) return '';
    
    // Try different possible formats
    if (item[field] && typeof item[field] === 'object') {
      return item[field][currentLang] || item[field].uz || item[field].en || '';
    }
    
    // Try format like title_uz, title_ru
    const fieldWithLang = `${field}_${currentLang}`;
    if (item[fieldWithLang]) {
      return item[fieldWithLang];
    }
    
    // Fallback
    return item[field] || '';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="departments-employees-page">
      <div className="container">
        <h1 className="page-title">
          <Building2 size={32} />
          Bo'limlar va Xodimlar
        </h1>

        {departments.length === 0 ? (
          <div className="no-data">
            <Users size={64} />
            <p>Bo'limlar topilmadi</p>
          </div>
        ) : (
          <div className="departments-list">
            {departments.map((department) => {
              const deptTitle = getText(department, 'title');
              const deptDesc = getText(department, 'description');
              const employeesList = department.employees || [];

              return (
                <div key={department._id} className="department-card">
                  {/* CHAP TOMON - Bo'lim ma'lumotlari */}
                  <div className="department-left">
                    <div className="department-image">
                      <img 
                        src={department.img || '/placeholder-dept.jpg'} 
                        alt={deptTitle || 'Department'}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/220x220/667eea/ffffff?text=Department';
                        }}
                      />
                    </div>
                    <div className="department-info">
                      <h2 className="department-name">
                        {deptTitle || 'Noma\'lum bo\'lim'}
                      </h2>
                      {deptDesc && (
                        <p className="department-description">
                          {deptDesc}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* O'NG TOMON - Xodimlar ro'yxati */}
                  <div className="department-right">
                    <div className="employees-header">
                      <Users size={20} />
                      <span>Xodimlar ({employeesList.length})</span>
                    </div>
                    
                    {employeesList.length > 0 ? (
                      <div className="employees-list">
                        {employeesList.map((employee) => {
                          const empPosition = getText(employee, 'position');
                          
                          return (
                            <div 
                              key={employee._id} 
                              className="employee-item"
                              onClick={() => openEmployeeModal(employee)}
                              role="button"
                              tabIndex={0}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') openEmployeeModal(employee);
                              }}
                            >
                              <div className="employee-avatar-small">
                                <img 
                                  src={employee.img || '/placeholder-avatar.jpg'} 
                                  alt={employee.name || 'Employee'}
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/65x65/6366f1/ffffff?text=User';
                                  }}
                                />
                              </div>
                              <div className="employee-text">
                                <span className="employee-name-small">
                                  {employee.name || 'Noma\'lum'}
                                </span>
                                <span className="employee-position-small">
                                  {empPosition || 'Lavozim'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="no-employees">
                        <Users size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                        <p>Xodimlar mavjud emas</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MODAL - Xodim tafsilotlari */}
        {isModalOpen && selectedEmployee && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button 
                className="modal-close" 
                onClick={closeModal}
                aria-label="Close modal"
              >
                <X size={24} />
              </button>

              <div className="modal-header">
                <div className="modal-avatar">
                  <img 
                    src={selectedEmployee.img || '/placeholder-avatar.jpg'} 
                    alt={selectedEmployee.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150x150/6366f1/ffffff?text=User';
                    }}
                  />
                </div>
                <div className="modal-title-section">
                  <h2>{selectedEmployee.name || 'Noma\'lum'}</h2>
                  <p className="modal-position">
                    <Briefcase size={18} />
                    {getText(selectedEmployee, 'position') || 'Lavozim'}
                  </p>
                </div>
              </div>

              <div className="modal-body">
                {/* Biografiya */}
                {getText(selectedEmployee, 'bio') && (
                  <div className="modal-section">
                    <h3>📝 Biografiya</h3>
                    <p>{getText(selectedEmployee, 'bio')}</p>
                  </div>
                )}

                {/* Aloqa ma'lumotlari */}
                {(selectedEmployee.email || selectedEmployee.phone) && (
                  <div className="modal-section">
                    <h3>📞 Aloqa ma'lumotlari</h3>
                    <div className="contact-info">
                      {selectedEmployee.email && (
                        <div className="contact-item">
                          <Mail size={22} />
                          <div>
                            <span className="contact-label">Email</span>
                            <a href={`mailto:${selectedEmployee.email}`}>
                              {selectedEmployee.email}
                            </a>
                          </div>
                        </div>
                      )}
                      {selectedEmployee.phone && (
                        <div className="contact-item">
                          <Phone size={22} />
                          <div>
                            <span className="contact-label">Telefon</span>
                            <a href={`tel:${selectedEmployee.phone}`}>
                              {selectedEmployee.phone}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Ta'lim */}
                {getText(selectedEmployee, 'education') && (
                  <div className="modal-section">
                    <h3>🎓 Ta'lim</h3>
                    <p>{getText(selectedEmployee, 'education')}</p>
                  </div>
                )}

                {/* Ish tajribasi */}
                {getText(selectedEmployee, 'experience') && (
                  <div className="modal-section">
                    <h3>💼 Ish tajribasi</h3>
                    <p>{getText(selectedEmployee, 'experience')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentsWithEmployees;