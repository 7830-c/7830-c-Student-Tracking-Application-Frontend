import { Link } from "react-router-dom";
import styles from "./EditCourse.module.css";

function EditCourse() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <h1>Edit Course</h1>

        <p className={styles.subtitle}>
          Update the course information.
        </p>

        <form className={styles.form}>

          <div className={styles.group}>
            <label>Course Name</label>

            <input
              type="text"
              defaultValue="Java Full Stack Development"
            />
          </div>

          <div className={styles.group}>
            <label>Duration</label>

            <input
              type="text"
              defaultValue="6 Months"
            />
          </div>

          <div className={styles.group}>
            <label>Mentor</label>

            <input
              type="text"
              defaultValue="Ravi Kumar"
            />
          </div>

          <div className={styles.group}>
            <label>Course Fee</label>

            <input
              type="number"
              defaultValue="25000"
            />
          </div>

          <div className={styles.group}>
            <label>Start Date</label>

            <input
              type="date"
              defaultValue="2026-08-01"
            />
          </div>

          <div className={styles.group}>
            <label>Status</label>

            <select defaultValue="Active">
              <option>Active</option>
              <option>Upcoming</option>
              <option>Completed</option>
            </select>
          </div>

          <div className={styles.groupFull}>
            <label>Description</label>

            <textarea
              rows="5"
              defaultValue="This course covers Java Programming, Spring Boot, React JS, MySQL, REST APIs, Git, Deployment and Full Stack Development with real-time projects."
            />
          </div>

          <div className={styles.buttons}>

            <button
              type="submit"
              className={styles.updateBtn}
            >
              Update Course
            </button>

            <Link
              to="/courses"
              className={styles.cancelBtn}
            >
              Cancel
            </Link>

          </div>

        </form>

      </div>
    </div>
  );
}

export default EditCourse;