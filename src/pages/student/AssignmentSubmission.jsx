import { Link } from "react-router-dom";
import styles from "./AssignmentSubmission.module.css";

function AssignmentSubmission() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <h1>Assignment Submission</h1>

        <p className={styles.subtitle}>
          Upload your completed assignment before the deadline.
        </p>

        <form className={styles.form}>

          <div className={styles.group}>
            <label>Assignment File</label>

            <input
              type="file"
            />
          </div>

          <div className={styles.group}>
            <label>GitHub Repository Link</label>

            <input
              type="url"
              placeholder="https://github.com/username/project"
            />
          </div>

          <div className={styles.group}>
            <label>Comments (Optional)</label>

            <textarea
              rows="5"
              placeholder="Write any notes for your mentor..."
            ></textarea>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
          >
            Submit Assignment
          </button>

        </form>

        <Link
          to="/assignment-feedback"
          className={styles.back}
        >
          View Feedback
        </Link>

      </div>
    </div>
  );
}

export default AssignmentSubmission;