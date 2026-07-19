import styles from "./Statistics.module.css";

function Statistics() {
  return (
    <section id="statistics" className={styles.statistics}>
      <h2>Our Impact</h2>

      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <h3>5000+</h3>
          <p>Students</p>
        </div>

        <div className={styles.statCard}>
          <h3>150+</h3>
          <p>Faculty</p>
        </div>

        <div className={styles.statCard}>
          <h3>98%</h3>
          <p>Attendance Accuracy</p>
        </div>

        <div className={styles.statCard}>
          <h3>50+</h3>
          <p>Partner Institutes</p>
        </div>
      </div>
    </section>
  );
}

export default Statistics;