import React, { useState } from "react";
import styles from "./categoryselector.module.css";

const categories = [
    {
        name: "Zimmerfplanzen",
        flags: ["Winterhart", "sonnig", "durchlässig", "Bienenfreundlich"],
      },
    {
    name: "Gartenpflanzen",
    flags: ["Winterhart", "sonnig", "durchlässig", "Bienenfreundlich"],
  },
  {
    name: "Bäume & Sträucher",
    flags: ["Laubbaum", "Blütenbaum", "Zwergform", "Formschnitt"],
  },
  {
    name: "Blühpflanzen",
    flags: ["Duftend", "Blühzeit: Sommer", "Bienenfreundlich"],
  },
  {
    name: "Sukkulenten & Kakteen",
    flags: ["Kaktus", "Mini", "blühfähig", "pflegeleicht"],
  },
  {
    name: "Kräuter, Obst- & Gemüsepflanzen",
    flags: ["Heilpflanze", "Balkon", "Bio", "mehrjährig"],
  },
  {
    name: "Samen & Stecklinge",
    flags: ["Keimdauer: schnell", "Direktsaat", "samenfest"],
  },
  {
    name: "Seltene Pflanzen & Raritäten",
    flags: ["tropisch", "Rarität", "Steckling"],
  },
  {
    name: "Bonsai & Miniaturpflanzen",
    flags: ["Indoor", "Ficus", "formal", "Pflege: hoch"],
  },
  {
    name: "Pflanzenzubehör",
    flags: ["Töpfe", "Erde", "Dünger", "Bewässerung"],
  },
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
      <p>Wähle aus was zu deinem Inserat apsst:</p>
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