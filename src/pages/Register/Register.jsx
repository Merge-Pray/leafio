import styles from "./register.module.css";
import { useState } from "react";
import { auth, db } from "../../config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { query, where, collection, getDocs } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
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
      const usersRef = collection(db, "users");

      const usernameQuery = query(
        usersRef,
        where("username", "==", formData.username)
      );
      const usernameSnapshot = await getDocs(usernameQuery);

      if (!usernameSnapshot.empty) {
        setErrorMessage(
          "Username is already taken. Please choose another one."
        );
        return;
      }

      const emailQuery = query(usersRef, where("email", "==", formData.email));
      const emailSnapshot = await getDocs(emailQuery);

      if (!emailSnapshot.empty) {
        setErrorMessage(
          "Email is already registered. Please use another email."
        );
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      const userID = uuidv4();

      await setDoc(doc(db, "users", user.uid), {
        username: formData.username,
        realName: formData.realName,
        email: formData.email,
        address: formData.address,
        userID: userID,
        ownAds: [],
        likedAds: [],
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
        <input
          className={styles.textInput}
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
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
