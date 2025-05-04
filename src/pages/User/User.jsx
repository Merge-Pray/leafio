import { useParams } from "react-router";
import useUserStore from "../../hooks/userStore";
import styles from "./user.module.css";

const User = () => {
  const { userID } = useParams();
  const currentUser = useUserStore((state) => state.currentUser);

  return (
    <>
      {currentUser !== null ? (
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
            <button>Daten ändern</button>
          </div>
        </div>
      ) : (
        <p>Du musst dich einloggen!</p>
      )}
    </>
  );
};
export default User;
