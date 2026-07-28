import { Link } from "react-router-dom";
import styles from "./StudentDetails.module.css";

function StudentDetails() {
  return (
    <div className={styles.page}>

      <div className={styles.card}>

        <h1>Student Details</h1>

        <div className={styles.profile}>

          <div className={styles.avatar}>
            SK
          </div>

          <div>

            <h2>Somesh Kumar Srinadha</h2>

            <p>Java Full Stack Development</p>

          </div>

        </div>

        <div className={styles.info}>

          <div>
            <strong>Email</strong>
            <p>somesh@gmail.com</p>
          </div>

          <div>
            <strong>Phone</strong>
            <p>9876543210</p>
          </div>

          <div>
            <strong>Course</strong>
            <p>Java Full Stack</p>
          </div>

          <div>
            <strong>Cohort</strong>
            <p>Batch A-2026</p>
          </div>

          <div>
            <strong>Mentor</strong>
            <p>Ravi Kumar</p>
          </div>

          <div>
            <strong>Status</strong>
            <p className={styles.active}>
              Active
            </p>
          </div>

        </div>

        <div className={styles.buttons}>

          <Link
            to="/edit-student"
            className={styles.edit}
          >
            Edit Student
          </Link>

          <Link
            to="/students"
            className={styles.back}
          >
            Back
          </Link>

        </div>

      </div>

    </div>
  );
}

export default StudentDetails;