import { useState } from "react";
import { auth, db } from "../../config/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import useUserStore from "../../hooks/userStore";
import { NavLink } from "react-router";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const setCurrentUser = useUserStore((state) => state.setCurrentUser);
  const currentUser = useUserStore((state) => state.currentUser);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setCurrentUser(userData);
        setErrorMessage("");
      } else {
        setErrorMessage("User data not found in the database.");
      }
    } catch (error) {
      setErrorMessage("Invalid email or password.");
    }
  };

  return (
    <div>
      {currentUser ? (
        <div>
          <h2>You are currently logged in as: {currentUser.username}</h2>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>

          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? "text" : "password"} // Toggle between "text" and "password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword((prev) => !prev)} // Toggle password visibility
              />
              Show Password
            </label>
          </div>

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

          <button type="submit">Login</button>
          <p>
            <NavLink to="/register">New User? Register</NavLink>
          </p>
        </form>
      )}
    </div>
  );
};

export default Login;
