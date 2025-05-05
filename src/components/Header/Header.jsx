import styles from "./header.module.css";
import useUserStore from "../../hooks/userStore";
import Searchbar from "../Searchbar/Searchbar";
import { NavLink } from "react-router";
import { auth, db } from "../../config/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

const Header = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  const handleLogout = async () => {
    try {
      const user = auth.currentUser;

      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { loggedIn: false });
      }

      await signOut(auth);
      setCurrentUser(null);
      console.log("User successfully logged out.");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
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
              <p className={styles.loginFont}>
                Willkommen{" "}
                <span className={styles.user}>{`${currentUser.username}`}</span>{" "}
                , du bist eingeloggt!
              </p>
              <div className={`${styles.nav}`}>
                {" "}
                <NavLink
                  className={styles.link}
                  to={`/user/${currentUser.userID}`}
                >
                  <p className={styles.loginFont}>Zum Konto</p>
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

                <p className={`${styles.loginFont}`}>Login</p>
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
