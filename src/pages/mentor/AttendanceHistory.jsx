import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./AttendanceHistory.module.css";

function AttendanceHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadAttendance = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.ATTENDANCE.BASE);
        if (isMounted) setRecords(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to load attendance history:", err);
        if (isMounted) setRecords([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAttendance();
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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Attendance History</h1>
        <Link to="/mentor/attendance">Back</Link>
      </div>

      {loading ? (
        <p>Loading attendance history from the database...</p>
      ) : records.length === 0 ? (
        <p>No attendance history is available yet.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Session</th>
              <th>Cohort</th>
              <th>Attendees</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{formatDate(record.class_date)}</td>
                <td>{record.title || "Attendance Session"}</td>
                <td>{record.cohort?.name || record.cohort || "N/A"}</td>
                <td>{Array.isArray(record.attendees) ? record.attendees.length : 0}</td>
                <td>{record.conducted ? "Conducted" : "Cancelled"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AttendanceHistory;