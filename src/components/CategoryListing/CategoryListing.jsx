import styles from "./categorylisting.module.css";

const CategoryListing = ({ categories }) => {
  return (
    <div className={styles.categoryList}>
    <h3>Kategorien</h3>
    <ul>
      {categories.map((category) => (
        <li key={category.name} className={styles.categoryItem}>
          {category.name}
        </li>
      ))}
    </ul>
  </div>
  );
};

export default CategoryListing;
