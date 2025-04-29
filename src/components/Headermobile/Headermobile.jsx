import styles from "./headermobile.module.css";

const Headermobile = () => {
  return (
    <div>
      <img
        className={`${styles.imgLogo}`}
        src="/assets/logo-sample.svg"
        alt="logo"
      />
    </div>
  );
};

export default Headermobile;
