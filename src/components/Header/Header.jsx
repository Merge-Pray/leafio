import React, { useEffect, useState } from "react";
import styles from "./header.module.css";
import useUserStore from "../../hooks/userStore";
import Searchbar from "../Searchbar/Searchbar";
import { NavLink } from "react-router";
import { auth, db } from "../../config/firebaseConfig";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { signOut } from "firebase/auth";

const Header = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

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

  useEffect(() => {
    if (!currentUser) return;

    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      where("recipientID", "==", currentUser.userID),
      where("isRead", "==", false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnreadMessagesCount(snapshot.size);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <>
      <div className={`${styles.header}`}>
        <NavLink to="/">
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
                <NavLink
                  className={styles.link}
                  to={`/user/${currentUser.userID}`}
                >
                  <p className={styles.loginFont}>Zum Konto</p>
                </NavLink>
                <NavLink
                  className={`${styles.link} ${styles.messages}`}
                  to={`/user/${currentUser.userID}/messages`}
                >
                  {unreadMessagesCount > 0 && (
                    <p className={`${styles.login} ${styles.messages}`}>
                      Neue Nachrichten
                      <span className={styles.unreadBadge}>
                        {unreadMessagesCount}
                      </span>
                    </p>
                  )}
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
