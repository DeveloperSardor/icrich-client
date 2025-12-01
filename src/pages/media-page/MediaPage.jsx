import React, { useState } from "react";
import "./style.css";

const MediaPage = () => {
  // Media items list with categories
  const mediaItems = [
    { id: 1, imgSrc: "https://admin.ichlinks.uz/uploads/photo_2024_08_15_18_33_37_1d6e630b36.jpg", category: "Fotogalereya", label: "1 ta rasm", date: "08.03.24 20:03", description: "Askiya – yashirin fikr sehri, hozirjavob xalqimizning noyob xazinasi" },
    { id: 2, imgSrc: "https://admin.ichlinks.uz/uploads/photo_2024_08_15_18_33_37_1d6e630b36.jpg", category: "Fotogalereya", label: "2 ta rasm", date: "08.03.24 20:03", description: "Askiya – yashirin fikr sehri, hozirjavob xalqimizning noyob xazinasi" },
    { id: 3, imgSrc: "https://admin.ichlinks.uz/uploads/photo_2024_08_15_18_33_37_1d6e630b36.jpg", category: "Audio", label: "1 ta audio", date: "08.03.24 20:03", description: "Askiya – audio xalqimizning noyob asari" },
    { id: 4, imgSrc: "https://admin.ichlinks.uz/uploads/onalar_allasi_81ce528467.jpg", category: "Video", label: "1 ta video", date: "08.03.24 20:03", description: "Askiya – video xalqimizning noyob xazinasi" },
    { id: 5, imgSrc: "https://admin.ichlinks.uz/uploads/photo_2024_08_15_18_33_37_1d6e630b36.jpg", category: "Fotogalereya", label: "1 ta rasm", date: "08.03.24 20:03", description: "Askiya – yashirin fikr sehri, hozirjavob xalqimizning noyob xazinasi" },
    { id: 6, imgSrc: "https://admin.ichlinks.uz/uploads/onalar_allasi_81ce528467.jpg", category: "Audio", label: "2 ta audio", date: "08.03.24 20:03", description: "Askiya – audio xalqimizning noyob asari" },
  ];

  // State for filtering
  const [selectedCategory, setSelectedCategory] = useState("Fotogalereya");

  // Filtered media items based on selected category
  const filteredItems = mediaItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="media-page">
      <h1 className="title">MEDIATEKА</h1>
      <div className="content">
        <div className="sidebar">
          <h2>Bo'limlar</h2>
          <ul>
            <li
              className={selectedCategory === "Fotogalereya" ? "active" : ""}
              onClick={() => setSelectedCategory("Fotogalereya")}
            >
              Fotogalereya
            </li>
            <li
              className={selectedCategory === "Audio" ? "active" : ""}
              onClick={() => setSelectedCategory("Audio")}
            >
              Audio
            </li>
            <li
              className={selectedCategory === "Video" ? "active" : ""}
              onClick={() => setSelectedCategory("Video")}
            >
              Video
            </li>
          </ul>
        </div>
        <div className="media-container">
          {filteredItems.map((item) => (
            <div key={item.id} className="media-item">
              <img src={item.imgSrc} alt={item.description} className="media-image" />
              <div className="media-overlay">
                <span className="media-label">{item.label}</span>
                <p className="media-date">{item.date}</p>
                <p className="media-description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaPage;
