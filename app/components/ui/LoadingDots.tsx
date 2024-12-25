import styles from './LoadingDots.module.scss';

export function LoadingDots() {
  return (
    <div className={styles.container}>
      <span className={styles.dot}></span>
      <span className={styles.dot}></span>
      <span className={styles.dot}></span>
    </div>
  );
}
