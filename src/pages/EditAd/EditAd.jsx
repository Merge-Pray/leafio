import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

import CategorySelector from "../PlaceAd/CategorySelector";
import useUserStore from "../../hooks/userStore";
import styles from "./editAd.module.css";

const EditAd = () => {
  const { adID } = useParams();
  const navigate = useNavigate();
  const currentUser = useUserStore((state) => state.currentUser);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFlags, setSelectedFlags] = useState([]);
  const [imageURLs, setImageURLs] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadAd = async () => {
      try {
        const adRef = doc(db, "allads", adID);
        const adSnap = await getDoc(adRef);
        if (adSnap.exists()) {
          const adData = adSnap.data();
          if (adData.userID !== currentUser.userID) {
            setError("Du kannst nur deine eigenen Anzeigen bearbeiten.");
            return;
          }
          setFormData({
            title: adData.title,
            price: adData.price,
            description: adData.description,
          });
          setSelectedCategory(adData.category);
          setSelectedFlags(adData.tags || []);
          setImageURLs(adData.images || []);
        } else {
          setError("Anzeige nicht gefunden.");
        }
      } catch (err) {
        console.error(err);
        setError("Fehler beim Laden der Anzeige.");
      }
    };

    loadAd();
  }, [adID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const adRef = doc(db, "allads", adID);
      await updateDoc(adRef, {
        title: formData.title,
        price: formData.price,
        description: formData.description,
        category: selectedCategory,
        tags: selectedFlags,
        updatedAt: serverTimestamp(),
        images: imageURLs, // Or let them re-upload
      });

      setSuccessMessage("Anzeige erfolgreich aktualisiert!");
      setTimeout(() => {
        navigate(`/user/${currentUser.userID}`);
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Fehler beim Aktualisieren der Anzeige.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.headline}>Anzeige bearbeiten</h1>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {successMessage && (
        <p className={styles.successMessage}>{successMessage}</p>
      )}
      <form onSubmit={handleUpdate} className={styles.formContainer}>
        <input
          className={styles.textInput}
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <input
          className={styles.textInput}
          name="price"
          value={formData.price}
          onChange={handleChange}
        />
        <textarea
          className={styles.textArea}
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <CategorySelector
          onCategoryChange={setSelectedCategory}
          onFlagsChange={setSelectedFlags}
          initialCategory={selectedCategory}
          initialFlags={selectedFlags}
        />
        <button type="submit" className={styles.submitButton}>
          Änderungen speichern
        </button>
      </form>
    </div>
  );
};

export default EditAd;
