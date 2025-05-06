import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./searchbarMobile.module.css";

const SearchbarMobile = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    const params = new URLSearchParams();
    params.set("query", searchTerm.trim());
    navigate(`/products?${params.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchBarContainer}>
        <img
          className={styles.imgSearchbar}
          src="/assets/magnifying-glass-solid.svg"
          alt="search"
          onClick={handleSearch}
          style={{ cursor: "pointer" }}
        />
        <input
          className={styles.searchbarMobile}
          type="search"
          id="search"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export default SearchbarMobile;