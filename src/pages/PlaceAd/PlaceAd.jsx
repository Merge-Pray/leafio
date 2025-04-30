import styles from "./placead.module.css";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import CategorySelector from "./CategorySelector"; // ❗ Pfad ggf. anpassen

const PlaceAd = ({ user }) => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFlags, setSelectedFlags] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [images, setImages] = useState([]);
  const [imageURLs, setImageURLs] = useState([]);
  const [error, setError] = useState("");

  const handleImageUpload = async (files) => {
    const urls = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "deinUploadPreset");
      formData.append("cloud_name", "deinCloudName");

      const res = await fetch("https://api.cloudinary.com/v1_1/deinCloudName/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      urls.push(data.secure_url);
    }

    setImageURLs(urls);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) {
      setError("Bitte lade mindestens ein Bild hoch.");
      return;
    }
    setImages(files);
    handleImageUpload(files);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      setError("Du musst eingeloggt sein, um eine Anzeige zu erstellen.");
      return;
    }

    if (imageURLs.length === 0) {
      setError("Du musst mindestens ein Bild hochladen.");
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
      createdAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      images: imageURLs,
      location: {
        city: user.address.city,
        zip: user.address.zip,
        street: user.address.street,
      },
      userID: user.userID,
    };

    console.log("Neue Anzeige:", ad);
    // TODO: an dein Backend senden
  };

  return (
    <div className={styles.container}>
      <h1>Neue Anzeige erstellen</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Titel"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          placeholder="Preis (z. B. VB, 15€)"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Beschreibung"
          value={formData.description}
          onChange={handleChange}
          required
        />

        {/* Kategorie- und Flag-Auswahl */}
        <CategorySelector
          onCategoryChange={setSelectedCategory}
          onFlagsChange={setSelectedFlags}
        />

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          required
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit">Anzeige erstellen</button>
      </form>

      {imageURLs.length > 0 && (
        <div className={styles.imagePreview}>
          {imageURLs.map((url, idx) => (
            <img key={idx} src={url} alt={`Bild ${idx + 1}`} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaceAd;