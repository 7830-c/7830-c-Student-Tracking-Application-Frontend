import { Link } from "react-router-dom";
import styles from "./CourseReport.module.css";

function CourseReport() {
  const report = {
    totalCourses: 18,
    activeCourses: 12,
    enrolledStudents: 520,
    completedCourses: 286,
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Course Report</h1>

        <Link to="/admin/reports">
          Back
        </Link>
      </div>

      <div className={styles.cards}>

        <div className={styles.card}>
          <h2>Total Courses</h2>
          <span>{report.totalCourses}</span>
        </div>

        <div className={styles.card}>
          <h2>Active Courses</h2>
          <span>{report.activeCourses}</span>
        </div>

        <div className={styles.card}>
          <h2>Enrolled Students</h2>
          <span>{report.enrolledStudents}</span>
        </div>

        <div className={styles.card}>
          <h2>Course Completions</h2>
          <span>{report.completedCourses}</span>
        </div>

      </div>
    </div>
  );
}

export default CourseReport;