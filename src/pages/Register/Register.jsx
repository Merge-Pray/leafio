import styles from "./register.module.css";
import { useState } from "react";
import { auth, db } from "../../config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { query, where, collection, getDocs } from "firebase/firestore";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    realName: {
      first: "",
      last: "",
    },
    address: {
      city: "",
      street: "",
      zip: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }

      const usersRef = collection(db, "users");

      const usernameQuery = query(
        usersRef,
        where("username", "==", formData.username)
      );
      const usernameSnapshot = await getDocs(usernameQuery);
      if (!usernameSnapshot.empty) {
        setErrorMessage("Username is already taken.");
        return;
      }

      const emailQuery = query(usersRef, where("email", "==", formData.email));
      const emailSnapshot = await getDocs(emailQuery);
      if (!emailSnapshot.empty) {
        setErrorMessage("Email is already registered.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username: formData.username,
        realName: formData.realName,
        email: formData.email,
        address: formData.address,
        userID: user.uid,
        ownAds: [],
        likedAds: [],
        createdAt: serverTimestamp(),
      });

      setSuccessMessage("User registered successfully!");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage("");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.headline}>Registration</h1>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <input
          className={styles.textInput}
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          className={styles.textInput}
          type="text"
          name="realName.first"
          placeholder="First Name"
          value={formData.realName.first}
          onChange={handleChange}
          required
        />
        <input
          className={styles.textInput}
          type="text"
          name="realName.last"
          placeholder="Last Name"
          value={formData.realName.last}
          onChange={handleChange}
          required
        />
        <input
          className={styles.textInput}
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
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
                showPassword ? "/assets/eye-closed.svg" : "/assets/eye-open.svg"
              }
              alt={showPassword ? "Hide password" : "Show password"}
              className={styles.eyeIconImage}
            />
          </span>
        </div>
        <div className={styles.passwordWrapper}>
          <input
            className={styles.textInputPw}
            type={showPassword2 ? "text" : "password"}
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <span
            className={styles.eyeIcon}
            onClick={() => setShowPassword2((prev) => !prev)}
          >
            <img
              src={
                showPassword2
                  ? "/assets/eye-closed.svg"
                  : "/assets/eye-open.svg"
              }
              alt={showPassword2 ? "Hide password" : "Show password"}
              className={styles.eyeIconImage}
            />
          </span>
        </div>
        <input
          className={styles.textInput}
          type="text"
          name="address.city"
          placeholder="City"
          value={formData.address.city}
          onChange={handleChange}
          required
        />
        <input
          className={styles.textInput}
          type="text"
          name="address.street"
          placeholder="Street"
          value={formData.address.street}
          onChange={handleChange}
          required
        />
        <input
          className={styles.textInput}
          type="text"
          name="address.zip"
          placeholder="ZIP Code"
          value={formData.address.zip}
          onChange={handleChange}
          required
        />

        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        {successMessage && (
          <p className={styles.successMessage}>{successMessage}</p>
        )}

        <button type="submit" className={styles.submitButton}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
