import { Link } from "react-router-dom";
import styles from "./AttendanceHistory.module.css";

function AttendanceHistory() {

  const records = [
    {
      id: 1,
      date: "28 Jul 2026",
      present: 40,
      absent: 2,
      late: 1,
    },
    {
      id: 2,
      date: "27 Jul 2026",
      present: 39,
      absent: 3,
      late: 1,
    },
    {
      id: 3,
      date: "26 Jul 2026",
      present: 41,
      absent: 1,
      late: 0,
    },
  ];

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <h1>Attendance History</h1>

        <Link to="/mentor/attendance">
          Back
        </Link>
      </div>

      <table className={styles.table}>

        <thead>
          <tr>
            <th>Date</th>
            <th>Present</th>
            <th>Absent</th>
            <th>Late</th>
          </tr>
        </thead>

        <tbody>

          {records.map((record) => (

            <tr key={record.id}>
              <td>{record.date}</td>
              <td>{record.present}</td>
              <td>{record.absent}</td>
              <td>{record.late}</td>
            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default AttendanceHistory;