import { NavLink, useLocation, useParams } from "react-router";
import useUserStore from "../../hooks/userStore";
import styles from "./user.module.css";
import { useEffect, useState } from "react";
import EditUser from "./EditUser.jsx";
import { useNavigate } from "react-router";
import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

const User = () => {
  const { userID } = useParams();
  const currentUser = useUserStore((state) => state.currentUser);
  const [userAds, setUserAds] = useState([]);
  const [favorites, setFavorites] = useState([]); // State für Favoriten
  const [error, setError] = useState(null);
  const [editUserData, setEditUserData] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.history.scrollRestoration = "manual";

    if (location.hash && favorites.length > 0) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          const yOffset = -80;
          const y =
            el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }, 100);
      }
    }
  }, [location.hash, favorites]);

  useEffect(() => {
    if (!currentUser) {
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } else {
      fetchUserAds();
      fetchFavorites();
    }
  }, []);

  const fetchUserAds = async () => {
    try {
      const adsRef = collection(db, "allads");
      const q = query(adsRef, where("userID", "==", currentUser.userID));
      const snapshot = await getDocs(q);
      const ads = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserAds(ads);
    } catch (err) {
      console.error(err);
      setError("Fehler beim Laden der Anzeigen.");
    }
  };

  const fetchFavorites = async () => {
    try {
      const userRef = doc(db, "users", currentUser.userID);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const likedAds = userData.likedAds || [];

        if (likedAds.length === 0) {
          setFavorites([]);
          return;
        }

        const adsRef = collection(db, "allads");
        const q = query(adsRef, where("__name__", "in", likedAds));
        const snapshot = await getDocs(q);

        const favoriteAds = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFavorites(favoriteAds);
      }
    } catch (err) {
      console.error(err);
      setError("Fehler beim Laden der Favoriten.");
    }
  };

  const deleteAd = async (adId) => {
    const confirmDelete = window.confirm(
      "Möchten Sie diese Anzeige wirklich löschen?"
    );
    if (!confirmDelete) return;
    try {
      const adRef = doc(db, "allads", adId);
      await deleteDoc(adRef);
      const userRef = doc(db, "users", currentUser.userID);
      await updateDoc(userRef, { ownAds: arrayRemove(adId) });
      setUserAds((prev) => prev.filter((ad) => ad.id !== adId));
      navigate(`/user/${currentUser.userID}`);
    } catch (error) {
      console.error(error);
      setError("Fehler beim Löschen der Anzeige.");
    }
  };

  if (!currentUser) {
    return (
      <div className={styles.container}>
        <h1 className={styles.errorCode}>Du musst dich einloggen!</h1>
        <h2 className={styles.headline}>
          Der User konnte nicht gefunden werden.
        </h2>
        <p className={styles.subtext}>
          Du wirst automatisch zum Login weitergeleitet...
        </p>
        <button
          className={styles.backButton}
          onClick={() => navigate("/login")}
        >
          Zum Login
        </button>
      </div>
    );
  }

  return (
    <>
      {!editUserData && currentUser !== null ? (
        <div className={styles.container}>
          <h1 className={styles.headline}>
            Willkommen{" "}
            <span className={styles.user}>{`${currentUser.username}`}</span> in
            deinem Benutzerkonto!
          </h1>
          <section className={styles.section}>
            <h2 className={styles.headline}>Deine Daten</h2>
            <div className={styles.box}>
              <p>
                <span className={styles.userContent}>Emailadresse:</span>{" "}
                {`${currentUser.email}`}
              </p>
              <p>
                <span className={styles.userContent}>Name: </span>
                {`${currentUser.realName.first}`}{" "}
                {`${currentUser.realName.last}`}
              </p>
              <p>
                <span className={styles.userContent}>Adresse: </span>{" "}
                {`${currentUser.address.street}`},{" "}
                {`${currentUser.address.zip}`} {`${currentUser.address.city}`}
              </p>
              <p>
                {" "}
                <span className={styles.userContent}>Mitglied seit: </span>
                {new Date(
                  currentUser.createdAt.seconds * 1000 +
                    Math.floor(currentUser.createdAt.nanoseconds / 1_000_000)
                ).toLocaleString()}
              </p>
              <button
                type="submit"
                onClick={() => setEditUserData(true)}
                className={`${styles.submitButton} ${styles.editButton}`}
              >
                Daten ändern
              </button>
            </div>{" "}
          </section>
          <section className={styles.section}>
            <NavLink
              to={`/user/${currentUser.userID}/messages`}
              className={`${styles.submitButton} ${styles.editButton}`}
            >
              Nachrichten anzeigen
            </NavLink>
          </section>
          <section className={styles.section} id="ads">
            <h2 className={styles.headline}>Deine Anzeigen</h2>
            <NavLink
              to="/placead"
              className={`${styles.submitButton} ${styles.placeAdButton}`}
            >
              Neue Anzeige erstellen
            </NavLink>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <div className={styles.userAds}>
              {userAds.length === 0 ? (
                <p className={styles.errormessage}>Keine Anzeigen gefunden.</p>
              ) : (
                userAds.map((ad) => (
                  <div key={ad.id} className={styles.productList}>
                    <NavLink
                      to={`/product/${ad.id}`}
                      className={styles.productItem}
                    >
                      <img src={ad.images?.[0]} alt={ad.title} />
                      <div className={styles.productInfo}>
                        <h3>{ad.title}</h3>
                        <p>{ad.description?.slice(0, 80)}...</p>
                        <p>
                          <strong>{ad.price}</strong>
                        </p>
                        <p className={styles.createdAt}>Online seit:</p>
                        <div className={styles.createdAt}>
                          {ad.createdAt?.toDate().toLocaleDateString("de-DE", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </NavLink>
                    <div className={styles.adButtons}>
                      <NavLink
                        to={`/editad/${ad.id}`}
                        className={`${styles.submitButton} ${styles.adButton}`}
                      >
                        Anzeige bearbeiten
                      </NavLink>
                      <button
                        onClick={() => deleteAd(ad.id)}
                        className={`${styles.submitButton} ${styles.adButton}`}
                      >
                        {" "}
                        Anzeige löschen
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
          <section className={styles.section} id="favourites">
            <h2 className={styles.headline}>Deine Favoriten</h2>
            <div className={styles.userAds}>
              {favorites.length === 0 ? (
                <p className={styles.errormessage}>Keine Favoriten gefunden.</p>
              ) : (
                favorites.map((ad) => (
                  <div key={ad.id} className={styles.productList}>
                    <NavLink
                      to={`/product/${ad.id}`}
                      className={styles.productItem}
                    >
                      <img src={ad.images?.[0]} alt={ad.title} />
                      <div className={styles.productInfo}>
                        <h3>{ad.title}</h3>
                        <p>{ad.description?.slice(0, 80)}...</p>
                        <p>
                          <strong>{ad.price}</strong>
                        </p>
                        <p className={styles.createdAt}>Online seit:</p>
                        <div className={styles.createdAt}>
                          {ad.createdAt?.toDate().toLocaleDateString("de-DE", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </NavLink>
                  </div>
                ))
              )}
            </div>{" "}
          </section>
        </div>
      ) : (
        <EditUser setEditUserData={setEditUserData} />
      )}
    </>
  );
};
export default User;
