import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import styles from "./ProductPage.module.css";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [shared, setShared] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeDisabled, setLikeDisabled] = useState(false);
  const [mapLat, setMapLat] = useState(null);
  const [mapLon, setMapLon] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "allads", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setError("Produkt nicht gefunden.");
          setLoading(false);
          return;
        }

        const data = docSnap.data();
        const newViews = (data.views || 0) + 1;

        await updateDoc(docRef, { views: newViews });

        setProduct({ id: docSnap.id, ...data, views: newViews });

        // 🔍 PLZ → Koordinaten
        if (data.location?.zip) {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?postalcode=${data.location.zip}&country=Germany&format=json`
          );
          const geoData = await res.json();
          if (geoData.length > 0) {
            setMapLat(geoData[0].lat);
            setMapLon(geoData[0].lon);
          }
        }
      } catch (err) {
        console.error("Fehler beim Laden:", err);
        setError("Fehler beim Laden des Produkts.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const handleLike = async () => {
    if (!product || likeDisabled) return;

    const docRef = doc(db, "allads", product.id);
    const newLikes = (product.likes || 0) + 1;

    try {
      await updateDoc(docRef, { likes: newLikes });
      setProduct({ ...product, likes: newLikes });
      setLiked(true);
      setLikeDisabled(true);
    } catch (err) {
      console.error("Fehler beim Liken:", err);
    }
  };

  if (loading) return <div className={styles.status}>Lade Produkt...</div>;
  if (error) return <div className={styles.status}>{error}</div>;

  return (
    <section className={styles.productPage}>
      <div className={styles.imageSection}>
        <img
          src={product.images?.[0]}
          alt={product.title}
          className={styles.productImage}
        />
      </div>
  
      <div className={styles.infoSection}>
        <h1 className={styles.title}>{product.title}</h1>
        <p className={styles.price}>{product.price}</p>
        <p className={styles.description}>{product.description}</p>
  
        <div className={styles.meta}>
          <span>Standort: {product.location?.city}</span>
          <span>
            Online seit:{" "}
            {product.createdAt?.toDate().toLocaleDateString("de-DE", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span>👁️ {product.views ?? 0} Aufrufe</span>
          <span>❤️ {product.likes ?? 0} Likes</span>
        </div>
  
        <div className={styles.actions}>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`${styles.actionButton} ${styles.messageButton}`}
          >
            Nachricht schreiben
          </button>
          <button
            onClick={handleLike}
            disabled={likeDisabled}
            className={`${styles.actionButton} ${styles.likeButton} ${liked ? styles.liked : ''}`}
          >
            {liked ? "❤️ Geliked" : "🤍 Liken"}
          </button>
          <button
            onClick={handleShare}
            className={`${styles.actionButton} ${styles.shareButton}`}
          >
            📤 Teilen {shared && "(Kopiert ✔)"}
          </button>
        </div>
  
        {showForm && (
          <form className={styles.contactForm}>
            <input
              type="text"
              placeholder="Betreff (z. B. Interesse an Ihrem Angebot)"
              className={styles.subjectInput}
            />
            <textarea placeholder="Deine Nachricht an den/die Verkäufer*in..." />
            <button type="submit" className={styles.actionButton}>
              Senden
            </button>
          </form>
        )}
      </div>
  
      {mapLat && mapLon && (
        <div className={styles.mapWrapper}>
          <h3>Ungefährer Standort</h3>
          <iframe
            title="Google Maps Karte"
            className={styles.mapIframe}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${mapLat},${mapLon}&z=15&output=embed`}
          />
          <p style={{ fontSize: "0.8rem", textAlign: "center", marginTop: "0.5rem" }}>
            basierend auf PLZ: {product.location?.zip}
          </p>
        </div>
      )}
    </section>
  );
};

export default ProductPage;