import { Link } from "react-router-dom";
import styles from "./AddCohort.module.css";

function AddCohort() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <div className={styles.header}>
          <h1>Add New Cohort</h1>

          <Link to="/cohorts">
            Back
          </Link>
        </div>

        <form className={styles.form}>

          <div className={styles.group}>
            <label>Cohort Name</label>
            <input
              type="text"
              placeholder="Enter cohort name"
            />
          </div>

          <div className={styles.group}>
            <label>Mentor Name</label>
            <input
              type="text"
              placeholder="Enter mentor name"
            />
          </div>

          <div className={styles.group}>
            <label>Start Date</label>
            <input type="date" />
          </div>

          <div className={styles.group}>
            <label>End Date</label>
            <input type="date" />
          </div>

          <div className={styles.group}>
            <label>Maximum Students</label>
            <input
              type="number"
              placeholder="Enter student limit"
            />
          </div>

          <div className={styles.group}>
            <label>Status</label>

            <select>
              <option>Active</option>
              <option>Upcoming</option>
              <option>Completed</option>
            </select>
          </div>

          <div className={styles.full}>
            <label>Description</label>

            <textarea
              rows="5"
              placeholder="Enter cohort description"
            ></textarea>
          </div>

          <button type="submit">
            Create Cohort
          </button>

        </form>

      </div>
    </div>
  );
}

export default AddCohort;