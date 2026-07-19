import styles from "./Features.module.css";

function Features() {
  return (
    <section id="features" className={styles.features}>
      <h2>Our Features</h2>

      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>📅 Attendance</h3>
          <p>Track daily attendance with accurate login and logout records.</p>
        </div>

        <div className={styles.card}>
          <h3>🎓 Student Management</h3>
          <p>Manage student information and academic records easily.</p>
        </div>

        <div className={styles.card}>
          <h3>📊 Analytics</h3>
          <p>View attendance reports and performance insights instantly.</p>
        </div>

        <div className={styles.card}>
          <h3>🔒 Secure Login</h3>
          <p>LinkedIn authentication with additional password security.</p>
        </div>
      </div>
    </section>
  );
}

export default Features;