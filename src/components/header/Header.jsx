import React, { useContext, useState, useEffect, useRef } from "react";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Context from "../../context/Context";
import LogoImg from "../../assets/logo.png";
import uz from '../../assets/uz.png';
import ru from '../../assets/ru.png';
import en from '../../assets/en.png';
import "./style.css";

const Header = () => {
  const [t, i18n] = useTranslation("global");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dateTime, setDateTime] = useState(new Date());
  const [isScrolled, setIsScrolled] = useState(false);
  const contextDatas = useContext(Context);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const langRef = useRef(null);

  const languages = ["uz", "ru", "en"];
  const selectedLanguage = i18n.language;

  // Update date and time every second
  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
      if (langRef.current && !langRef.current.contains(e.target)) {
        setIsLanguageMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLangHandler = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("currentLang", lang);
    setIsLanguageMenuOpen(false);
    window.location.reload()
  };

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
  };

  const isActiveLink = (path) => location.pathname === path;

  // Menu structure for better maintainability
  const menuItems = [
    {
      id: "about",
      label: t("navbar.aboutUs.about"),
      items: [
        { to: "/activity", label: t("navbar.aboutUs.activities") },
        { to: "/structure", label: t("navbar.aboutUs.structure") },
        { to: "/leadership", label: t("navbar.aboutUs.leadership") },
        { to: "/departments", label: t("navbar.aboutUs.departments") },
        { to: "/charter", label: t("navbar.aboutUs.charter") },
        { to: "/jobs", label: t("navbar.aboutUs.jobs") }
      ]
    },
    {
      id: "nmm",
      label: "NMM",
      items: [
        { to: "/yunesko", label: t("navbar.nmm.yunesko") },
        { to: "/national", label: t("navbar.nmm.national") },
        { to: "/expedition", label: t("navbar.nmm.expedition") },
        { to: "/local-list", label: t("navbar.nmm.localList") }
      ]
    },
    {
      id: "news",
      label: t("navbar.news.news"),
      items: [
        { to: "/news", label: t("navbar.news.news") },
        { to: "/announcements", label: t("navbar.news.announcements") }
      ]
    },
    {
      id: "docs",
      label: t("navbar.docs"),
      to: "/docs"
    },
    {
      id: "openData",
      label: t("navbar.openData.openData"),
      items: [
        { to: "/internal-audit", label: t("navbar.openData.internalAudit") },
        { to: "/jobs", label: t("navbar.openData.jobs") }
      ]
    },
    {
      id: "library",
      label: t("navbar.library.library"),
      items: [
        { to: "/resources", label: t("navbar.library.resources") },
        { to: "/articles", label: t("navbar.library.articles") }
      ]
    },
    {
      id: "contact",
      label: t("navbar.aboutUs.contactUs"),
      to: "/contact"
    }
  ];

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        {/* Logo */}
        <Link to="/" className="logo">
          <img src={LogoImg} alt="Logo" className="logo-image" />
        </Link>

        {/* Desktop & Mobile Navigation */}
        <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <ul className="nav-list" ref={dropdownRef}>
            {menuItems.map((item) => (
              <li
                key={item.id}
                className={`nav-item ${item.items ? 'dropdown-parent' : ''} ${
                  openDropdown === item.id ? 'open' : ''
                }`}
              >
                {item.items ? (
                  <>
                    <span
                      className="nav-link"
                      onClick={() => toggleDropdown(item.id)}
                    >
                      {item.label}
                      <FaChevronDown
                        className={`dropdown-icon ${
                          openDropdown === item.id ? 'rotated' : ''
                        }`}
                      />
                    </span>
                    <ul className="dropdown-menu">
                      {item.items.map((subItem) => (
                        <li key={subItem.to}>
                          <Link
                            to={subItem.to}
                            onClick={handleLinkClick}
                            className={isActiveLink(subItem.to) ? 'active' : ''}
                          >
                            {subItem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    to={item.to}
                    className={`nav-link ${isActiveLink(item.to) ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Right Side Controls */}
          <div className="nav-controls">
            {/* Language Selector */}
            <div className="language-selector" ref={langRef}>
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
                <FaChevronDown
                  className={`dropdown-icon ${isLanguageMenuOpen ? 'rotated' : ''}`}
                />
              </button>
              <ul className={`language-menu ${isLanguageMenuOpen ? 'open' : ''}`}>
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
            </div>

            {/* Date Time Display */}
            <div className="datetime-display">
              <div className="date">{dateTime.toLocaleDateString()}</div>
              <div className="time">{dateTime.toLocaleTimeString()}</div>
            </div>
          </div>
        </nav>

        {/* Mobile Toggle Button */}
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