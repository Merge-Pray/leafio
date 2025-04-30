import styles from "./categorybar.module.css";

const categories = [
  { name: "Zimmerpflanzen", icon: "/assets/zimmerpflanzen.svg" },
  { name: "Gartenpflanzen", icon: "/assets/gartenpflanzen.svg" },
  { name: "Bäume & Sträucher", icon: "/assets/bauume.svg" },
  { name: "Blühpflanzen", icon: "/assets/bluepflanzen.svg" },
  { name: "Seltene Pflanzen", icon: "/assets/selten.svg" },
  { name: "Bonsai & Miniaturpflanzen", icon: "/assets/bonsai.svg" },
  { name: "Pflanzenzubehör", icon: "/assets/zubehoer.svg" },
];

const CategoryBar = () => {
  return (
    <div className={styles.categoryBar}>
      {categories.map((cat) => (
        <div key={cat.name} className={styles.categoryItem}>
          <img src={cat.icon} alt={cat.name} className={styles.icon} />
          <span className={styles.label}>{cat.name}</span>
        </div>
      ))}
    </div>
  );
};

export default CategoryBar;