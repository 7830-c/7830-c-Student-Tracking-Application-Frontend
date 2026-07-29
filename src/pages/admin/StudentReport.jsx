import { Link } from "react-router-dom";
import styles from "./StudentReport.module.css";

function StudentReport() {
  const report = {
    totalStudents: 520,
    activeStudents: 468,
    completedCourses: 312,
    placements: 186,
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Student Report</h1>

        <Link to="/reports">
          Back
        </Link>
      </div>

      <div className={styles.cards}>

        <div className={styles.card}>
          <h2>Total Students</h2>
          <span>{report.totalStudents}</span>
        </div>

        <div className={styles.card}>
          <h2>Active Students</h2>
          <span>{report.activeStudents}</span>
        </div>

        <div className={styles.card}>
          <h2>Completed Courses</h2>
          <span>{report.completedCourses}</span>
        </div>

        <div className={styles.card}>
          <h2>Placements</h2>
          <span>{report.placements}</span>
        </div>

      </div>
    </div>
  );
}

export default StudentReport;