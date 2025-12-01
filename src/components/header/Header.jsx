import React, { useContext, useState, useEffect } from "react";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import LogoImg from "../../assets/logo.png";
import { Link } from "react-router-dom";
import "./style.css";
import { useTranslation } from "react-i18next";
import Context from "../../context/Context";
import uz from '../../assets/uz.png';
import ru from '../../assets/ru.png';
import en from '../../assets/en.png';

const Header = () => {
  const [t, i18n] = useTranslation("global");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dateTime, setDateTime] = useState(new Date());
  const [isScrolled, setIsScrolled] = useState(false);
  const contextDatas = useContext(Context);
  const currentLang = contextDatas.currentLang;

  const languages = ["uz", "ru", "en"];
  const selectedLanguage = i18n.language;

  // Update date and time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLangHandler = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("currentLang", lang);
    setIsLanguageMenuOpen(false);
    location.reload();
  };

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        {/* Logo */}
        <Link to="/" className="logo">
          <div className="logo-container">
            <img src={LogoImg} alt="Logo" className="logo-image" />
         
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            {/* About Us Dropdown */}
            <li 
              className="nav-item dropdown-parent"
              onMouseEnter={() => toggleDropdown("about")}
              onMouseLeave={() => toggleDropdown(null)}
            >
              <span className="nav-link">
                {t("navbar.aboutUs.about")} 
                <FaChevronDown className={`dropdown-icon ${openDropdown === "about" ? 'rotated' : ''}`} />
              </span>
              {openDropdown === "about" && (
                <ul className="dropdown-menu">
                  <li><Link to="/activity" onClick={handleLinkClick}>{t("navbar.aboutUs.activities")}</Link></li>
                  <li><Link to="/structure" onClick={handleLinkClick}>{t("navbar.aboutUs.structure")}</Link></li>
                  <li><Link to="/leadership" onClick={handleLinkClick}>{t("navbar.aboutUs.leadership")}</Link></li>
                  <li><Link to="/departments" onClick={handleLinkClick}>{t("navbar.aboutUs.departments")}</Link></li>
                  <li><Link to="/charter" onClick={handleLinkClick}>{t("navbar.aboutUs.charter")}</Link></li>
                  <li><Link to="/jobs" onClick={handleLinkClick}>{t("navbar.aboutUs.jobs")}</Link></li>
                </ul>
              )}
            </li>

            {/* NMM Dropdown */}
            <li 
              className="nav-item dropdown-parent"
              onMouseEnter={() => toggleDropdown("nmm")}
              onMouseLeave={() => toggleDropdown(null)}
            >
              <span className="nav-link">
                NMM 
                <FaChevronDown className={`dropdown-icon ${openDropdown === "nmm" ? 'rotated' : ''}`} />
              </span>
              {openDropdown === "nmm" && (
                <ul className="dropdown-menu">
                  <li><Link to="/yunesko" onClick={handleLinkClick}>{t("navbar.nmm.yunesko")}</Link></li>
                  <li><Link to="/national" onClick={handleLinkClick}>{t("navbar.nmm.national")}</Link></li>
                  <li><Link to="/expedition" onClick={handleLinkClick}>{t("navbar.nmm.expedition")}</Link></li>
                  <li><Link to="/local-list" onClick={handleLinkClick}>{t("navbar.nmm.localList")}</Link></li>
                </ul>
              )}
            </li>

            {/* News Dropdown */}
            <li 
              className="nav-item dropdown-parent"
              onMouseEnter={() => toggleDropdown("news")}
              onMouseLeave={() => toggleDropdown(null)}
            >
              <span className="nav-link">
                {t("navbar.news.news")} 
                <FaChevronDown className={`dropdown-icon ${openDropdown === "news" ? 'rotated' : ''}`} />
              </span>
              {openDropdown === "news" && (
                <ul className="dropdown-menu">
                  <li><Link to="/news" onClick={handleLinkClick}>{t("navbar.news.news")}</Link></li>
                  <li><Link to="/announcements" onClick={handleLinkClick}>{t("navbar.news.announcements")}</Link></li>
                </ul>
              )}
            </li>

            {/* Documents */}
            <li className="nav-item">
              <Link to="/docs" className="nav-link" onClick={handleLinkClick}>
                {t("navbar.docs")}
              </Link>
            </li>

            {/* Open Data Dropdown */}
            <li 
              className="nav-item dropdown-parent"
              onMouseEnter={() => toggleDropdown("openData")}
              onMouseLeave={() => toggleDropdown(null)}
            >
              <span className="nav-link">
                {t("navbar.openData.openData")} 
                <FaChevronDown className={`dropdown-icon ${openDropdown === "openData" ? 'rotated' : ''}`} />
              </span>
              {openDropdown === "openData" && (
                <ul className="dropdown-menu">
                  <li><Link to="/internal-audit" onClick={handleLinkClick}>{t("navbar.openData.internalAudit")}</Link></li>
                  <li><Link to="/jobs" onClick={handleLinkClick}>{t("navbar.openData.jobs")}</Link></li>
                </ul>
              )}
            </li>

            {/* Library Dropdown */}
            <li 
              className="nav-item dropdown-parent"
              onMouseEnter={() => toggleDropdown("library")}
              onMouseLeave={() => toggleDropdown(null)}
            >
              <span className="nav-link">
                {t("navbar.library.library")} 
                <FaChevronDown className={`dropdown-icon ${openDropdown === "library" ? 'rotated' : ''}`} />
              </span>
              {openDropdown === "library" && (
                <ul className="dropdown-menu">
                  <li><Link to="/resources" onClick={handleLinkClick}>{t("navbar.library.resources")}</Link></li>
                  <li><Link to="/articles" onClick={handleLinkClick}>{t("navbar.library.articles")}</Link></li>
                </ul>
              )}
            </li>

            {/* Contact */}
            <li className="nav-item">
              <Link to="/contact" className="nav-link" onClick={handleLinkClick}>
                {t("navbar.aboutUs.contactUs")}
              </Link>
            </li>
          </ul>

          {/* Right Side Controls */}
          <div className="nav-controls">
            {/* Language Selector */}
            <div className="language-selector">
              <button
                className="language-btn"
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              >
                <img
                  src={selectedLanguage === 'uz' ? uz : selectedLanguage === 'ru' ? ru : en}
                  alt={selectedLanguage}
                  className="flag-img"
                />
                <span className="lang-code">{selectedLanguage.toUpperCase()}</span>
                <FaChevronDown className={`dropdown-icon ${isLanguageMenuOpen ? 'rotated' : ''}`} />
              </button>
              {isLanguageMenuOpen && (
                <ul className="language-menu">
                  {languages.map((lang) => (
                    <li
                      key={lang}
                      onClick={() => changeLangHandler(lang)}
                      className={selectedLanguage === lang ? 'active' : ''}
                    >
                      <img
                        src={lang === 'uz' ? uz : lang === 'ru' ? ru : en}
                        alt={lang}
                        className="flag-img"
                      />
                      <span>{lang.toUpperCase()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Date Time */}
            <div className="datetime-display">
              <div className="date">{dateTime.toLocaleDateString()}</div>
              <div className="time">{dateTime.toLocaleTimeString()}</div>
            </div>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="mobile-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
};

export default Header;