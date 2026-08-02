import { useNavigate } from "react-router-dom";
import styles from "./CourseDetails.module.css";

function CourseDetails() {

  const navigate = useNavigate();

  return (
    <div className={styles.courseDetailsPage}>
      <div className={styles.container}>

        <h1>Java Full Stack Development</h1>

        <p className={styles.description}>
          This internship program provides hands-on training in Java,
          Spring Boot, React, MySQL and modern web technologies.
        </p>

        <div className={styles.infoGrid}>

          <div>
            <h3>Course Code</h3>
            <p>JFS001</p>
          </div>

          <div>
            <h3>Domain</h3>
            <p>Software Development</p>
          </div>

          <div>
            <h3>Duration</h3>
            <p>12 Weeks</p>
          </div>

          <div>
            <h3>Difficulty</h3>
            <p>Beginner</p>
          </div>

        </div>

        <div className={styles.section}>
          <h2>Prerequisites</h2>

          <ul>
            <li>Basic Programming Knowledge</li>
            <li>Computer Fundamentals</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>Curriculum</h2>

          <ul>
            <li>Module 1 - Java Basics</li>
            <li>Module 2 - Spring Boot</li>
            <li>Module 3 - React</li>
            <li>Module 4 - MySQL</li>
          </ul>
        </div>

        <button
          className={styles.applyBtn}
          onClick={() => navigate("/student/application-success")}
        >
          Apply for this Course
        </button>

      </div>
    </div>
  );
}

export default CourseDetails;