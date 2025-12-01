import React, { useState } from "react";
import "./style.css";

const craftsData = [
  {
    id: 1,
    title: "Margilan Crafts Development Center",
    description: "Preserving traditional technology of atlas- and adras-making.",
    image: "https://admin.ichlinks.uz/uploads/mcdc_medium_1_f52476b2b2.jpg", // Replace with actual paths
  },
  {
    id: 2,
    title: "Margilan Crafts Development Center",
    description: "Preserving traditional technology of atlas- and adras-making.",
    image: "https://admin.ichlinks.uz/uploads/mcdc_medium_1_f52476b2b2.jpg",
  },
  {
    id: 3,
    title: "Margilan Crafts Development Center",
    description: "Preserving traditional technology of atlas- and adras-making.",
    image: "https://admin.ichlinks.uz/uploads/mcdc_medium_1_f52476b2b2.jpg",
  },
 
  // Add more data as needed
];

const filters = [
  { category: "Askiyachilar", options: ["Barchasi", "Vafot etganlar", "Yangi askiyachilar"] },
  { category: "Askiyachilar", options: ["Qiziqchi", "Aktyor", "Baxshi", "So'z ustasi"] },
];

const Nmm = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleFilterChange = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((item) => item !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="crafts-page">
      <div className="content">
  
        <aside className="filters">
          <h2>Filtr</h2>
          {filters.map((filterGroup, index) => (
            <div key={index} className="filter-group">
              <h3>{filterGroup.category}</h3>
              {filterGroup.options.map((option, idx) => (
                <label key={idx} className="filter-option">
                  <input
                    type="checkbox"
                    value={option}
                    checked={selectedFilters.includes(option)}
                    onChange={() => handleFilterChange(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
        </aside>
        <main className="grid">
          {craftsData.map((craft) => (
            <div key={craft.id} className="card">
              <img src={craft.image} alt={craft.title} className="card-image" />
              <div className="card-content">
                <h3>{craft.title}</h3>
                <p>{craft.description}</p>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default Nmm;
