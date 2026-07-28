import { Link } from "react-router-dom";
import styles from "./EditStudent.module.css";

function EditStudent() {
  return (
    <div className={styles.page}>

      <div className={styles.card}>

        <h1>Edit Student</h1>

        <form className={styles.form}>

          <input
            type="text"
            defaultValue="Somesh Kumar Srinadha"
          />

          <input
            type="email"
            defaultValue="somesh@gmail.com"
          />

          <input
            type="text"
            defaultValue="9876543210"
          />

          <input
            type="text"
            defaultValue="Java Full Stack"
          />

          <input
            type="text"
            defaultValue="Batch A-2026"
          />

          <input
            type="text"
            defaultValue="Ravi Kumar"
          />

          <select defaultValue="Active">
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <div className={styles.buttons}>

            <button type="submit">
              Update Student
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

export default EditStudent;