import { Link } from "react-router-dom";
import styles from "./ExamReport.module.css";

function ExamReport() {
  const report = {
    totalExams: 24,
    completedExams: 19,
    passPercentage: "82%",
    averageScore: "74%",
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Exam Report</h1>

        <Link to="/reports">
          Back
        </Link>
      </div>

      <div className={styles.cards}>

        <div className={styles.card}>
          <h2>Total Exams</h2>
          <span>{report.totalExams}</span>
        </div>

        <div className={styles.card}>
          <h2>Completed Exams</h2>
          <span>{report.completedExams}</span>
        </div>

        <div className={styles.card}>
          <h2>Pass Percentage</h2>
          <span>{report.passPercentage}</span>
        </div>

        <div className={styles.card}>
          <h2>Average Score</h2>
          <span>{report.averageScore}</span>
        </div>

      </div>
    </div>
  );
}

export default ExamReport;