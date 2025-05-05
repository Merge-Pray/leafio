import { NavLink, useParams } from "react-router";
import styles from "./categorylisting.module.css";
import { categories } from "../../pages/PlaceAd/CategorySelector";

const CategoryListing = () => {
  return (
    <div className={styles.categoryList}>
      <h3>Kategorien</h3>
      <ul>
        {categories.map((category, index) => (
          <NavLink
            to={`/category/${encodeURIComponent(category.name)}`}
            key={index}
            className={({ isActive }) =>
              isActive ? `${styles.active}` : `${styles.categoryItem}`
            }
          >
            <li className={styles.categoryItem}>{category.name}</li>
          </NavLink>
        ))}
      </ul>
    </div>
  );
};

export default CategoryListing;
