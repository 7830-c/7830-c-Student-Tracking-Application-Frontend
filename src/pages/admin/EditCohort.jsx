import { Link } from "react-router-dom";
import styles from "./EditCohort.module.css";

function EditCohort() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <div className={styles.header}>
          <h1>Edit Cohort</h1>

          <Link to="/admin/cohorts">
            Back
          </Link>
        </div>

        <form className={styles.form}>

          <div className={styles.group}>
            <label>Cohort Name</label>
            <input
              type="text"
              defaultValue="Java Full Stack - Batch 12"
            />
          </div>

          <div className={styles.group}>
            <label>Mentor Name</label>
            <input
              type="text"
              defaultValue="Rahul Sharma"
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
            <label>End Date</label>
            <input
              type="date"
              defaultValue="2026-11-30"
            />
          </div>

          <div className={styles.group}>
            <label>Maximum Students</label>
            <input
              type="number"
              defaultValue="45"
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

          <div className={styles.full}>
            <label>Description</label>

            <textarea
              rows="5"
              defaultValue="This cohort is designed for Java Full Stack training covering Java, Spring Boot, React, SQL and placement preparation."
            ></textarea>
          </div>

          <button type="submit">
            Update Cohort
          </button>

        </form>

      </div>
    </div>
  );
}

export default EditCohort;