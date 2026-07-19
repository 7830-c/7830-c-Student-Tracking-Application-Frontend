import styles from "./Dashboard.module.css";

function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <h1>Good Morning, Somesh 👋</h1>

      <p className={styles.subtitle}>
        Welcome back! Here's your internship overview.
      </p>

      {/* Top Cards */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Current Cohort</h3>
          <p>Java Full Stack - Batch 12</p>
        </div>

        <div className={styles.card}>
          <h3>Today's Session</h3>
          <p>09:30 AM - 11:30 AM</p>
        </div>

        <div className={styles.card}>
          <h3>Today's Attendance</h3>
          <p>Not Marked Yet</p>
        </div>

        <div className={styles.card}>
          <h3>Your Attendance</h3>
          <p>92%</p>
        </div>
      </div>

      {/* Recent Attendance */}
      <div className={styles.tableSection}>
        <h2>Recent Attendance</h2>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Login Time</th>
              <th>Logout Time</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>21 Jul 2026</td>
              <td>09:28 AM</td>
              <td>11:31 AM</td>
              <td>
                <span className={styles.present}>Present</span>
              </td>
            </tr>

            <tr>
              <td>20 Jul 2026</td>
              <td>09:31 AM</td>
              <td>11:30 AM</td>
              <td>
                <span className={styles.present}>Present</span>
              </td>
            </tr>

            <tr>
              <td>19 Jul 2026</td>
              <td>--</td>
              <td>--</td>
              <td>
                <span className={styles.absent}>Absent</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Today's Announcements */}
      <div className={styles.announcementSection}>
        <h2>Today's Announcements</h2>

        <div className={styles.announcementCard}>
          <h3>📢 Mentor Update</h3>

          <p>
            Today's Java Full Stack session will begin at 09:30 AM.
            Please join the meeting 10 minutes before the session starts.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;