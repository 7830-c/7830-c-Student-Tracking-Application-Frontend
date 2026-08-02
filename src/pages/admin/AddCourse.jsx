import { Link } from "react-router-dom";
import styles from "./AddCourse.module.css";

function AddCourse() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <h1>Add New Course</h1>
        <p className={styles.subtitle}>
          Fill in the course details below.
        </p>

        <form className={styles.form}>

          <div className={styles.group}>
            <label>Course Name</label>
            <input
              type="text"
              placeholder="Enter course name"
            />
          </div>

          <div className={styles.group}>
            <label>Duration</label>
            <input
              type="text"
              placeholder="e.g. 6 Months"
            />
          </div>

          <div className={styles.group}>
            <label>Mentor</label>
            <input
              type="text"
              placeholder="Mentor name"
            />
          </div>

          <div className={styles.group}>
            <label>Course Fee</label>
            <input
              type="number"
              placeholder="Enter fee"
            />
          </div>

          <div className={styles.group}>
            <label>Start Date</label>
            <input type="date" />
          </div>

          <div className={styles.group}>
            <label>Status</label>

            <select>
              <option>Active</option>
              <option>Upcoming</option>
              <option>Completed</option>
            </select>
          </div>

          <div className={styles.groupFull}>
            <label>Description</label>

            <textarea
              rows="5"
              placeholder="Enter course description"
            />
          </div>

          <div className={styles.buttons}>

            <button
              type="submit"
              className={styles.saveBtn}
            >
              Save Course
            </button>

            <Link
              to="/admin/courses"
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

export default AddCourse;