import { useParams } from "react-router";

const User = () => {
  const { userID } = useParams();

  return <div>Username</div>;
};
export default User;
