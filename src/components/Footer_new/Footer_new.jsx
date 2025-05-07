import { NavLink } from "react-router";
import styles from "./footer_new.module.css";

const Footer_new = () => {
  return (
    <footer className={styles.footer}>
      <div>
        <p className={styles.text}>
          Leafio ist ein Projekt im Rahmen des Web Development Kurses beim DCI
          (April/Mai 2025) und nicht für den produktiven Betrieb gedacht.
        </p>
        <div className={styles.linkRow}>
          <NavLink to="/about" className={styles.footerLink}>
            Über Leafio
          </NavLink>
        </div>
      </div>
    </footer>
  );
};

export default Footer_new;