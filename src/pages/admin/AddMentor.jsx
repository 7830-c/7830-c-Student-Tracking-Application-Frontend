import { Link } from "react-router-dom";
import styles from "./AddMentor.module.css";

function AddMentor() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <h1>Add New Mentor</h1>

        <p className={styles.subtitle}>
          Enter mentor information below.
        </p>

        <form className={styles.form}>

          <div className={styles.group}>
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter mentor name"
            />
          </div>

          <div className={styles.group}>
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter email"
            />
          </div>

          <div className={styles.group}>
            <label>Phone Number</label>

            <input
              type="tel"
              placeholder="Enter phone number"
            />
          </div>

          <div className={styles.group}>
            <label>Experience</label>

            <input
              type="text"
              placeholder="Example: 5 Years"
            />
          </div>

          <div className={styles.group}>
            <label>Specialization</label>

            <select>
              <option>Java Full Stack</option>
              <option>Python Full Stack</option>
              <option>MERN Stack</option>
              <option>Data Science</option>
              <option>Cloud Computing</option>
            </select>
          </div>

          <div className={styles.group}>
            <label>Status</label>

            <select>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div className={styles.groupFull}>
            <label>About Mentor</label>

            <textarea
              rows="5"
              placeholder="Enter mentor profile..."
            />
          </div>

          <div className={styles.buttons}>

            <button
              type="submit"
              className={styles.saveBtn}
            >
              Save Mentor
            </button>

            <Link
              to="/mentors"
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

export default AddMentor;