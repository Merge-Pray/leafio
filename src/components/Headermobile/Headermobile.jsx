import { useState } from "react";
import SearchbarMobile from "../SearchbarMobile/SearchbarMobile";
import styles from "./headermobile.module.css";
import { NavLink } from "react-router";
import useUserStore from "../../hooks/userStore";
import { categories } from "../../pages/PlaceAd/CategorySelector";

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
          src="/assets/burger_b.svg"

          alt="logo"
          onClick={toggleMenu}
        />
      </div>
      <div
        className={`${styles.toggleMenu} ${
          isMenuOpen ? styles.toggleMenuOpen : ""
        }`}
      >
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
            <div className={styles.categories}>
              <h3 className={styles.headline}>Kategorien</h3>
              <ul className={styles.categorylist}>
                {categories.map((category, index) => (
                  <NavLink
                    to={`/category/${encodeURIComponent(category.name)}`}
                    className={`${styles.linkPlant} ${styles.link}`}
                    key={index}
                    onClick={toggleMenu}
                  >
                    <li className={styles.categoryItem}>{category.name}</li>
                  </NavLink>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <>
            <p>Willkommen {`${currentUser.username}`}, du bist eingeloggt!</p>
            <div className={styles.user}>
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
                  className={`${styles.logout} ${styles.link}`}
                >
                  Logout
                </p>
              </NavLink>
            </div>
            <div className={`${styles.line} ${styles.user}`}>
              <NavLink
                className={`${styles.linkUser} ${styles.link}`}
                to={`/user/${currentUser.userID}`}
                onClick={toggleMenu}
              >
                <p>Zum Konto</p>
              </NavLink>
              <NavLink
                className={`${styles.link} ${styles.placead}`}
                to="/placead"
                onClick={toggleMenu}
              >
                <p>Anzeige erstellen</p>
              </NavLink>
              <NavLink
                className={`${styles.link} ${styles.favourites}`}
                to={`/user/${currentUser.userID}#favourites`}
                onClick={toggleMenu}
              >
                <p>Favoriten</p>
              </NavLink>
              <NavLink
                className={`${styles.link} ${styles.messages}`}
                to={`/user/${currentUser.userID}/messages`}
                onClick={toggleMenu}
              >
                <p>Nachrichten</p>
              </NavLink>
              <div className={styles.categories}>
                <h3 className={styles.headline}>Kategorien</h3>
                <ul className={styles.categorylist}>
                  {categories.map((category, index) => (
                    <NavLink
                      to={`/category/${encodeURIComponent(category.name)}`}
                      className={`${styles.linkPlant} ${styles.link}`}
                      key={index}
                      onClick={toggleMenu}
                    >
                      <li className={styles.categoryItem}>{category.name}</li>
                    </NavLink>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Headermobile;
