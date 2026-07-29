import { Link } from "react-router-dom";
import styles from "./CourseDetails.module.css";

function CourseDetails() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <div className={styles.header}>
          <h1>Course Details</h1>

          <Link to="/courses" className={styles.backBtn}>
            ← Back
          </Link>
        </div>

        <div className={styles.infoGrid}>

          <div className={styles.item}>
            <h3>Course Name</h3>
            <p>Java Full Stack Development</p>
          </div>

          <div className={styles.item}>
            <h3>Duration</h3>
            <p>6 Months</p>
          </div>

          <div className={styles.item}>
            <h3>Mentor</h3>
            <p>Ravi Kumar</p>
          </div>

          <div className={styles.item}>
            <h3>Total Students</h3>
            <p>120</p>
          </div>

          <div className={styles.item}>
            <h3>Status</h3>
            <p className={styles.active}>Active</p>
          </div>

          <div className={styles.item}>
            <h3>Start Date</h3>
            <p>01 August 2026</p>
          </div>

        </div>

        <div className={styles.section}>
          <h2>Description</h2>

          <p>
            This course covers Java Programming, Spring Boot,
            React JS, MySQL, REST APIs, Git, Deployment,
            and complete Full Stack Development with
            real-time projects.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Course Modules</h2>

          <ul>
            <li>Java Fundamentals</li>
            <li>Advanced Java</li>
            <li>Spring Boot</li>
            <li>React JS</li>
            <li>MySQL Database</li>
            <li>REST API Development</li>
            <li>Mini Project</li>
            <li>Capstone Project</li>
          </ul>
        </div>

        <div className={styles.buttons}>

          <Link
            to="/edit-course"
            className={styles.editBtn}
          >
            Edit Course
          </Link>

          <Link
            to="/courses"
            className={styles.cancelBtn}
          >
            Back to Courses
          </Link>

        </div>

      </div>
    </div>
  );
}

export default CourseDetails;