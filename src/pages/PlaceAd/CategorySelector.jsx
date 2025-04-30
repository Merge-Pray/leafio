import React, { useState } from "react";
import styles from "./categoryselector.module.css";

const categories = [
    {
      name: "Zimmerpflanzen",
      flags: [
        "Lichtbedarf: viel Licht",
        "Lichtbedarf: Halbschatten",
        "Lichtbedarf: schattig",
        "Pflege: pflegeleicht",
        "Pflege: anspruchsvoll",
        "Luftreinigend",
        "Haustierfreundlich",
        "Giftig für Tiere",
        "Blühend",
        "Grünpflanze",
        "Wuchsform: hängend",
        "Wuchsform: kletternd",
        "Wuchsform: aufrecht",
        "Hydrokultur geeignet",
        "Größe: Mini",
        "Größe: kompakt",
        "Größe: groß",
        "Anfängerfreundlich"
      ]
    },
    {
      name: "Gartenpflanzen",
      flags: [
        "Winterhart",
        "Frostempfindlich",
        "Lage: sonnig",
        "Lage: halbschattig",
        "Lage: schattig",
        "Boden: trocken",
        "Boden: feucht",
        "Boden: durchlässig",
        "Blühzeit: Frühling",
        "Blühzeit: Sommer",
        "Blühzeit: Herbst",
        "Bienenfreundlich",
        "Immergrün",
        "Laubabwerfend",
        "Typ: Bodendecker",
        "Typ: Rabattenpflanze",
        "Typ: Solitärpflanze"
      ]
    },
    {
      name: "Bäume & Sträucher",
      flags: [
        "Typ: Laubbaum",
        "Typ: Nadelbaum",
        "Typ: Strauch",
        "Blütenbaum",
        "Fruchttragend",
        "Höhe: Zwergform",
        "Höhe: mittel",
        "Höhe: hoch",
        "Herbstfärbung",
        "Immergrün",
        "Standort: Sonne",
        "Standort: Schatten",
        "Standort: windgeschützt",
        "Verwendung: Hecke",
        "Verwendung: Einzelstellung",
        "Formschnitt geeignet"
      ]
    },
    {
      name: "Blühpflanzen",
      flags: [
        "Blühzeit: Frühling",
        "Blühzeit: Sommer",
        "Blühzeit: Herbst",
        "Blühzeit: ganzjährig",
        "Duftend",
        "Neutral duftend",
        "Bienenfreundlich",
        "Schmetterlingsfreundlich",
        "Als Schnittblume geeignet",
        "Farben: rot",
        "Farben: gelb",
        "Farben: weiß",
        "Farben: rosa",
        "Farben: violett",
        "Mehrjährig",
        "Einjährig",
        "Nutzung: Zimmer & Garten"
      ]
    },
    {
      name: "Sukkulenten & Kakteen",
      flags: [
        "Typ: Kaktus",
        "Typ: Blattsukkulent",
        "Typ: Stammsukkulent",
        "Größe: Mini",
        "Größe: mittel",
        "Größe: groß",
        "Blühfähig",
        "Nur grün",
        "Geeignet für Fensterbank",
        "Geeignet für Terrarium",
        "Pflege: niedrig",
        "Pflege: mittel",
        "Frosthart",
        "Nur für Innenräume"
      ]
    },
    {
      name: "Kräuter, Obst- & Gemüsepflanzen",
      flags: [
        "Verwendung: frisch",
        "Verwendung: getrocknet",
        "Verwendung: Tee",
        "Verwendung: Heilpflanze",
        "Standort: Balkon",
        "Standort: Garten",
        "Standort: Fensterbank",
        "Saison: Frühjahr",
        "Saison: Sommer",
        "Saison: ganzjährig",
        "Anbau: Bio",
        "Anbau: konventionell",
        "Selbstfruchtend",
        "Befruchtersorte notwendig",
        "Mehrjährig",
        "Einjährig"
      ]
    },
    {
      name: "Samen & Stecklinge",
      flags: [
        "Keimdauer: schnell",
        "Keimdauer: mittel",
        "Keimdauer: langsam",
        "Aussaat: Vorkultur nötig",
        "Aussaat: Direktsaat",
        "Samenart: Bio",
        "Samenart: Hybrid",
        "Samenart: samenfest",
        "Pflanzenart: Gemüse",
        "Pflanzenart: Blume",
        "Pflanzenart: Kräuter",
        "Pflanzenart: Baum",
        "Einjährig",
        "Mehrjährig",
        "Lichtkeimer",
        "Dunkelkeimer"
      ]
    },
    {
      name: "Seltene Pflanzen & Raritäten",
      flags: [
        "Herkunft: tropisch",
        "Herkunft: Wüstenregion",
        "Herkunft: Gebirge",
        "Typ: Sammlerpflanze",
        "Typ: Kulturform",
        "Typ: Wildform",
        "Vermehrung: Samen",
        "Vermehrung: Steckling",
        "Vermehrung: Teilung",
        "Seltenheitsgrad: selten",
        "Seltenheitsgrad: sehr selten",
        "Seltenheitsgrad: Rarität",
        "Pflege: hoch",
        "Pflege: mittel",
        "Pflege: niedrig",
        "Besonderheit: Farbmutation",
        "Besonderheit: Wuchsform",
        "Besonderheit: Duft / Blüte"
      ]
    },
    {
      name: "Bonsai & Miniaturpflanzen",
      flags: [
        "Haltung: Indoor",
        "Haltung: Outdoor",
        "Baumart: Ficus",
        "Baumart: Ahorn",
        "Baumart: Kiefer",
        "Baumart: Azalee",
        "Stilrichtung: formal",
        "Stilrichtung: informell",
        "Stilrichtung: kaskade",
        "Reifegrad: jung",
        "Reifegrad: gereift",
        "Topfart: Schale",
        "Topfart: Steinplatte",
        "Pflege: hoch",
        "Pflege: mittel",
        "Pflege: niedrig"
      ]
    },
    {
      name: "Pflanzenzubehör",
      flags: [
        "Kategorie: Töpfe",
        "Kategorie: Erde",
        "Kategorie: Dünger",
        "Kategorie: Werkzeuge",
        "Kategorie: Bewässerung",
        "Material: Ton",
        "Material: Kunststoff",
        "Material: Keramik",
        "Material: Metall",
        "Nutzung: Indoor",
        "Nutzung: Outdoor",
        "Nachhaltig",
        "Recycelbar",
        "Bio",
        "Größe: S",
        "Größe: M",
        "Größe: L",
        "Größe: XL",
        "Smart-Garten Zubehör",
        "Manuelles Zubehör"
      ]
    }
  ];

const CategorySelector = ({ onCategoryChange, onFlagsChange }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFlags, setSelectedFlags] = useState([]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedFlags([]);       
    if (onCategoryChange) onCategoryChange(category);
  };

  const toggleFlag = (flag) => {
    let updatedFlags;
    if (selectedFlags.includes(flag)) {
      updatedFlags = selectedFlags.filter((f) => f !== flag);
    } else {
      updatedFlags = [...selectedFlags, flag];
    }
    setSelectedFlags(updatedFlags);
    if (onFlagsChange) onFlagsChange(updatedFlags);
  };

  return (
    <div className={styles.wrapper}>
         <p>Wähle eine Hauptkategorie</p>
      <div className={styles.categories}>
     
        {categories.map((cat) => (
        
          <button
            key={cat.name}
            className={`${styles.button} ${selectedCategory === cat.name ? styles.active : ""}`}
            onClick={() => handleCategoryClick(cat.name)}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <p>Wähle aus was zu deinem Inserat passt:</p>
      {selectedCategory && (
        <div className={styles.flags}>
          {categories
            .find((cat) => cat.name === selectedCategory)
            .flags.map((flag) => (
              <button
                key={flag}
                className={`${styles.flagButton} ${selectedFlags.includes(flag) ? styles.active : ""}`}
                onClick={() => toggleFlag(flag)}
              >
                {flag}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default CategorySelector;