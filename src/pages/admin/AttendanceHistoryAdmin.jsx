import { Link } from "react-router-dom";
import styles from "./AttendanceHistoryAdmin.module.css";

function AttendanceHistoryAdmin() {
  const history = [
    {
      date: "28 Jul 2026",
      status: "Present",
      checkIn: "09:01 AM",
      checkOut: "05:04 PM",
    },
    {
      date: "27 Jul 2026",
      status: "Present",
      checkIn: "09:05 AM",
      checkOut: "05:10 PM",
    },
    {
      date: "26 Jul 2026",
      status: "Absent",
      checkIn: "-",
      checkOut: "-",
    },
    {
      date: "25 Jul 2026",
      status: "Present",
      checkIn: "08:58 AM",
      checkOut: "05:00 PM",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Attendance History</h1>
          <p>Rahul Sharma</p>
        </div>

        <Link to="/attendance-management" className={styles.backBtn}>
          Back
        </Link>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
            <th>Check In</th>
            <th>Check Out</th>
          </tr>
        </thead>

        <tbody>
          {history.map((item, index) => (
            <tr key={index}>
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

              <td>{item.checkIn}</td>
              <td>{item.checkOut}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceHistoryAdmin;