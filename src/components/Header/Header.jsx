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
  const [showPopup, setShowPopup] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogoutClick = () => {
    setConfirmLogout(true);
    setShowPopup(true);
  };

  const handleLogout = async () => {
    try {
      const user = auth.currentUser;

      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { loggedIn: false });
      }

      await signOut(auth);
      useUserStore.getState().clearUser();
      setConfirmLogout(false);

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
            <div className={`${styles.nav}`}>
              <NavLink
                className={styles.link}
                to={`/user/${currentUser.userID}`}
              >
                <p className={styles.loginFont}>
                  Willkommen{" "}
                  <span
                    className={styles.user}
                  >{`${currentUser.username}`}</span>{" "}
                </p>

                <img
                  className={`${styles.imgUser}`}
                  src="/assets/usericon.svg"
                  alt="userlogo"
                />
              </NavLink>
              <NavLink
                className={`${styles.link} ${styles.messages} ${
                  unreadMessagesCount > 0 ? styles.hasMessages : ""
                }`}
                to={`/user/${currentUser.userID}/messages`}
              >
                <img
                  className={`${styles.imgMessage}`}
                  src={
                    unreadMessagesCount > 0
                      ? "/assets/message_w.svg"
                      : "/assets/message.svg"
                  }
                  alt="nachrichtenfeld"
                />
                {unreadMessagesCount > 0 && (
                  <p>
                    <span className={styles.unreadBadge}>
                      {unreadMessagesCount}
                    </span>
                  </p>
                )}
              </NavLink>
              <NavLink to={`/`}>
                <button
                  onClick={handleLogoutClick}
                  className={styles.logoutButton}
                >
                  Logout
                </button>
              </NavLink>
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

      {confirmLogout && (
        <div
          className={styles.popupOverlay}
          onClick={() => setConfirmLogout(false)}
        >
          <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
            <p>Möchtest du dich wirklich ausloggen?</p>
            <div className={styles.popupButtons}>
              <button onClick={handleLogout}>Ja</button>
              <button onClick={() => setConfirmLogout(false)}>Abbrechen</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
