import { useParams } from "react-router";
import useUserStore from "../../hooks/userStore";

const User = () => {
  const { userID } = useParams();
  const currentUser = useUserStore((state) => state.currentUser);

  return (
    <>
      {currentUser !== null ? (
        <p>Willkommen {`${currentUser.username}`} in deinem Benutzerkonto!</p>
      ) : (
        <p>Du musst dich einloggen!</p>
      )}
    </>
  );
};
export default User;
