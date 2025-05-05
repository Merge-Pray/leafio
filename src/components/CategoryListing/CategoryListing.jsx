import { NavLink } from "react-router";
import styles from "./categorylisting.module.css";
import { categories } from "../../pages/PlaceAd/CategorySelector";

const CategoryListing = () => {
  return (
    <div className={styles.categoryList}>
      <h3>Kategorien</h3>
      <ul className={styles.list}>
        {categories.map((category, index) => (
          <li key={index} className={styles.categoryItem}>
            <NavLink
              to={`/category/${encodeURIComponent(category.name)}`}
              className={({ isActive }) =>
                isActive
                  ? `${styles.link} ${styles.active}`
                  : styles.link
              }
            >
              {category.name}
            </NavLink>
          </li>

        ))}
      </ul>
    </div>
  );
};

export default CategoryListing;