import React from "react";
import "./style.css";
import { FaTelegramPlane, FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useTranslation } from "react-i18next";
import LogoImg from '../../assets/logo.png';

const Footer = () => {
  const [t, i18n] = useTranslation('global');
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img
            src={LogoImg}
            alt="Institute Logo"
          />
          <p>{t('address')}</p>
          <p>{t('index')}: 100011</p>
          <p className="email_">E-mail <MdEmail/> icrich@madaniyat.uz</p>
          <p className="exat_">E-xat <MdEmail/> icrich@exat.uz</p>
        </div>
        
        <div className="footer-links">
          <h4>{t('workdays_text')}</h4>
          <ul>
            <li>
              <p>{t('work_days')}</p>
              <p style={{ marginTop: "0.5em" }}>{t('lunchTime')} : 13:00-14:00</p>
            </li>
          </ul>
        </div>
        
        <div className="footer-social">
          <h4>{t('footer.socialMedias')}</h4>
          <div className="social-icons">
            <a href="https://t.me/icrichuzb" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
              <FaTelegramPlane />
            </a>
            <a href="https://www.instagram.com/icrichuzb/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://www.facebook.com/share/12AcBa8xGWy/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://www.youtube.com/@ICRICHuz" target="_blank" rel="noopener noreferrer" aria-label="Youtube">
              <FaYoutube/>
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} {t('footer.allrightsreserved')}.</p>
        <p className="developer-credit">
          {t('footer.developedBy') || 'Developed by'}{' '}
          <a 
            href="https://t.me/SardorDeveloper" 
            target="_blank" 
            rel="noopener noreferrer"
            className="developer-link"
          >
            SardorKarim
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;