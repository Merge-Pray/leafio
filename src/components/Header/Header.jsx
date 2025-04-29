import styles from "./header.module.css";
import useUserStore from "../../hooks/userStore";

const Header = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  return (
    <div>
      <img className={`${styles.imgLogo}`} src="/assets/logo.svg" alt="logo" />
      <div>
        {currentUser ? (
          <p>Hallo</p>
        ) : (
          <img
            className={`${styles.imgLogo}`}
            src="/assets/user-solid.svg"
            alt="userlogo"
          />
        )}
      </div>
    </div>
  );
};
export default Header;
