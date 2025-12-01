import React from "react";

const AudioSection = () => {
  const audios = [
    {
      id: 1,
      date: "2024-09-19",
      title: "Gulbahor Erqulova - Alla",
      imageUrl:
        "https://admin.ichlinks.uz/uploads/photo_2024_08_16_12_54_21_e571edebf0.jpg", // Replace with actual image URLs
    },
    {
      id: 2,
      date: "2024-09-19",
      title: "Gulbahor Erqulova - Alla",
      imageUrl:
        "https://admin.ichlinks.uz/uploads/onalar_allasi_81ce528467.jpg",
    },
    {
      id: 3,
      date: "2024-09-19",
      title: "Gulbahor Erqulova - Alla",
      imageUrl:
        "https://admin.ichlinks.uz/uploads/photo_2024_08_15_18_33_34_f3e19a1948.jpg",
    },
    {
      id: 4,
      date: "2024-09-19",
      title: "Gulbahor Erqulova - Alla",
      imageUrl:
        "https://admin.ichlinks.uz/uploads/photo_2024_08_15_18_33_37_1d6e630b36.jpg",
    },
  ];

  return (
    <section style={styles.audioSection}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Audio</h2>
        <a href="/all-audios" style={styles.link}>
          Barcha audiyalar →
        </a>
      </div>

      {/* Audio Grid */}
      <div style={styles.audioGrid}>
        {audios.map((audio) => (
          <div key={audio.id} style={styles.audioCard}>
            <img src={audio.imageUrl} alt={audio.title} style={styles.image} />
            <div style={styles.audioContent}>
              <button style={styles.playButton}>
                <i className="fas fa-play"></i>
              </button>
              <div style={styles.progressBar}></div>
              <span style={styles.duration}>0:00</span>
            </div>
            <div style={styles.audioInfo}>
              <span style={styles.date}>{audio.date}</span>
              <p style={styles.audioTitle}>{audio.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const styles = {
  audioSection: {
    padding: "20px 4em",
    backgroundColor: "#000",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "14px",
    marginBottom: "10px",
  },
  audioGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },
  audioCard: {
    backgroundColor: "#1c1c1c",
    borderRadius: "10px",
    overflow: "hidden",
    textAlign: "center",
    transition: "transform 0.3s",
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
  },
  audioContent: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
  },
  playButton: {
    background: "none",
    border: "none",
    color: "#ffb600",
    fontSize: "20px",
    marginRight: "10px",
    cursor: "pointer",
  },
  progressBar: {
    flexGrow: 1,
    height: "4px",
    backgroundColor: "#555",
    borderRadius: "2px",
    marginRight: "10px",
  },
  duration: {
    fontSize: "12px",
  },
  audioInfo: {
    padding: "10px",
  },
  date: {
    display: "block",
    fontSize: "12px",
    marginBottom: "5px",
    color: "#aaa",
  },
  audioTitle: {
    fontSize: "14px",
    color: "#fff",
  },
};

export default AudioSection;
