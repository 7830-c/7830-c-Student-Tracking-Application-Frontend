import { Link } from "react-router-dom";
import styles from "./AttendanceHistory.module.css";

const attendanceData = [
  {
    date: "01 Aug 2026",
    subject: "Java Fundamentals",
    time: "10:00 AM",
    status: "Present",
  },
  {
    date: "02 Aug 2026",
    subject: "Spring Boot",
    time: "10:00 AM",
    status: "Present",
  },
  {
    date: "03 Aug 2026",
    subject: "ReactJS",
    time: "10:00 AM",
    status: "Absent",
  },
  {
    date: "04 Aug 2026",
    subject: "MySQL",
    time: "10:00 AM",
    status: "Present",
  },
  {
    date: "05 Aug 2026",
    subject: "Mini Project",
    time: "10:00 AM",
    status: "Present",
  },
];

function AttendanceHistory() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <h1>Attendance History</h1>

        <p className={styles.subtitle}>
          View your attendance records for all internship sessions.
        </p>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>

            <thead>
              <tr>
                <th>Date</th>
                <th>Subject</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {attendanceData.map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.subject}</td>
                  <td>{item.time}</td>
                  <td>
                    <span
                      className={
                        item.status === "Present"
                          ? styles.present
                          : styles.absent
                      }
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        <div className={styles.actions}>
          <Link
            to="/student/assignments"
            className={styles.button}
          >
            Continue to Assignments →
          </Link>
        </div>

      </div>
    </div>
  );
}

export default AttendanceHistory;