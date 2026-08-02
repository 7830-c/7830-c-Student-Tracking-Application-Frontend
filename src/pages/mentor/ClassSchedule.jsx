import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./ClassSchedule.module.css";

function ClassSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadSchedules = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.COHORTS.BASE);
        if (isMounted) setSchedules(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to load class schedule:", err);
        if (isMounted) setSchedules([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadSchedules();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Class Schedule</h1>
      </div>

      {loading ? (
        <p>Loading cohort schedules from the database...</p>
      ) : schedules.length === 0 ? (
        <p>No cohort schedules are available yet.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cohort</th>
              <th>Course</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {schedules.map((item) => (
              <tr key={item.id}>
                <td>{item.name || item.code || "N/A"}</td>
                <td>{item.course?.name || item.course || "N/A"}</td>
                <td>{item.start_date || "N/A"}</td>
                <td>{item.end_date || "N/A"}</td>
                <td>{item.status || "PENDING"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className={styles.footer}>
        <Link to="/mentor/cohorts">← Back to Cohorts</Link>
      </div>
    </div>
  );
}

export default ClassSchedule;