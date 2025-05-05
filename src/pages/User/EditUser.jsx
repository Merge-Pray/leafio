import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebaseConfig";
import useUserStore from "../../hooks/userStore";
import styles from "./editUser.module.css";

const EditUser = () => {
  const currentUser = useUserStore((state) => state.currentUser);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: {
      city: "",
      street: "",
      zip: "",
    },
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || "",
        email: currentUser.email || "",
        address: {
          city: currentUser.address?.city || "",
          street: currentUser.address?.street || "",
          zip: currentUser.address?.zip || "",
        },
      });
    }
  }, [currentUser]);

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
      const userDocRef = doc(db, "users", currentUser.userID);
      await updateDoc(userDocRef, {
        username: formData.username,
        email: formData.email,
        address: formData.address,
      });

      setSuccessMessage("Profile updated successfully!");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Failed to update profile. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.headline}>Edit Profile</h1>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <label htmlFor="username" className={styles.label}>
          Username
        </label>
        <input
          className={styles.textInput}
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label htmlFor="email" className={styles.label}>
          Email
        </label>
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

        <label htmlFor="city" className={styles.label}>
          Stadt
        </label>
        <input
          className={styles.textInput}
          type="text"
          name="address.city"
          id="city"
          placeholder="City"
          value={formData.address.city}
          onChange={handleChange}
          required
        />

        <label htmlFor="street" className={styles.label}>
          Strasse
        </label>
        <input
          className={styles.textInput}
          type="text"
          name="address.street"
          id="street"
          placeholder="Street"
          value={formData.address.street}
          onChange={handleChange}
          required
        />

        <label htmlFor="zip" className={styles.label}>
          PLZ
        </label>
        <input
          className={styles.textInput}
          type="text"
          name="address.zip"
          id="zip"
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
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditUser;
