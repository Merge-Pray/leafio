import { useNavigate } from "react-router";
import styles from "./notfound.module.css";
import { useEffect } from "react";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 9000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className={styles.container}>
      <h1 className={styles.errorCode}>404</h1>
      <h2 className={styles.headline}>Seite nicht gefunden</h2>
      <p className={styles.subtext}>Du wirst automatisch zur Startseite weitergeleitet...</p>
      <button className={styles.backButton} onClick={() => navigate("/")}>
        Zurück zur Startseite
      </button>
    </div>
  );
};

export default NotFound;