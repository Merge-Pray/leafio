import { useNavigate } from "react-router";
import styles from "./productNotFound.module.css";
import { useEffect } from "react";

const ProductNotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 9000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className={styles.container}>
      <h1 className={styles.errorCode}>Product Not Found</h1>
      <h2 className={styles.headline}>Das Produkt konnte nicht gefunden werden.</h2>
      <p className={styles.subtext}>Du wirst automatisch zur Startseite weitergeleitet...</p>
      <button className={styles.backButton} onClick={() => navigate("/")}>
        Zurück zur Startseite
      </button>
    </div>
  );
};

export default ProductNotFound;