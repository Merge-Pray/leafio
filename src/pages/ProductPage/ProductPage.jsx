// src/pages/ProductPage/ProductPage.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import styles from "./ProductPage.module.css";

const ProductPage = () => {
  const { id } = useParams(); // Produkt-ID aus der URL holen
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "allads", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Produkt nicht gefunden.");
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
        </div>
      </div>
    </section>
  );
};

export default ProductPage;