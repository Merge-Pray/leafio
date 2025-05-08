import { NavLink, useNavigate } from "react-router";
import styles from "./userbar.module.css";
import useUserStore from "../../hooks/userStore";

const UserBar = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const navigate = useNavigate();

  const handleClick = (path) => {
    if (currentUser) {
      navigate(path);
    } else {
      alert("Bitte loggen Sie sich ein, um fortzufahren.");
    }
  };

  return (
    <div className={styles.wrapper}>
      {currentUser ? (
        <div>
          <NavLink
            className={`${styles.link} ${styles.messages}`}
            to={`/user/${currentUser.userID}/messages`}
          >
            <p>Nachrichten</p>
          </NavLink>
          <NavLink
            className={`${styles.link} ${styles.favourites}`}
            to={`/user/${currentUser.userID}#favourites`}
          >
            <p>Favoriten</p>
          </NavLink>
          <NavLink
            className={`${styles.link} ${styles.ads}`}
            to={`/user/${currentUser.userID}#ads`}
          >
            <p>Anzeigen</p>
          </NavLink>
        </div>
      ) : (
        <div>
          <div
            className={`${styles.link} ${styles.messages}`}
            onClick={() => handleClick("/login")}
          >
            <p>Nachrichten</p>
          </div>
          <div
            className={`${styles.link} ${styles.favourites}`}
            onClick={() => handleClick("/login")}
          >
            <p>Favoriten</p>
          </div>
          <div
            className={`${styles.link} ${styles.ads}`}
            onClick={() => handleClick("/login")}
          >
            <p>Anzeigen</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBar;
