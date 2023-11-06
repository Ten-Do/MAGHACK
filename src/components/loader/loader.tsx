import styles from "./styles.module.css";

export const Loader = () => (
  <div className={styles.overlay} onClick={(e) => e.stopPropagation()}>
    <span className={styles.loader}></span>
  </div>
);
