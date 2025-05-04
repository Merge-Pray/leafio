import { useParams } from "react-router";
import useUserStore from "../../hooks/userStore";

const User = () => {
  const { userID } = useParams();
  const currentUser = useUserStore((state) => state.currentUser);

  return (
    <>
      {currentUser !== null ? (
        <div>
          <h1>
            Willkommen {`${currentUser.username}`} in deinem Benutzerkonto!
          </h1>
          <h2>Deine Daten</h2>
          <p>Deine Adresse</p>
          <h2>Deine Anzeigen</h2>
        </div>
      ) : (
        <p>Du musst dich einloggen!</p>
      )}
    </>
  );
};
export default User;
