import styles from "./searchbarMobile.module.css";
const Searchbar = () => {
  return (
    <div className={`${styles.searchBarContainer}`}>
      {" "}
      <img
        className={`${styles.imgSearchbar}`}
        src="/assets/magnifying-glass-solid.svg"
        alt="search"
      />
      <input
        className={`${styles.searchbarMobile}`}
        type="text"
        id="search"
        placeholder="Search"
      />
    </div>
  );
};

export default Searchbar;
