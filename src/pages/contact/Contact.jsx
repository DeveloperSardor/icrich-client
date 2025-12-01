import React, { useState } from "react";
import { MdEmail, MdGroupWork, MdWork } from "react-icons/md";
import axios from 'axios';  // Import axios for making API requests
import "./style.css";
import { useTranslation } from "react-i18next";
import { FaLocationArrow } from "react-icons/fa";
import toast from "react-hot-toast";

const ContactForm = () => {
  const [t, i18n] = useTranslation('global');
  
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  // State to handle form inputs
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  // State for handling form submission status
  const [statusMessage, setStatusMessage] = useState(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent default form submission

    try {
      const response = await axios.post(`${BACKEND_URL}/api/contact`, formData); // API request
      if (response.data.success) {
        toast.success("Muvoffaqiyatli jo'natildi");
        
        // Reset form data after successful submission
        setFormData({
          name: '',
          phone: '',
          message: ''
        });

        // setStatusMessage({ type: 'success', message: 'Xabar muvaffaqiyatli yuborildi!' });
      } else {
        toast.error("Xabar yuborishda xato yuz berdi!");
        setStatusMessage({ type: 'error', message: 'Xabar yuborishda xato yuz berdi!' });
      }
    } catch (error) {
      setStatusMessage({ type: 'error', message: 'Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.' });
    }
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-container">
        <div className="form-section">
          <h2>{t('navbar.aboutUs.contactUs')}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              {t('fullname')}
              <input
                type="text"
                name="name"
                placeholder={t('enterYourFullName')}
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              {t('phoneNumber')}
              <input
                type="tel"
                name="phone"
                placeholder="+998 ..."
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
             {t('enterMessage')}
              <textarea
                name="message"
                placeholder={t('enterYourMessage')}
                value={formData.message}
                onChange={handleInputChange}
                required
              />
            </label>
            <button type="submit">{t('submit')}</button>
          </form>
          {statusMessage && (
            <div className={`status-message ${statusMessage.type}`}>
              {statusMessage.message}
            </div>
          )}
        </div>
        <div className="map-section">
          <iframe
            src="https://yandex.uz/map-widget/v1/-/CHQrFz4nT"
            width="100%"
            height="500px"
            frameBorder="0"
            title="Yandex Map"
            style={{ border: 0, margin : "0 auto" }}
            allowFullScreen
          ></iframe>
          <div className="contact-info">
            <p className="email_">E-mail <MdEmail/> icrich@madaniyat.uz</p>
            <p className="exat_">E-xat <MdEmail/> icrich@exat.uz</p>
            <p style={{ marginTop : '1.2em', marginLeft : "0.3em" }}>{t('address')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
