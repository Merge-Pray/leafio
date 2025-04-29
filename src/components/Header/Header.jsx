import styles from "./header.module.css";

const Header = () => {
  return (
    <div>
      <img className={`${styles.imgLogo}`} src="/assets/logo.svg" alt="logo" />
      <div>
        <img
          className={`${styles.imgLogo}`}
          src="/assets/user-solid.svg"
          alt="userlogo"
        />
      </div>
    </div>
  );
};
export default Header;
