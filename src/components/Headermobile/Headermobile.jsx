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
          className={`${styles.imgMobile} ${styles.imgNav}
          ${isMenuOpen ? styles.imgNavOpen : ""}`}
          src="/assets/burger_w.svg"
          alt="logo"
          onClick={toggleMenu}
        />
      </div>
      {isMenuOpen && (
        <div className={styles.toggleMenu}>
          {" "}
          {currentUser === null ? (
            <>
              <NavLink
                className={`${styles.linkHome} ${styles.link}`}
                to="/"
                onClick={toggleMenu}
              >
                Home
              </NavLink>
              <NavLink
                className={`${styles.linkUser} ${styles.link}`}
                to="/login"
                onClick={toggleMenu}
              >
                Login
              </NavLink>
            </>
          ) : (
            <>
              <p>Willkommen {`${currentUser.username}`}, du bist eingeloggt!</p>
              <NavLink
                className={`${styles.linkHome} ${styles.link}`}
                to="/"
                onClick={toggleMenu}
              >
                Home
              </NavLink>
              <NavLink to={`/`}>
                <p
                  onClick={handleLogout}
                  className={`${styles.linkUser} ${styles.link}`}
                >
                  Logout
                </p>{" "}
              </NavLink>
              <div className={`${styles.line} ${styles.user}`}>
                {" "}
                <NavLink
                  className={`${styles.linkUser} ${styles.link}`}
                  to={`/user/${currentUser.userID}`}
                  onClick={toggleMenu}
                >
                  <p>Zum Konto</p>
                </NavLink>{" "}
                <NavLink
                  className={`${styles.link} ${styles.placead}`}
                  to="/placead"
                  onClick={toggleMenu}
                >
                  <p>Anzeige erstellen</p>
                </NavLink>{" "}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Headermobile;
