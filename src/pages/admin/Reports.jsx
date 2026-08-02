import { Link } from "react-router-dom";
import styles from "./Reports.module.css";

function Reports() {
  const reports = [
    {
      title: "Student Report",
      description: "View student performance and enrollment reports.",
      link: "/admin/student-report",
    },
    {
      title: "Course Report",
      description: "Analyze courses, enrollments and completion rate.",
      link: "/admin/course-report",
    },
    {
      title: "Exam Report",
      description: "Monitor exam results and pass percentage.",
      link: "/admin/exam-report",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Reports & Analytics</h1>
        <p>View system reports and analytics.</p>
      </div>

      <div className={styles.cards}>
        {reports.map((report, index) => (
          <div key={index} className={styles.card}>
            <h2>{report.title}</h2>

            <p>{report.description}</p>

            <Link to={report.link}>
              View Report
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reports;