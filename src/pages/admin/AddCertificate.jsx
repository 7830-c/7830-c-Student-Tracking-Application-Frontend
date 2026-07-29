import { Link } from "react-router-dom";
import styles from "./AddCertificate.module.css";

function AddCertificate() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <div className={styles.header}>
          <h1>Add Certificate</h1>

          <Link to="/certificates-admin">
            Back
          </Link>
        </div>

        <form className={styles.form}>

          <div className={styles.group}>
            <label>Student Name</label>
            <input
              type="text"
              placeholder="Enter student name"
            />
          </div>

          <div className={styles.group}>
            <label>Course</label>

            <select>
              <option>Java Full Stack</option>
              <option>MERN Stack</option>
              <option>Python Full Stack</option>
            </select>
          </div>

          <div className={styles.group}>
            <label>Certificate ID</label>
            <input
              type="text"
              placeholder="CERT-2026-001"
            />
          </div>

          <div className={styles.group}>
            <label>Issue Date</label>
            <input type="date" />
          </div>

          <div className={styles.group}>
            <label>Grade</label>

            <select>
              <option>A+</option>
              <option>A</option>
              <option>B+</option>
              <option>B</option>
              <option>C</option>
            </select>
          </div>

          <div className={styles.group}>
            <label>Status</label>

            <select>
              <option>Issued</option>
              <option>Pending</option>
            </select>
          </div>

          <div className={styles.full}>
            <label>Description</label>

            <textarea
              rows="5"
              placeholder="Enter certificate description"
            ></textarea>
          </div>

          <button type="submit">
            Create Certificate
          </button>

        </form>

      </div>
    </div>
  );
}

export default AddCertificate;