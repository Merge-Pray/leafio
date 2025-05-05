import { useParams } from "react-router";
import useUserStore from "../../hooks/userStore";
import styles from "./user.module.css";
import { useEffect, useState } from "react";
import EditUser from "./EditUser.jsx";
import { useNavigate } from "react-router";

const User = () => {
  const { userID } = useParams();
  const currentUser = useUserStore((state) => state.currentUser);
  const [editUserData, setEditUserData] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    }
  }, []);

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
          <h2 className={styles.headline}>Deine Daten</h2>
          <div className={styles.box}>
            <p>
              <span className={styles.userContent}>Emailadresse:</span>{" "}
              {`${currentUser.email}`}
            </p>
            <p>
              <span className={styles.userContent}>Name: </span>
              {`${currentUser.realName.first}`} {`${currentUser.realName.last}`}
            </p>
            <p>
              <span className={styles.userContent}>Adresse: </span>{" "}
              {`${currentUser.address.street}`}, {`${currentUser.address.zip}`}{" "}
              {`${currentUser.address.city}`}
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
              className={styles.submitButton}
            >
              Daten ändern
            </button>
            <h2 className={styles.headline}>Deine Anzeigen</h2>
          </div>
        </div>
      ) : (
        <EditUser setEditUserData={setEditUserData} />
      )}
    </>
  );
};
export default User;
