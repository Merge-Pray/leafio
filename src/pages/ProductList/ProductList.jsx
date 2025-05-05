
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

import CategoryListing from "../../components/CategoryListing/CategoryListing";
import styles from "./productlist.module.css";
import { NavLink } from "react-router";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const location = useLocation();
  const { category: paramCategory } = useParams(); 
  const queryParams = new URLSearchParams(location.search);

  const searchCategory = queryParams.get("category");
  const searchQuery = queryParams.get("query");

  const categoryRaw = searchCategory || paramCategory;
  const category = categoryRaw ? decodeURIComponent(categoryRaw) : null;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const adsRef = collection(db, "allads");
        let q = category
          ? query(adsRef, where("category", "==", category))
          : query(adsRef);

        const snapshot = await getDocs(q);
        let results = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (searchQuery) {
          const qLower = searchQuery.toLowerCase();
          results = results.filter((item) =>
            item.title?.toLowerCase().includes(qLower)
          );
        }

        setProducts(results);
      } catch (err) {
        console.error(err);
        setError("Produkte konnten nicht geladen werden.");
      }
    };

    fetchProducts();
  }, [category, searchQuery]);

  return (
    <div className={styles.productListWrapper}>
      <div className={styles.sidebar}>
        <CategoryListing />
      </div>
      <div className={styles.productList}>
        {error && <p>{error}</p>}
        {products.length === 0 && !error && <p>Keine Produkte gefunden.</p>}
        {products.map((product) => (
          <NavLink
            to={`/product/${product.id}`}
            key={product.id}
            className={styles.productItem}
          >
            <img src={product.images?.[0]} alt={product.title} />
            <div className={styles.productInfo}>
              <h3>{product.title}</h3>
              <p>{product.description?.slice(0, 80)}...</p>
              <p><strong>{product.price}</strong></p>
              <p>{product.location?.city}</p>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default ProductList;