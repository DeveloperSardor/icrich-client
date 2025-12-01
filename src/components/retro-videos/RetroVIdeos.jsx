import React from "react";
import "./style.css";

const videos = [
  {
    date: "2024-11-09",
    title: "Alla elementi Lutfixonim Sarimsoqova ijrosida",
    thumbnail: "https://admin.ichlinks.uz/uploads/onalar_allasi_81ce528467.jpg",
  },
  {
    date: "2024-10-16",
    title: "Alla elementi Lutfixonim Sarimsoqova ijrosida",
    thumbnail: "https://ichlinks.uz/images/video-overlay.png",
  },
  {
    date: "2024-09-19",
    title: "Alla elementi Lutfixonim Sarimsoqova ijrosida",
    thumbnail: "https://ichlinks.uz/images/video-overlay.png",
  },
  {
    date: "2024-10-31",
    title: "Alla elementi Lutfixonim Sarimsoqova ijrosida",
    thumbnail: "https://ichlinks.uz/images/video-overlay.png",
  },
];

const RetroVideos = () => {
  return (
    <section className="retro-videos">
      <h2 className="section-title">Retro Videolar</h2>
      <div className="retro-videos-container">
        <div className="main-video">
          <img src={videos[0].thumbnail} alt={videos[0].title} className="main-thumbnail" />
          <div className="main-video-info">
            <span className="video-date">{videos[0].date}</span>
            <h3 className="video-title">{videos[0].title}</h3>
          </div>
          <button className="play-button">▶</button>
        </div>
        <div className="video-list">
          {videos.slice(1).map((video, index) => (
            <div key={index} className="video-item">
              <img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
              <div className="video-info">
                <span className="video-date">{video.date}</span>
                <p className="video-title">{video.title}</p>
              </div>
              <button className="play-button">▶</button>
            </div>
          ))}
      <button className="view-all-button">Barcha videolar</button>
        </div>
      </div>
    </section>
  );
};

export default RetroVideos;
