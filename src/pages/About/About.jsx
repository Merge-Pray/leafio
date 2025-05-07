import styles from "./about.module.css";
import { NavLink } from "react-router";

const About = () => {
  return (
    <div className={styles.aboutPage}>
      <h1>Über Leafio</h1>

      <section>
        <h2>🌱 Was ist Leafio?</h2>
        <p>
          Leafio ist eine Plattform für Pflanzen-Kleinanzeigen – entwickelt mit React, Firebase
          und einem klaren Ziel: Anzeigen, die stilvoll sind. Du kannst Pflanzen verschenken, geschenkt bekommen, kaufen,
          verkaufen oder einfach durch die grüne Galerie stöbern.
        </p>
        <p>Leafio ist ein Projekt im Rahmen des Web Development Kurses beim DCI (April/Mai 2025) und nicht für den produktiven Betrieb gedacht.</p>
      </section>

      <section>
        <h2>🔧 Funktionen</h2>
        <ul>
          <li>Erstellen & Verwalten von Pflanzenanzeigen</li>
          <li>Suche nach Titel, Beschreibung, Kategorie oder Stadt</li>
          <li>Liken, Teilen & Anzeigenkarten mit Standort</li>
          <li>Mobile-freundlich & voll responsive</li>
        </ul>
      </section>

      <section>
        <h2>🧪 Technologien</h2>
        <ul>
          <li>Frontend: React (Vite), Zustand, React Router 7, CSS Modules</li>
          <li>Backend: Cloud Firestore, Firebase Authentication</li>
          <li>Weitere: Google Maps, Cloudinary</li>
        </ul>
      </section>

      <section>
        <h2>📮 Kontakt</h2>
        <p>Feedback, Lob oder Verbesserungsvorschläge an unser Projektteam:</p>
        <ul className={styles.contactList}>
        <li>
            <a
              href="https://github.com/SarahDomscheit"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Sarah - @SarahDomscheit
            </a>
          </li>
          <li>
            <a
              href="https://github.com/cmgoersch"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Calle - @cmgoersch
            </a>
          </li>
         
          <li>
            <a
              href="https://github.com/benNurtjipta"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Ben - @benNurtjipta
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>🗂 Projekt-Repository</h2>
        <p>
          Der gesamte Code ist öffentlich verfügbar unter:{" "}
          <a
            href="https://github.com/Merge-Pray/leafio"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            github.com/Merge-Pray/leafio
          </a>
        </p>
      </section>
      <NavLink to="/" className={styles.backButton}>
  ⬅ Zurück zu Leafio
</NavLink>
    </div>
  );
};

export default About;