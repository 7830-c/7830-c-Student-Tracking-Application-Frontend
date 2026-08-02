import { Link } from "react-router-dom";
import styles from "./Notifications.module.css";

function Notifications() {
  const notifications = [
    {
      id: 1,
      title: "Exam Schedule Released",
      audience: "All Students",
      date: "28 Jul 2026",
      status: "Published",
    },
    {
      id: 2,
      title: "Assignment Deadline",
      audience: "Java Batch",
      date: "27 Jul 2026",
      status: "Draft",
    },
    {
      id: 3,
      title: "Holiday Notice",
      audience: "All Users",
      date: "25 Jul 2026",
      status: "Published",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Notifications</h1>
          <p>Manage announcements and notifications</p>
        </div>

        <Link to="/admin/add-notification" className={styles.addBtn}>
          + Add Notification
        </Link>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Audience</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {notifications.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.audience}</td>
                <td>{item.date}</td>

                <td
                  className={
                    item.status === "Published"
                      ? styles.published
                      : styles.draft
                  }
                >
                  {item.status}
                </td>

                <td className={styles.actions}>
                  <Link to="/admin/notification-details">View</Link>
                  <Link to="/admin/edit-notification">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Notifications;