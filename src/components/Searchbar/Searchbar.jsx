import styles from "./searchbar.module.css";
const Searchbar = () => {
  return (
    <div className={`${styles.wrapper}`}>
      <form className={`${styles.form}`} action="">
        {" "}
        <div className={`${styles.searchBarContainer}`}>
          <img
            className={`${styles.imgSearchbar}`}
            src="/assets/magnifying-glass-solid.svg"
            alt="search"
          />
          <input
            className={`${styles.searchbar}`}
            type="text"
            id="search"
            placeholder="What are you looking for?"
          />{" "}
        </div>
        <select name="city" id="city" className={`${styles.selectSearchbar}`}>
          <option value="">City</option>
          <option value="">Hamburg</option>
        </select>
        <button className={`${styles.buttonSearchbar}`}>Finden</button>
      </form>
    </div>
  );
};

export default Searchbar;
