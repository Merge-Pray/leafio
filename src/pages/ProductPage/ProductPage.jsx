import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import styles from "./ProductPage.module.css";
import useUserStore from "../../hooks/userStore";

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
  const navigate = useNavigate();
  const currentUser = useUserStore((state) => state.currentUser);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "allads", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setLoading(false);
          navigate("/product/productnotfound");
          return;
        }

        const data = docSnap.data();
        const newViews = (data.views || 0) + 1;

        // Update views without requiring userID in the payload
        if (currentUser) {
          try {
            await updateDoc(docRef, { views: newViews });
          } catch (err) {
            console.error("Error updating views:", err);
          }
        }

        setProduct({ id: docSnap.id, ...data, views: newViews });

        // Fetch user data
        if (currentUser) {
          try {
            const userRef = doc(db, "users", currentUser.userID);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const userData = userSnap.data();
              if (userData.likedAds?.includes(id)) {
                setLiked(true);
                setLikeDisabled(true);
              }
            }
          } catch (err) {
            console.error("Error fetching user data:", err);
          }
        }

        // Fetch location data
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
        console.error("Error fetching product:", err);
        setError("Fehler beim Laden des Produkts.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, currentUser]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const handleLike = async () => {
    if (!product || likeDisabled || !currentUser) return;

    const docRef = doc(db, "allads", product.id);
    const newLikes = (product.likes || 0) + 1;

    try {
      // Update likes without requiring userID in the payload
      await updateDoc(docRef, { likes: newLikes });
      setProduct({ ...product, likes: newLikes });
      setLiked(true);
      setLikeDisabled(true);

      const userRef = doc(db, "users", currentUser.userID);
      await updateDoc(userRef, {
        likedAds: arrayUnion(id),
      });
    } catch (err) {
      console.error("Fehler beim Liken:", err);
    }
  };

  const handleUnlike = async () => {
    if (!product || !liked) return;

    const docRef = doc(db, "allads", product.id);
    const newLikes = (product.likes || 0) - 1;

    try {
      await updateDoc(docRef, { likes: newLikes });
      setProduct({ ...product, likes: newLikes });
      setLiked(false);
      setLikeDisabled(false);

      const userRef = doc(db, "users", currentUser.userID);
      await updateDoc(userRef, {
        likedAds: arrayRemove(id),
      });
    } catch (err) {
      console.error("Fehler beim Entliken:", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("You need to log in to send messages.");
      return;
    }

    const messageContent = e.target.message.value.trim();
    const messageTitle = e.target.subject.value.trim();

    if (!messageContent || !messageTitle) {
      alert("Please fill in both the subject and message.");
      return;
    }

    try {
      await addDoc(collection(db, "messages"), {
        senderID: currentUser.userID,
        recipientID: product.userID,
        content: messageContent,
        title: messageTitle,
        timestamp: serverTimestamp(),
        isRead: false,
        productId: product.id,
      });

      alert("Message sent successfully!");
      setShowForm(false);
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send the message. Please try again.");
    }
  };

  if (loading) return <div className={styles.status}>Lade Produkt...</div>;
  if (error) return <div className={styles.status}>{error}</div>;

  return (
    <section className={styles.productPage}>
      <div className={styles.backButtonWrapper}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← Zurück
        </button>
      </div>
      <div className={styles.imageSection}>
        <img
          src={product.images?.[0]}
          alt={product.title}
          className={styles.productImage}
        />
      </div>

      <div className={styles.infoSection}>
        <h1 className={styles.title}>{product.title}</h1>
        <span>
          <Link
            to={`/products?category=${encodeURIComponent(product.category)}`}
            className={styles.categoryLink}
          >
            {product.category}
          </Link>
        </span>
        <p className={styles.price}>{product.price}</p>
        <p className={styles.description}>{product.description}</p>
        {product.tags?.length > 0 && (
          <div className={styles.tagWrapper}>
            {product.tags.map((tag, index) => (
              <span key={index} className={styles.tagBadge}>
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className={styles.meta}>
          <span>📍 Standort: {product.location?.city}</span>
          <span>
            📅 Online seit:{" "}
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
            onClick={() => {
              if (!currentUser) {
                alert("You need to log in to send messages.");
                return;
              }
              setShowForm(!showForm);
            }}
            className={`${styles.actionButton} ${styles.messageButton}`}
          >
            Nachricht schreiben
          </button>
          <button
            onClick={liked ? handleUnlike : handleLike}
            disabled={!currentUser}
            className={`${styles.actionButton} ${styles.likeButton} ${
              liked ? styles.liked : ""
            }`}
          >
            {liked ? "💔 Entliken" : "🤍 Liken"}
          </button>
          <button
            onClick={handleShare}
            className={`${styles.actionButton} ${styles.shareButton}`}
          >
            📤 Teilen {shared && "(Kopiert ✔)"}
          </button>
        </div>

        {showForm && (
          <form className={styles.contactForm} onSubmit={handleSendMessage}>
            <input
              type="text"
              name="subject"
              placeholder="Betreff (z. B. Interesse an Ihrem Angebot)"
              className={styles.subjectInput}
              required
            />
            <textarea
              name="message"
              placeholder="Deine Nachricht an den/die Verkäufer*in..."
              className={styles.messageInput}
              required
            />
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
          <p
            style={{
              fontSize: "0.8rem",
              textAlign: "center",
              marginTop: "0.5rem",
            }}
          >
            basierend auf PLZ: {product.location?.zip}
          </p>
        </div>
      )}
    </section>
  );
};

export default ProductPage;
