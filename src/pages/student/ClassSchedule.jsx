import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./ClassSchedule.module.css";

function ClassSchedule() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSchedule = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.ATTENDANCE.BASE);
        if (isMounted) setSchedule(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to load class schedule:", err);
        if (isMounted) setSchedule([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadSchedule();
    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (value) => {
    if (!value) return "N/A";
    return new Date(value).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1>Class Schedule</h1>

        <p className={styles.subtitle}>Weekly schedule for your internship cohort.</p>

        {loading ? (
          <p>Loading schedule from the database...</p>
        ) : schedule.length === 0 ? (
          <p>No class schedule entries are available yet.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Topic</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {schedule.map((item) => (
                <tr key={item.id}>
                  <td>{formatDate(item.class_date)}</td>
                  <td>{item.start_time ? `${item.start_time} - ${item.end_time || ""}`.trim() : "N/A"}</td>
                  <td>{item.title || "Class Session"}</td>
                  <td>{item.conducted ? "Conducted" : "Scheduled"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className={styles.buttons}>
          <Link to="/student/mentor-details" className={styles.button}>
            View Mentor Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ClassSchedule;