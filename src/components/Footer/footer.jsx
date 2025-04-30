import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p className={styles.text}>
        Leafio ist ein Projekt im Rahmen des Web Development Kurses bei DCI (April/Mai 2025) und nicht für den produktiven Betrieb gedacht.
      </p>
    </footer>
  );
};

export default Footer;