import styles from "./placead.module.css";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import CategorySelector from "./CategorySelector";
import { db } from "../../config/firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  arrayUnion,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import useUserStore from "../../hooks/userStore";

import { useNavigate } from "react-router";

const PlaceAd = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentUser) {
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    }
  }, []);

  const currentUser = useUserStore((state) => state.currentUser);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFlags, setSelectedFlags] = useState([]);
  const [images, setImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageURLs, setImageURLs] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) {
      setError("Bitte lade mindestens ein Bild hoch.");
      setImages([]);
      setImageURLs([]);
      return;
    }
    setImages(files);
    setImageURLs([]);
    setError("");
  };

  const handleUploadToCloudinary = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    const urls = [];
    const filenames = [];

    for (const file of images) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ebqndymu");
      formData.append("folder", `ads/${currentUser.userID}`);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dgzbudchq/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Fehler beim Hochladen eines oder mehrerer Bilder.");
        }

        const data = await response.json();
        urls.push(data.secure_url);
        filenames.push(file.name);
        setUploadProgress((prev) => prev + 100 / images.length);
      } catch (error) {
        console.error("Fehler beim Hochladen des Bildes:", error);
        setError("Fehler beim Hochladen eines oder mehrerer Bilder.");
        setIsUploading(false);
        return;
      }
    }

    setImageURLs(urls);
    setIsUploading(false);
    setUploadedFiles(filenames);
    setUploadProgress(0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!currentUser) {
      setError("Du musst eingeloggt sein, um eine Anzeige zu erstellen.");
      return;
    }

    if (images.length === 0) {
      setError("Du musst mindestens ein Bild hochladen.");
      return;
    }

    if (isUploading) {
      setError("Bitte warte, bis die Bilder hochgeladen wurden.");
      return;
    }

    if (imageURLs.length === 0 && images.length > 0) {
      setError(
        "Die Bilder konnten nicht hochgeladen werden. Bitte versuche es erneut."
      );
      return;
    }

    if (!selectedCategory) {
      setError("Bitte wähle eine Kategorie.");
      return;
    }

    try {
      const adData = {
        title: formData.title,
        price: formData.price,
        description: formData.description,
        category: selectedCategory,
        tags: selectedFlags,
        createdAt: serverTimestamp(),
        views: 0,
        likes: 0,
        images: imageURLs,
        location: {
          city: currentUser.address?.city || "",
          zip: currentUser.address?.zip || "",
          street: currentUser.address?.street || "",
        },
        userID: currentUser.userID,
      };

      const adRef = await addDoc(collection(db, "allads"), adData);

      const adID = adRef.id;

      await updateDoc(adRef, { adID });

      const userRef = doc(db, "users", currentUser.userID);
      await updateDoc(userRef, {
        ownAds: arrayUnion(adID),
      });

      setSuccessMessage("Anzeige erfolgreich erstellt!");
      setFormData({ title: "", price: "", description: "" });
      setSelectedCategory("");
      setSelectedFlags([]);
      setImages([]);
      setImageURLs([]);
      setUploadedFiles([]);
    } catch (error) {
      console.error("Fehler beim Speichern der Anzeige in Firebase:", error);
      setError(
        "Fehler beim Erstellen der Anzeige. Bitte versuche es später erneut."
      );
    }
  };

  if (!currentUser) {
    return (
      <div className={styles.container}>
        <h1 className={styles.errorCode}>Du musst dich einloggen!</h1>

        <p className={styles.subtext}>
          Du wirst automatisch zum Login weitergeleitet...
        </p>
        <button
          className={styles.backButton}
          onClick={() => navigate("/login")}
        >
          Zum Login
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.headline}>Neue Anzeige erstellen</h1>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <input
          className={styles.textInput}
          name="title"
          placeholder="Titel"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          className={styles.textInput}
          name="price"
          placeholder="Preis (z. B. VB, 15€)"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <textarea
          className={styles.textArea}
          name="description"
          placeholder="Beschreibung"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <CategorySelector
          onCategoryChange={setSelectedCategory}
          onFlagsChange={setSelectedFlags}
        />

        <input
          id="fileInput"
          className={styles.hiddenFileInput}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />

        <label htmlFor="fileInput" className={styles.customFileButton}>
          Bilder auswählen
        </label>

        {images.length > 0 && !isUploading && (
          <button
            type="button"
            className={styles.uploadButton}
            onClick={handleUploadToCloudinary}
          >
            Bilder hochladen
          </button>
        )}

        {isUploading && (
          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBar}
              style={{ width: `${uploadProgress}%` }}
            >
              {Math.round(uploadProgress)}%
            </div>
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className={styles.fileNamesContainer}>
            <h3>Hochgeladene Dateien:</h3>
            <ul>
              {uploadedFiles.map((filename, idx) => (
                <li key={idx} className={styles.fileName}>
                  {filename}
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && <p className={styles.errorMessage}>{error}</p>}
        {successMessage && (
          <p className={styles.successMessage}>{successMessage}</p>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={
            isUploading || (imageURLs.length === 0 && images.length > 0)
          }
        >
          Anzeige erstellen
        </button>
      </form>

      {imageURLs.length > 0 && (
        <div className={styles.imagePreviewContainer}>
          {imageURLs.map((url, idx) => (
            <img
              key={idx}
              className={styles.previewImage}
              src={url}
              alt={`Bild ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaceAd;
