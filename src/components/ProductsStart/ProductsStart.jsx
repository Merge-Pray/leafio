// src/components/ProductStart.jsx

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import styles from "./productstart.module.css";
import { Link } from "react-router-dom";

const ProductStart = () => {
  const [ads, setAds] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const allAdsCollection = collection(db, "allads");
        const adsQuery = query(allAdsCollection, orderBy("createdAt", "desc"), limit(8));
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
      {/* <h2 className={styles.heading}>Unsere neuesten Pflanzen</h2> */}
      <div className={styles.productGrid}>
        {ads.map((ad) => (
         <Link to={`/produkt/${ad.id}`} key={ad.id} className={styles.cardLink}>
         <div className={styles.productCard}>
           <div className={styles.imageWrapper}>
             <img src={ad.images?.[0]} alt={ad.title} />
             <div className={styles.priceOverlay}>{ad.price}</div>
           </div>
           <div className={styles.productCardContent}>
             <h3>{ad.title}</h3>
             <div className={styles.productLocation}>{ad.location?.city}</div>
             <div className={styles.productDescription}>
               {ad.description?.slice(0, 70)}...
             </div>
             <p className={styles.createdAt}>Online seit:</p>
             <div className={styles.createdAt}>
               {ad.createdAt?.toDate().toLocaleDateString("de-DE", {
                 day: "2-digit",
                 month: "long",
                 year: "numeric",
               })}
             </div>
           </div>
         </div>
       </Link>
        ))}
      </div>
    </section>
  );
};

export default ProductStart;