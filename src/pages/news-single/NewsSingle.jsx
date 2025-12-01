import React, { useState, useEffect, useContext } from 'react';
import './style.css';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Context from '../../context/Context';
import Slider from 'react-slick'; // Import the slider component
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const NewsSinglePage = () => {
  const { id } = useParams();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const contextDatas = useContext(Context);
  const currentLang = contextDatas.currentLang;
  const [news, setNews] = useState();

  async function GetNews() {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/news/${id}`);
      setNews(data?.data);
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    GetNews();
  }, [id]);

  // Slider settings
 // Slider settings
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
  prevArrow: <div className="custom-prev-arrow"></div>, // Custom arrow
  nextArrow: <div className="custom-next-arrow"></div>, // Custom arrow
};


  return (
    <div className="news-single">
      <div className="news-content">
        {/* Title */}
        <h1>
          {currentLang === 'uz'
            ? news?.title_uz
            : currentLang === 'ru'
            ? news?.title_ru
            : news?.title_en}
        </h1>

        {/* Meta info */}
        <div className="news-meta">
          {/* <span>O'zbekiston</span> */}
          <span>{new Date(news?.createdAt).toLocaleDateString()}</span>
          {/* <span>8</span> */}
        </div>

        {/* Image Slider or Single Image */}
        {/* {news?.files && news.files.length > 0 ? ( */}
          <Slider {...sliderSettings}>
            {news?.files
              .filter((file) => file.type_file === 'image')
              .map((file, index) => (
                <div key={index}>
                  <img
                    className="news-image"
                    src={file.link}
                    alt={`news-image-${index}`}
                  />
                </div>
              ))}
          </Slider>
        {/* ) : (
          <img
            className="news-image"
            src="https://admin.ichlinks.uz/uploads/photo_2024_08_15_18_33_34_f3e19a1948.jpg"
            alt="Default image"
          />
        )} */}

        {/* YouTube iframe - Render if youtube_link exists */}
        {news?.youtube_link && (
          <iframe
            width="100%"
            height="250"
            src={news.youtube_link.replace('youtu.be', 'www.youtube.com/embed')}
            title={news[`title_${currentLang}`]}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        )}

        {/* Text content */}
        <p>
          {currentLang === 'uz'
            ? news?.text_uz
            : currentLang === 'ru'
            ? news?.text_ru
            : news?.text_en}
        </p>
      </div>

      {/* Recommendations section */}
      {/* <aside className="recommendations">
        <h2>Tavsiya etamiz</h2>
        <ul>
          <li>
            <span>2024-09-19</span>
            <p>Kulolchilik yo'nalishi o'rganildi</p>
          </li>
          <li>
            <span>2024-09-19</span>
            <p>Farg'ona viloyatiga ekspeditsiya</p>
          </li>
          <li>
            <span>2024-09-19</span>
            <p>Kulolchilik yo'nalishi o'rganildi</p>
          </li>
        </ul>
      </aside> */}
    </div>
  );
};

export default NewsSinglePage;
