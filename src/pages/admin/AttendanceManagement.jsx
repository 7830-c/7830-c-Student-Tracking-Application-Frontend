import { Link } from "react-router-dom";
import styles from "./AttendanceManagement.module.css";

function AttendanceManagement() {
  const attendance = [
    {
      id: 1,
      student: "Rahul Sharma",
      cohort: "Java Full Stack",
      date: "28 Jul 2026",
      status: "Present",
    },
    {
      id: 2,
      student: "Anjali Verma",
      cohort: "MERN Stack",
      date: "28 Jul 2026",
      status: "Absent",
    },
    {
      id: 3,
      student: "Kiran Kumar",
      cohort: "Python Full Stack",
      date: "28 Jul 2026",
      status: "Present",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Attendance Management</h1>
          <p>Manage daily attendance records</p>
        </div>

        <Link to="/admin/update-attendance" className={styles.addBtn}>
          + Update Attendance
        </Link>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Cohort</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((item) => (
              <tr key={item.id}>
                <td>{item.student}</td>
                <td>{item.cohort}</td>
                <td>{item.date}</td>

                <td
                  className={
                    item.status === "Present"
                      ? styles.present
                      : styles.absent
                  }
                >
                  {item.status}
                </td>

                <td className={styles.actions}>
                  <Link to="/admin/attendance-details">View</Link>
                  <Link to="/admin/attendance-history-admin">History</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AttendanceManagement;