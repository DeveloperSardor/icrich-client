import React, { useEffect, useState } from "react";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Center from "./pages/center/Center";
import MediaPage from "./pages/media-page/MediaPage";
import News from "./pages/news/News";
import NewsSingle from "./pages/news-single/NewsSingle";
import Nmm from "./pages/nmm/Nmm";
import Activity from "./pages/activity-page/ActivityPage";
import Contact from "./pages/contact/Contact";
import Structure from "./pages/structure/Structure";
import Leadership from "./pages/leadership/Leadership";
import Departments from "./pages/departments/Departments";
import Charter from "./pages/charter/Charter";
import JobVacancies from "./pages/jobs/Jobs";
import NationalPage from "./pages/national-page/NationalPage";
import ExpeditionPage from "./pages/expedition/ExpeditionPage";
import DocsPage from "./pages/docs-page/Docs";
import UsefulContents from "./pages/useful-contents/UsefulContent";
import ScientificArticles from "./pages/articles/Articles";
import Announcements from "./pages/announcement/Announcement";
import AnnouncementSingle from "./pages/announcement-single/AnnouncementSingle";
import { Toaster } from "react-hot-toast";
import Context from "./context/Context";
import { useTranslation } from "react-i18next";
import YuneskoPage from "./pages/yunesko/Yunesko";
import LocalList from "./pages/local-list/LocalList";
import SingleArticle from "./pages/article-single/ArticleSingle";
import InternalAudit from "./pages/internal-audit/InternalAudit";
// import DepartmentDetail from "./pages/department-detail/DepartmentDetail";
import EmployeeDetail from "./pages/eploye-detail/EmployeeDetail";

const App = () => {
  const { t, i18n } = useTranslation("global");
  
  const getInitialLang = () => localStorage.getItem("currentLang") || "uz";
  const [currentLang, setCurrentLang] = useState(getInitialLang);

  useEffect(() => {
    i18n.changeLanguage(currentLang);
  }, [currentLang, i18n]);

  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setCurrentLang(lang);
    localStorage.setItem("currentLang", lang);
  };

  return (
    <Context.Provider value={{ currentLang, handleChangeLanguage }}>
      <Toaster />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/center" element={<Center />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/structure" element={<Structure />} />
        <Route path="/leadership" element={<Leadership />} />
        <Route path="/departments" element={<Departments />} />
        {/* <Route path="/departments/:id" element={<DepartmentDetail />} /> */}
        <Route path="/employees/:id" element={<EmployeeDetail />} />
        <Route path="/charter" element={<Charter />} />
        <Route path="/jobs" element={<JobVacancies />} />
        <Route path="/national" element={<NationalPage />} />
        <Route path="/expedition" element={<ExpeditionPage />} />
        <Route path="/yunesko" element={<YuneskoPage />} />
        <Route path="/local-list" element={<LocalList />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/resources" element={<UsefulContents />} />
        <Route path="/articles" element={<ScientificArticles />} />
        <Route path="/internal-audit" element={<InternalAudit />} />
        <Route path="/articles/:id" element={<SingleArticle />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/announcements/:id" element={<AnnouncementSingle />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/news" element={<News />} />
        <Route path="/nmm" element={<Nmm />} />
        <Route path="/news/:id" element={<NewsSingle />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </Context.Provider>
  );
};

export default App;