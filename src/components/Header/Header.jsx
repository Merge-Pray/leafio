import styles from "./header.module.css";
import useUserStore from "../../hooks/userStore";
import Searchbar from "../Searchbar/Searchbar";
import { NavLink } from "react-router";

const Header = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <>
      <div className={`${styles.header}`}>
        <NavLink to="/">
          {" "}
          <img
            className={`${styles.imgLogo}`}
            src="/assets/logo.svg"
            alt="logo"
          />
        </NavLink>

        <div>
          {currentUser ? (
            <div>
              <p>Willkommen {`${currentUser.username}`}, du bist eingeloggt!</p>
              <div className={`${styles.nav}`}>
                {" "}
                <NavLink to={`/user/${currentUser.userID}`}>
                  <p>Zum Konto</p>
                </NavLink>
                <NavLink to={`/`}>
                  <button
                    onClick={handleLogout}
                    className={styles.logoutButton}
                  >
                    Logout
                  </button>
                </NavLink>
              </div>
            </div>
          ) : (
            <div>
              {" "}
              <NavLink className={`${styles.login}`} to="/login">
                <img
                  className={`${styles.imgLogin}`}
                  src="/assets/user-solid.svg"
                  alt="userlogo"
                />

                <p className={`${styles.loginFont}`}>Log In</p>
              </NavLink>
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
