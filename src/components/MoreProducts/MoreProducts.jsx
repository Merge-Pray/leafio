import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import styles from "./moreProducts.module.css"; 
import { NavLink } from "react-router";

const MoreProducts = () => {
  const [ads, setAds] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRandomAds = async () => {
      try {
        const allAdsCollection = collection(db, "allads");
        const querySnapshot = await getDocs(allAdsCollection);
        const allAds = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // 🔀 Zufällig mischen und 4 nehmen
        const shuffled = allAds.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 4);

        setAds(selected);
      } catch (error) {
        console.error("Error fetching random ads:", error);
        setError("Fehler beim Laden der Empfehlungen.");
      }
    };

    fetchRandomAds();
  }, []);

  if (error) return <div>{error}</div>;
  if (ads.length === 0) return null;

  return (
    <section className={styles.productSection}>
      <h3 className={styles.heading}>Weitere interessante Produkte</h3>
      <div className={styles.productGrid}>
        {ads.map((ad) => (
          <NavLink
            to={`/product/${ad.id}`}
            key={ad.id}
            className={styles.cardLink}
          >
            <div className={styles.productCard}>
              <div className={styles.imageWrapper}>
                <img src={ad.images?.[0]} alt={ad.title} />
                <div className={styles.priceOverlay}>{ad.price}</div>
              </div>
              <div className={styles.productCardContent}>
                <h3>{ad.title}</h3>
                <div className={styles.productLocation}>
                  {ad.location?.city}
                </div>
                <div className={styles.productDescription}>
                  {ad.description?.slice(0, 70)}...
                </div>
                <p className={styles.createdAt}>Online seit:</p>
                <div className={styles.createdAt}>
                  {ad.createdAt?.toDate?.().toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          </NavLink>
        ))}
      </div>
    </section>
  );
};

export default MoreProducts;