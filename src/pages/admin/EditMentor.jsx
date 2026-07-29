import { Link } from "react-router-dom";
import styles from "./EditMentor.module.css";

function EditMentor() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <h1>Edit Mentor</h1>

        <p className={styles.subtitle}>
          Update mentor information.
        </p>

        <form className={styles.form}>

          <div className={styles.group}>
            <label>Full Name</label>

            <input
              type="text"
              defaultValue="Ravi Kumar"
            />
          </div>

          <div className={styles.group}>
            <label>Email</label>

            <input
              type="email"
              defaultValue="ravi@suretrust.in"
            />
          </div>

          <div className={styles.group}>
            <label>Phone Number</label>

            <input
              type="tel"
              defaultValue="+91 9876543210"
            />
          </div>

          <div className={styles.group}>
            <label>Experience</label>

            <input
              type="text"
              defaultValue="8 Years"
            />
          </div>

          <div className={styles.group}>
            <label>Specialization</label>

            <select defaultValue="Java Full Stack">
              <option>Java Full Stack</option>
              <option>Python Full Stack</option>
              <option>MERN Stack</option>
              <option>Data Science</option>
              <option>Cloud Computing</option>
            </select>
          </div>

          <div className={styles.group}>
            <label>Status</label>

            <select defaultValue="Active">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div className={styles.groupFull}>
            <label>About Mentor</label>

            <textarea
              rows="5"
              defaultValue="Experienced Full Stack Trainer with expertise in Java, Spring Boot, React, MySQL and enterprise application development."
            />
          </div>

          <div className={styles.buttons}>

            <button
              type="submit"
              className={styles.updateBtn}
            >
              Update Mentor
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

export default EditMentor;