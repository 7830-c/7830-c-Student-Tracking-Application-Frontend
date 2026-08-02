import { Link } from "react-router-dom";
import styles from "./MyApplications.module.css";

const applications = [
  {
    id: 1,
    applicationNo: "APP0001",
    course: "Java Full Stack Development",
    status: "EXAM_PENDING",
    appliedDate: "22 Jul 2026"
  }
];

function MyApplications() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <h1>My Applications</h1>

          <p>
            Track your internship applications and current application status.
          </p>
        </div>

        {applications.map((app) => (
          <div key={app.id} className={styles.card}>

            <div className={styles.row}>
              <strong>Application Number</strong>
              <span>{app.applicationNo}</span>
            </div>

            <div className={styles.row}>
              <strong>Course</strong>
              <span>{app.course}</span>
            </div>

            <div className={styles.row}>
              <strong>Status</strong>
              <span className={styles.status}>{app.status}</span>
            </div>

            <div className={styles.row}>
              <strong>Applied On</strong>
              <span>{app.appliedDate}</span>
            </div>

            <Link
              to="/student/application-status"
              className={styles.button}
            >
              View Status
            </Link>

          </div>
        ))}

      </div>
    </div>
  );
}

export default MyApplications;