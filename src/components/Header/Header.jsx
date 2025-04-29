import styles from "./header.module.css";
import useUserStore from "../../hooks/userStore";
import Searchbar from "../Searchbar/Searchbar";

const Header = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  return (
    <>
      <div className={`${styles.header}`}>
        <img
          className={`${styles.imgLogo}`}
          src="/assets/logo.svg"
          alt="logo"
        />
        <div>
          {currentUser ? (
            <p>Eingeloggt</p>
          ) : (
            <div className={`${styles.login}`}>
              {" "}
              <img
                className={`${styles.imgLogin}`}
                src="/assets/user-solid.svg"
                alt="userlogo"
              />
              <p className={`${styles.loginFont}`}>Log In</p>
            </div>
          )}
        </div>
      </div>
      <div className={`${styles.searchbar}`}>
        <Searchbar />
      </div>
    </>
  );
};
export default Header;
