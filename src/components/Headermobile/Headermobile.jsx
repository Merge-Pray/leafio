import { useState } from "react";
import SearchbarMobile from "../SearchbarMobile/SearchbarMobile";
import styles from "./headermobile.module.css";
import { NavLink } from "react-router";
import useUserStore from "../../hooks/userStore";

const Headermobile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentUser = useUserStore((state) => state.currentUser);
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  const handleLogout = () => {
    setCurrentUser(null);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      <div className={`${styles.headerMobile}`}>
        <NavLink to="/">
          <img
            className={`${styles.imgMobile}`}
            src="/assets/icon.svg"
            alt="logo"
          />
        </NavLink>
        <SearchbarMobile />
        <img
          className={`${styles.imgMobile} ${styles.imgNav}`}
          src="/assets/burger_w.svg"
          alt="logo"
          onClick={toggleMenu}
        />
      </div>
      {isMenuOpen && (
        <div className={styles.toggleMenu}>
          {" "}
          <NavLink
            className={`${styles.linkHome} ${styles.link}`}
            to="/"
            onClick={toggleMenu}
          >
            Home
          </NavLink>
          {currentUser === null ? (
            <NavLink
              className={`${styles.linkUser} ${styles.link}`}
              to="/login"
              onClick={toggleMenu}
            >
              Login
            </NavLink>
          ) : (
            <>
              <p>Willkommen {`${currentUser.username}`}, du bist eingeloggt!</p>
              <NavLink to={`/`}>
                <p
                  onClick={handleLogout}
                  className={`${styles.linkUser} ${styles.link} ${styles.logoutButton}`}
                >
                  Logout
                </p>{" "}
              </NavLink>
              <NavLink
                className={styles.link}
                to={`/user/${currentUser.userID}`}
                onClick={toggleMenu}
              >
                <p>Zum Konto</p>
              </NavLink>{" "}
              <NavLink
                className={styles.link}
                to="/placead"
                onClick={toggleMenu}
              >
                Anzeige erstellen
              </NavLink>{" "}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Headermobile;
