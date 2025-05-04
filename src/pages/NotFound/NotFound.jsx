import { useNavigate } from "react-router";
import styles from "./notfound.module.css";
import { useEffect } from "react";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 4000);
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.headline}>Die Seite wurde nicht gefunden!</h2>
      <p>Du wirst zur Startseite weitergeleitet!</p>
    </div>
  );
};

export default NotFound;
