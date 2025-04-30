
import styles from "./placead.module.css";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import CategorySelector from "./CategorySelector";
import { db, storage } from "../../config/firebaseConfig"; // Import Firebase database and storage instances
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; // Import Firestore functions
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Import Storage functions
import useUserStore from "../../hooks/userStore"; // Import the Zustand store

const PlaceAd = () => {
  const currentUser = useUserStore((state) => state.currentUser); // Get currentUser from Zustand store
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
  });

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
    setImageURLs([]); // Clear previous URLs when new files are selected
    setError("");
  };

  const handleUploadToFirebase = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    const urls = [];

    for (const file of images) {
      const storageRef = ref(storage, `ads/${currentUser.userID}/${uuidv4()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      try {
        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress((prevProgress) => Math.max(prevProgress, progress)); // Update progress
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case 'paused':
                  console.log('Upload is paused');
                  break;
                case 'running':
                  console.log('Upload is running');
                  break;
                default:
                  break;
              }
            },
            (error) => {
              console.error("Fehler beim Hochladen des Bildes:", error);
              setError("Fehler beim Hochladen eines oder mehrerer Bilder.");
              setIsUploading(false);
              reject(error);
            },
            async () => {
              // Upload completed successfully, now we can get the download URL
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              urls.push(downloadURL);
              resolve();
            }
          );
        });
      } catch (uploadError) {
        return; // Stop further uploads if one fails
      }
    }

    setImageURLs(urls);
    setIsUploading(false);
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
      setError("Die Bilder konnten nicht hochgeladen werden. Bitte versuche es erneut.");
      return;
    }

    if (!selectedCategory) {
      setError("Bitte wähle eine Kategorie.");
      return;
    }

    const ad = {
      adID: uuidv4(),
      title: formData.title,
      price: formData.price,
      description: formData.description,
      category: selectedCategory,
      tags: selectedFlags,
      createdAt: serverTimestamp(), // Use Firebase server timestamp
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

    try {
      const allAdsCollection = collection(db, "allads");
      await addDoc(allAdsCollection, ad);
      setSuccessMessage("Anzeige erfolgreich erstellt!");
      setFormData({ title: "", price: "", description: "" });
      setSelectedCategory("");
      setSelectedFlags([]);
      setImages([]);
      setImageURLs([]);
    } catch (error) {
      console.error("Fehler beim Speichern der Anzeige in Firebase:", error);
      setError("Fehler beim Erstellen der Anzeige. Bitte versuche es später erneut.");
    }
  };

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
          className={styles.fileInput}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          required
        />

        {images.length > 0 && !isUploading && (
          <button type="button" className={styles.uploadButton} onClick={handleUploadToFirebase}>
            Bilder hochladen
          </button>
        )}

        {isUploading && (
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBar} style={{ width: `${uploadProgress}%` }}>
              {Math.round(uploadProgress)}%
            </div>
          </div>
        )}

        {error && <p className={styles.errorMessage}>{error}</p>}
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

        <button type="submit" className={styles.submitButton} disabled={isUploading || imageURLs.length === 0 && images.length > 0}>
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
