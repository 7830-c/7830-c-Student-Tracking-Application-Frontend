import { Link } from "react-router-dom";
import styles from "./MentorDetails.module.css";

function MentorDetails() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <div className={styles.header}>
          <h1>Mentor Details</h1>

          <Link
            to="/mentors"
            className={styles.backBtn}
          >
            ← Back
          </Link>
        </div>

        <div className={styles.profile}>

          <div className={styles.avatar}>
            RK
          </div>

          <div>
            <h2>Ravi Kumar</h2>
            <p>Senior Java Full Stack Trainer</p>
          </div>

        </div>

        <div className={styles.infoGrid}>

          <div className={styles.item}>
            <h3>Mentor ID</h3>
            <p>MT001</p>
          </div>

          <div className={styles.item}>
            <h3>Experience</h3>
            <p>8 Years</p>
          </div>

          <div className={styles.item}>
            <h3>Email</h3>
            <p>ravi@suretrust.in</p>
          </div>

          <div className={styles.item}>
            <h3>Phone</h3>
            <p>+91 9876543210</p>
          </div>

          <div className={styles.item}>
            <h3>Specialization</h3>
            <p>Java Full Stack</p>
          </div>

          <div className={styles.item}>
            <h3>Status</h3>
            <p className={styles.active}>Active</p>
          </div>

        </div>

        <div className={styles.section}>
          <h2>About Mentor</h2>

          <p>
            Ravi Kumar has over eight years of experience in Java,
            Spring Boot, React, MySQL, REST APIs and enterprise
            application development. He has mentored hundreds of
            students and guided multiple internship batches.
          </p>
        </div>

        <div className={styles.buttons}>

          <Link
            to="/edit-mentor"
            className={styles.editBtn}
          >
            Edit Mentor
          </Link>

          <Link
            to="/mentors"
            className={styles.cancelBtn}
          >
            Back
          </Link>

        </div>

      </div>
    </div>
  );
}

export default MentorDetails;