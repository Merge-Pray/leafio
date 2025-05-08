import { NavLink, useNavigate } from "react-router";
import styles from "./userbar.module.css";
import useUserStore from "../../hooks/userStore";
import { useState } from "react";

const UserBar = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const handleClick = (path) => {
    if (currentUser) {
      navigate(path);
    } else {
      setShowPopup(true);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.userItemsContainer}>
        {currentUser ? (
          <>
            <NavLink
              className={`${styles.link} ${styles.messages}`}
              to={`/user/${currentUser.userID}/messages`}
            >
              <p className={styles.label}>Nachrichten</p>
            </NavLink>
            <NavLink
              className={`${styles.link} ${styles.favourites}`}
              to={`/user/${currentUser.userID}#favourites`}
            >
              <p className={styles.label}>Meine Favoriten</p>
            </NavLink>
            <NavLink
              className={`${styles.link} ${styles.ads}`}
              to={`/user/${currentUser.userID}#ads`}
            >
              <p className={styles.label}>Meine Anzeigen</p>
            </NavLink>
            <NavLink
              className={`${styles.link} ${styles.placead}`}
              to={`/placeAd`}
            >
              <p className={styles.label}>Neue Anzeige</p>
            </NavLink>
          </>
        ) : (
          <>
            <div
              className={`${styles.link} ${styles.messages}`}
              onClick={() => handleClick("/login")}
            >
              <p className={styles.label}>Nachrichten</p>
            </div>
            <div
              className={`${styles.link} ${styles.favourites}`}
              onClick={() => handleClick("/login")}
            >
              <p className={styles.label}>Favoriten</p>
            </div>
            <div
              className={`${styles.link} ${styles.ads}`}
              onClick={() => handleClick("/login")}
            >
              <p className={styles.label}>Anzeigen</p>
            </div>
            <div
              className={`${styles.link} ${styles.placead}`}
              onClick={() => handleClick("/login")}
            >
              <p className={styles.label}>Neue Anzeige</p>
            </div>
          </>
        )}
      </div>

      {showPopup && (
        <div
          className={styles.popupOverlay}
          onClick={() => setShowPopup(false)}
        >
          <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
            <p>Bitte logge Dich ein, um fortzufahren.</p>
            <div className={styles.popupButtons}>
              <button onClick={() => navigate("/login")}>Zum Login</button>
              <button onClick={() => setShowPopup(false)}>Jetzt nicht</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBar;
