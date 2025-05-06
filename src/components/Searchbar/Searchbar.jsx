import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import styles from "./searchbar.module.css";

const Searchbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [city, setCity] = useState("");
  const [availableCities, setAvailableCities] = useState([]);
  const navigate = useNavigate();

  // 🔄 Lade Städte aus der Datenbank
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const adsRef = collection(db, "allads");
        const snapshot = await getDocs(adsRef);

        const cityCounts = {};
        snapshot.forEach((doc) => {
          const city = doc.data().location?.city;
          if (city) {
            const cityTrimmed = city.trim();
            cityCounts[cityTrimmed] = (cityCounts[cityTrimmed] || 0) + 1;
          }
        });

        const sortedCities = Object.entries(cityCounts)
          .sort((a, b) => b[1] - a[1]) // optional: nach Häufigkeit
          .map(([cityName]) => cityName);

        setAvailableCities(sortedCities);
      } catch (err) {
        console.error("Fehler beim Laden der Städte:", err);
      }
    };

    fetchCities();
  }, []);

  // ➡️ Formular absenden
  const handleSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("query", searchTerm.trim());
    if (city) params.set("city", city);

    navigate(`/products?${params.toString()}`);
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.searchBarContainer}>
          <img
            className={styles.imgSearchbar}
            src="/assets/magnifying-glass-solid.svg"
            alt="search"
          />
          <input
            className={styles.searchbar}
            type="search"
            placeholder="Was suchst du?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className={styles.selectSearchbar}
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option value="">Alle Städte</option>
          {availableCities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button className={styles.buttonSearchbar}>Finden</button>
      </form>
    </div>
  );
};

export default Searchbar;