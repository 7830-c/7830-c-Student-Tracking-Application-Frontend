import { Link } from "react-router-dom";
import styles from "./AttendanceDetails.module.css";

function AttendanceDetails() {
  const attendance = {
    student: "Rahul Sharma",
    cohort: "Java Full Stack",
    date: "28 July 2026",
    checkIn: "09:02 AM",
    checkOut: "05:12 PM",
    status: "Present",
    attendancePercentage: "96%",
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <div className={styles.header}>
          <h1>Attendance Details</h1>

          <Link to="/admin/attendance">
            Back
          </Link>
        </div>

        <div className={styles.grid}>

          <div>
            <label>Student</label>
            <p>{attendance.student}</p>
          </div>

          <div>
            <label>Cohort</label>
            <p>{attendance.cohort}</p>
          </div>

          <div>
            <label>Date</label>
            <p>{attendance.date}</p>
          </div>

          <div>
            <label>Check In</label>
            <p>{attendance.checkIn}</p>
          </div>

          <div>
            <label>Check Out</label>
            <p>{attendance.checkOut}</p>
          </div>

          <div>
            <label>Attendance %</label>
            <p>{attendance.attendancePercentage}</p>
          </div>

          <div>
            <label>Status</label>
            <span className={styles.present}>
              {attendance.status}
            </span>
          </div>

        </div>

        <div className={styles.buttons}>
          <Link to="/admin/update-attendance">
            Update Attendance
          </Link>
        </div>

      </div>
    </div>
  );
}

export default AttendanceDetails;