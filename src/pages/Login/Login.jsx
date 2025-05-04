import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { NavLink } from "react-router";
import { auth, db } from "../../config/firebaseConfig";
import useUserStore from "../../hooks/userStore";
import styles from "./login.module.css";
import { useNavigate } from "react-router";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
        navigate("/");
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
          <h2 className={styles.headline}>
            You are currently logged in as: {currentUser.username}
          </h2>
        </div>
      ) : (
        <div className={styles.container}>
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <h2 className={styles.headline}>Login</h2>

            <div>
              <input
                className={styles.textInput}
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.passwordWrapper}>
              <input
                className={styles.textInputPw}
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className={styles.eyeIcon}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <img
                  src={
                    showPassword
                      ? "/assets/eye-closed.svg"
                      : "/assets/eye-open.svg"
                  }
                  alt={showPassword ? "Hide password" : "Show password"}
                  className={styles.eyeIconImage}
                />
              </span>
            </div>

            {errorMessage && (
              <p className={styles.errorMessage}>{errorMessage}</p>
            )}

            <button type="submit" className={styles.submitButton}>
              Login
            </button>
            <p className={styles.register}>
              <NavLink to="/register">New User? Register here</NavLink>
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
