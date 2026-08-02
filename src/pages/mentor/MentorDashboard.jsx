import { Link } from "react-router-dom";
import styles from "./MentorDashboard.module.css";

function MentorDashboard() {
  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <h1>Mentor Dashboard</h1>
        <p>Welcome back, Mentor</p>
      </div>

      <div className={styles.cards}>

        <Link to="/mentor/cohorts" className={styles.card}>
          <h2>My Cohorts</h2>
          <span>3</span>
        </Link>

        <Link to="/mentor/students" className={styles.card}>
          <h2>My Students</h2>
          <span>124</span>
        </Link>

        <Link to="/mentor/attendance" className={styles.card}>
          <h2>Attendance</h2>
          <span>95%</span>
        </Link>

        <Link to="/mentor/assignments" className={styles.card}>
          <h2>Assignments</h2>
          <span>18</span>
        </Link>

      </div>

      <div className={styles.quickLinks}>

        <Link to="/mentor/class-schedule">
          Class Schedule
        </Link>

        <Link to="/mentor/meeting-links">
          Meeting Links
        </Link>

        <Link to="/mentor/profile">
          Profile
        </Link>

      </div>

    </div>
  );
}

export default MentorDashboard;