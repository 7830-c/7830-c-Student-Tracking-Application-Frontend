import { Link } from "react-router-dom";
import styles from "./MyCohort.module.css";

function MyCohort() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <h1>My Internship Cohort</h1>

        <p className={styles.subtitle}>
          Welcome to your assigned internship cohort.
        </p>

        <div className={styles.infoGrid}>

          <div className={styles.infoBox}>
            <h3>Cohort Name</h3>
            <p>Java Full Stack - Batch 2026</p>
          </div>

          <div className={styles.infoBox}>
            <h3>Status</h3>
            <span className={styles.active}>ACTIVE</span>
          </div>

          <div className={styles.infoBox}>
            <h3>Start Date</h3>
            <p>01 Aug 2026</p>
          </div>

          <div className={styles.infoBox}>
            <h3>End Date</h3>
            <p>31 Oct 2026</p>
          </div>

          <div className={styles.infoBox}>
            <h3>Mentor</h3>
            <p>Rajesh Kumar</p>
          </div>

          <div className={styles.infoBox}>
            <h3>Meeting Platform</h3>
            <p>Google Meet</p>
          </div>

        </div>

        <div className={styles.buttons}>

          <Link
            to="/student/class-schedule"
            className={styles.button}
          >
            View Class Schedule
          </Link>

          <Link
            to="/student/mentor-details"
            className={styles.button}
          >
            Mentor Details
          </Link>

          <a
            href="https://meet.google.com/"
            target="_blank"
            rel="noreferrer"
            className={styles.meetButton}
          >
            Join Meeting
          </a>

        </div>

      </div>
    </div>
  );
}

export default MyCohort;