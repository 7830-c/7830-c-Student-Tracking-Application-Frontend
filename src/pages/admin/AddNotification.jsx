import { Link } from "react-router-dom";
import styles from "./AddNotification.module.css";

function AddNotification() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <div className={styles.header}>
          <h1>Add Notification</h1>

          <Link to="/notifications">
            Back
          </Link>
        </div>

        <form className={styles.form}>

          <div className={styles.group}>
            <label>Notification Title</label>
            <input
              type="text"
              placeholder="Enter notification title"
            />
          </div>

          <div className={styles.group}>
            <label>Audience</label>

            <select>
              <option>All Users</option>
              <option>All Students</option>
              <option>All Mentors</option>
              <option>All Companies</option>
              <option>Java Batch</option>
              <option>MERN Batch</option>
            </select>
          </div>

          <div className={styles.group}>
            <label>Publish Date</label>
            <input type="date" />
          </div>

          <div className={styles.group}>
            <label>Status</label>

            <select>
              <option>Published</option>
              <option>Draft</option>
            </select>
          </div>

          <div className={styles.full}>
            <label>Message</label>

            <textarea
              rows="6"
              placeholder="Enter notification message"
            ></textarea>
          </div>

          <button type="submit">
            Publish Notification
          </button>

        </form>

      </div>
    </div>
  );
}

export default AddNotification;