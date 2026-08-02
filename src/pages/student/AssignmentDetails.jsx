import { Link } from "react-router-dom";
import styles from "./AssignmentDetails.module.css";

function AssignmentDetails() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <h1>Java OOP Assignment</h1>

        <p className={styles.subtitle}>
          Read the assignment instructions carefully before submitting your
          assignment.
        </p>

        <div className={styles.section}>
          <h3>Assignment Description</h3>

          <p>
            Develop a Java application demonstrating the core Object-Oriented
            Programming concepts including Encapsulation, Inheritance,
            Polymorphism, and Abstraction.
          </p>
        </div>

        <div className={styles.section}>
          <h3>Requirements</h3>

          <ul>
            <li>Create at least 5 Java classes.</li>
            <li>Use inheritance and interfaces.</li>
            <li>Implement exception handling.</li>
            <li>Push your project to GitHub.</li>
            <li>Upload the ZIP file before the deadline.</li>
          </ul>
        </div>

        <div className={styles.info}>

          <div>
            <strong>Due Date</strong>
            <p>10 Aug 2026</p>
          </div>

          <div>
            <strong>Total Marks</strong>
            <p>100</p>
          </div>

          <div>
            <strong>Status</strong>
            <p className={styles.pending}>Pending</p>
          </div>

        </div>

       <Link
        to="/student/assignment-submission"
        className={styles.button}
      >
        Submit Assignment →
      </Link>

      </div>
    </div>
  );
}

export default AssignmentDetails;