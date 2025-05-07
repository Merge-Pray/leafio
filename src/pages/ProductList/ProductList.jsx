import { useEffect, useState } from "react";
import { useLocation, useParams, NavLink } from "react-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import CategoryListing from "../../components/CategoryListing/CategoryListing";
import styles from "./productlist.module.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const location = useLocation();
  const { category: paramCategory } = useParams();
  const queryParams = new URLSearchParams(location.search);

  const searchQuery = queryParams.get("query");
  const cityFilter = queryParams.get("city");
  const category = paramCategory ? decodeURIComponent(paramCategory) : null;

  const isSearching = searchQuery || cityFilter;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const adsRef = collection(db, "allads");

        // nur nach Kategorie filtern, wenn keine Suche aktiv
        let q = !isSearching && category
          ? query(adsRef, where("category", "==", category))
          : query(adsRef);

        const snapshot = await getDocs(q);
        let results = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (searchQuery) {
          const qLower = searchQuery.toLowerCase();
          results = results.filter((item) => {
            const title = item.title?.toLowerCase();
            const desc = item.description?.toLowerCase();
            const tags = item.tags?.map(t => t.toLowerCase()) || [];
            const cat = item.category?.toLowerCase();
            return (
              title?.includes(qLower) ||
              desc?.includes(qLower) ||
              cat?.includes(qLower) ||
              tags.some(tag => tag.includes(qLower))
            );
          });
        }

        if (cityFilter) {
          const cityLower = cityFilter.toLowerCase();
          results = results.filter(
            (item) =>
              item.location?.city?.toLowerCase().includes(cityLower)
          );
        }

        setProducts(results);
      } catch (err) {
        console.error(err);
        setError("Produkte konnten nicht geladen werden.");
      }
    };

    fetchProducts();
  }, [category, searchQuery, cityFilter]);

  return (
    <div className={styles.productListWrapper}>
      <div className={styles.sidebar}>
        <CategoryListing />
      </div>
      <div className={styles.productList}>
        {error && <p>{error}</p>}
        {products.length === 0 && !error && (
  <div className={styles.productItemPlaceholder}>
    <p><strong>Leider Keine Produkte gefunden.</strong>Versuche es mit einem anderen Suchbegriff. Viel Erfolg und viel Spass! Dein Leafio Team.</p>
  </div>
)}
        {products.map((product) => (
          <NavLink
            to={`/product/${product.id}`}
            key={product.id}
            className={styles.productItem}
          >
            <img src={product.images?.[0]} alt={product.title} />
            <div className={styles.productInfo}>
              <h3>{product.title}</h3>
              <p className={styles.priceBadge}>{product.price}</p>
              
              <p>{product.description?.slice(0, 100)}...</p>
             
              <p className={styles.city}>{product.location?.city}</p>
             
              <p className={styles.createdAt}>Online seit:</p>
<div className={styles.createdAt}>
  {product.createdAt?.toDate().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })}
</div>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default ProductList;