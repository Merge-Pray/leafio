import Banner from "../../components/Banner/Banner";
import styles from "./landingpage.module.css";

const Landingpage = () => {
  return (
    <div>
      <Banner/>
      <div className={styles.title}>
      <h2>Willkommen bei Leafio!</h2>
      </div>
    </div>
  );
};
export default Landingpage;
