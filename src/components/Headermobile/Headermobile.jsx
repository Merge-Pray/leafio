import SearchbarMobile from "../Searchbar/SearchbarMobile";
import styles from "./headermobile.module.css";

const Headermobile = () => {
  return (
    <>
      <div className={`${styles.headerMobile}`}>
        <img
          className={`${styles.imgMobile}`}
          src="/assets/icon.svg"
          alt="logo"
        />
        <SearchbarMobile />
        <img
          className={`${styles.imgMobile}`}
          src="/assets/bars-solid.svg"
          alt="logo"
        />
      </div>
    </>
  );
};

export default Headermobile;
