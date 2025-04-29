import { useEffect, useState } from "react";
import useUserStore from "../../hooks/userStore";
import userData from "../../data/users.json";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [users, setUsers] = useState(userData);

  const [errorMessage, setErrorMessage] = useState("");

  const currentUser = useUserStore((state) => state.currentUser);
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const matchedUser = users.find(
      (user) => user.username === formData.username
    );

    if (!matchedUser) {
      setErrorMessage("! User not found");
    } else if (matchedUser.password !== formData.password) {
      setErrorMessage("! Wrong password");
    } else {
      setCurrentUser(matchedUser);
    }
  };

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div>
        <label htmlFor="username">Username</label>
        <input
          type="username"
          name="username"
          id="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
