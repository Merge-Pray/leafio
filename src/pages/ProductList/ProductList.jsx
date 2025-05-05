import { useParams } from "react-router";
import CategoryListing from "../../components/CategoryListing/CategoryListing";
import styles from "./productlist.module.css";

const ProductList = () => {
  return (
    <div>
      <CategoryListing />
    </div>
  );
};

export default ProductList;
