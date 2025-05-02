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
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>

      <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          name="realName.first"
          id="firstName"
          value={formData.realName.first}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          name="realName.last"
          id="lastName"
          value={formData.realName.last}
          onChange={handleChange}
          required
        />
      </div>

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
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="city">City</label>
        <input
          type="text"
          name="address.city"
          id="city"
          value={formData.address.city}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="street">Street</label>
        <input
          type="text"
          name="address.street"
          id="street"
          value={formData.address.street}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="zip">ZIP Code</label>
        <input
          type="text"
          name="address.zip"
          id="zip"
          value={formData.address.zip}
          onChange={handleChange}
          required
        />
      </div>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
