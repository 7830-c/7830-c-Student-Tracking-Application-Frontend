import { Link, useLocation } from "react-router-dom";
import styles from "./ApplicationStatus.module.css";

function ApplicationStatus() {
  const location = useLocation();
  const application = location.state?.application;

  const formatDate = (value) => {
    if (!value) return "N/A";
    return new Date(value).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={styles.statusPage}>
      <div className={styles.statusCard}>
        <h1>Application Status</h1>

        <p className={styles.subtitle}>
          Track the current status of your internship application.
        </p>

        <div className={styles.details}>
          <div className={styles.row}>
            <strong>Application Number</strong>
            <span>{application?.application_number || application?.id || "N/A"}</span>
          </div>

          <div className={styles.row}>
            <strong>Course</strong>
            <span>{application?.course?.name || "N/A"}</span>
          </div>

          <div className={styles.row}>
            <strong>Applied Date</strong>
            <span>{formatDate(application?.applied_at)}</span>
          </div>

          <div className={styles.row}>
            <strong>Current Status</strong>
            <span className={styles.pending}>{application?.status || "PENDING"}</span>
          </div>
        </div>

        <div className={styles.timeline}>
          <div className={styles.completed}>✓ Application Submitted</div>
          <div className={styles.active}>⏳ Screening Exam Pending</div>
          <div>Qualification Result</div>
          <div>Cohort Assignment</div>
          <div>Internship Begins</div>
        </div>

        <Link to="/student/exam-instructions" className={styles.examButton}>
          Start Screening Exam
        </Link>

        <Link to="/student/cohort" className={styles.button}>
          Continue to My Cohort →
        </Link>

        <Link to="/student/applications" className={styles.button}>
          Back to My Applications
        </Link>
      </div>
    </div>
  );
}

export default ApplicationStatus;