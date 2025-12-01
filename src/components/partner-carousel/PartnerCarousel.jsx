import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules"; // Autoplay moduli uchun to'g'ri import
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation"; // Swiper navigatsiyasi uchun

import "./style.css"; // CSS fayli
import { useTranslation } from "react-i18next";

const partners = [
  { name: "commeta", logo: "https://ichlinks.uz/images/partner4.png" },
  { name: "UIC Group", logo: "https://ichlinks.uz/images/partner1.png" },
  { name: "O'zbekiston Respublikasi Madaniyat vazirligi", logo: "https://ichlinks.uz/images/partner2.png" },
  { name: "sharh", logo: "https://ichlinks.uz/images/partner3.png" }
];

const PartnersSlider = () => {
  const [t, i18n] = useTranslation('global')
  return (
    <div className="partners-slider">
      <h2>{t('partners')}</h2>
      <Swiper
        spaceBetween={30}
        slidesPerView={4} // Har safar 4ta karta ko'rsatiladi
        loop={true} // Slayder cheksiz aylanadi
        autoplay={{
          delay: 3000, // Slayder 3 soniyada bitta slaydni o'zgartiradi
          disableOnInteraction: false, // Foydalanuvchi o'zaro ta'sirda ham davom etadi
        }}
        modules={[Autoplay]}
        breakpoints={{
          320: { slidesPerView: 1 }, // Mobil qurilmalar
          768: { slidesPerView: 2 }, // Planshetlar
          1024: { slidesPerView: 4 }, // Laptop va kattaroq ekranlar
        }}
      >
        {partners.map((partner, index) => (
          <SwiperSlide key={index}>
            <div className="partner-card">
              <img src={partner.logo} alt={`${partner.name} logo`} />
              <p>{partner.name}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PartnersSlider;
