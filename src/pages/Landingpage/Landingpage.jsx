import Banner from "../../components/Banner/Banner";
import CategoryBar from "../../components/CategoryBar/CategoryBar";

import ProductStart from "../../components/ProductsStart/ProductsStart";
import CategoryListing from "../../components/CategoryListing/CategoryListing";
import { categories } from "../PlaceAd/CategorySelector";
import styles from "./landingpage.module.css";
import UserBar from "../../components/UserBar/UserBar";

const Landingpage = () => {
  return (
    <div>
      <Banner />
      <CategoryBar />
      <div className={styles.contentWrapper}>
  <div className={styles.leftColumn}>
  <UserBar />
    <CategoryListing categories={categories} />
    
  </div>
  <ProductStart />
</div>
    </div>
  );
};

export default Landingpage;
