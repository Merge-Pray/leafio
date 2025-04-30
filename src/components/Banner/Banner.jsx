import React, { useEffect, useState } from "react";
import styles from "./banner.module.css";

const banners = [
  "/assets/banner/banner1.png",
  "/assets/banner/Banner2.png",
  "/assets/banner/Banner3.png"
];

const Banner = () => {
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.bannerContainer}>
      <button className={styles.arrow} onClick={handlePrev}>&lt;</button>
      <img
        src={banners[current]}
        alt={`Banner ${current + 1}`}
        className={styles.bannerImage}
      />
      <button className={styles.arrow} onClick={handleNext}>&gt;</button>
    </div>
  );
};

export default Banner;