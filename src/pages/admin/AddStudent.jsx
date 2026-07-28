import { Link } from "react-router-dom";
import styles from "./AddStudent.module.css";

function AddStudent() {
  return (
    <div className={styles.page}>

      <div className={styles.card}>

        <h1>Add New Student</h1>

        <form className={styles.form}>

          <input
            type="text"
            placeholder="Full Name"
          />

          <input
            type="email"
            placeholder="Email Address"
          />

          <input
            type="text"
            placeholder="Phone Number"
          />

          <input
            type="text"
            placeholder="Course Name"
          />

          <input
            type="text"
            placeholder="Cohort"
          />

          <input
            type="text"
            placeholder="Mentor Name"
          />

          <select>

            <option>Active</option>

            <option>Inactive</option>

          </select>

          <div className={styles.buttons}>

            <button type="submit">
              Save Student
            </button>

            <Link to="/students">
              Cancel
            </Link>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddStudent;