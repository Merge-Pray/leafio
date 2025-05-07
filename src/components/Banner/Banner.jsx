import React, { useEffect, useState } from "react";
import styles from "./banner.module.css";

const banners = [
  {
    image: "/assets/banner/banner1.png",
    leftText: "PLANT SHARING",
    rightText: "& GIFTING"
  },
  {
    image: "/assets/banner/banner2.png",
    leftText: "GROW TOGETHER",
    rightText: "GIVE WITH HEART"
  },
  {
    image: "/assets/banner/banner3.png",
    leftText: "GREEN FRIENDS",
    rightText: "BIG IMPACT"
  },
  {
    image: "/assets/banner/banner4.png",
    leftText: "GROW PLANTS",
    rightText: "GROW CONNECTIONS"
  },
  {
    image: "/assets/banner/banner5.png",
    leftText: "PLANTS NEED",
    rightText: "PEOPLE TOO"
  }
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
    }, 11000);
    return () => clearInterval(interval);
  }, []);

  return (
<div className={styles.bannerContainer}>
  <div
    className={styles.slider}
    style={{ transform: `translateX(-${current * 100}%)` }}
  >
    {banners.map((banner, index) => (
      <div className={styles.slide} key={index}>
        <img src={banner.image} alt={`Banner ${index + 1}`} />
        <div className={styles.textOverlay} key={current}>
  <div className={styles.leftText}>
    {banner.leftText}
  </div>
  <div className={styles.rightText}>
    {banner.rightText}
  </div>
        </div>
      </div>
    ))}
  </div>

  <button className={styles.arrow} onClick={handlePrev}>&lt;</button>
  <button className={styles.arrow} onClick={handleNext}>&gt;</button>
</div>
  );
};

export default Banner;