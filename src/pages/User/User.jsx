import { useParams } from "react-router";
import useUserStore from "../../hooks/userStore";
import styles from "./user.module.css";
import { useState } from "react";
import EditUser from "./EditUser.jsx";

const User = () => {
  const { userID } = useParams();
  const currentUser = useUserStore((state) => state.currentUser);
  const [editUserData, setEditUserData] = useState(false);

  if (!currentUser) {
    return <p>Du musst dich einloggen!</p>;
  }

  return (
    <>
      {!editUserData && currentUser !== null ? (
        <div className={styles.container}>
          <h1 className={styles.headline}>
            Willkommen {`${currentUser.username}`} in deinem Benutzerkonto!
          </h1>
          <h2 className={styles.headline}>Deine Daten</h2>
          <div>
            <p>{`${currentUser.email}`}</p>
            <p>
              {`${currentUser.realName.first}`} {`${currentUser.realName.last}`}
            </p>
            <p>
              Deine Adresse {`${currentUser.address.street}`}{" "}
              {`${currentUser.address.zip}`}
              {`${currentUser.address.city}`}
            </p>

            <h2 className={styles.headline}>Deine Anzeigen</h2>
            <button
              type="submit"
              onClick={() => setEditUserData(true)}
              className={styles.submitButton}
            >
              Daten ändern
            </button>
          </div>
        </div>
      ) : (
        <EditUser />
      )}
    </>
  );
};
export default User;
