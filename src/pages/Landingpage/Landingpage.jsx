import Banner from "../../components/Banner/Banner";
import CategoryBar from "../../components/CategoryBar/CategoryBar";
import CategoryListing from "../../components/CategoryListing/CategoryListing";
import ProductStart from "../../components/ProductsStart/ProductsStart";
import { categories } from "../PlaceAd/CategorySelector";
// import styles from "./landingpage.module.css";

const Landingpage = () => {
  return (
    <div>
      <Banner />
      {/* <div className={styles.title}>
      <h2>Willkommen bei Leafio!</h2>
      </div> */}
      <CategoryBar />
      <CategoryListing categories={categories} />
      <ProductStart />
    </div>
  );
};
export default Landingpage;
