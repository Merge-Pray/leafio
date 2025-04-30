import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import styles from "./productstart.module.css"; // wichtig: `styles` statt direkt string

const ProductStart = () => {
  const [ads, setAds] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const allAdsCollection = collection(db, "allads");
        const adsQuery = query(allAdsCollection, orderBy("createdAt", "desc"), limit(6));
        const querySnapshot = await getDocs(adsQuery);
        const adsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAds(adsData);
      } catch (error) {
        console.error("Error fetching ads:", error);
        setError("Fehler beim Laden der Produkte.");
      }
    };

    fetchAds();
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <section className={styles.productSection}>
      <h2>Unsere neuesten Pflanzen</h2>
      <div className={styles.productGrid}>
        {ads.map((ad) => (
          <div className={styles.productCard} key={ad.id}>
            <img src={ad.images?.[0]} alt={ad.title} />
            <div className={styles.productCardContent}>
              <h3>{ad.title}</h3>
              <div className={styles.productPrice}>{ad.price}</div>
              <div className={styles.productLocation}>{ad.location?.city}</div>
              <div className={styles.productDescription}>
                {ad.description?.slice(0, 60)}...
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductStart;