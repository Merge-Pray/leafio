import Banner from "../../components/Banner/Banner";
import CategoryBar from "../../components/CategoryBar/CategoryBar";
// import styles from "./landingpage.module.css";

const Landingpage = () => {
  return (
    <div>
      <Banner/>
      {/* <div className={styles.title}>
      <h2>Willkommen bei Leafio!</h2>
      </div> */}
      <CategoryBar/>
    </div>
  );
};
export default Landingpage;
