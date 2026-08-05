import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./AttendanceDetails.module.css";

function AttendanceDetails() {
  const location = useLocation();
  const sessionId = location.state?.sessionId;

  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }
      try {
        const response = await apiClient.get(`${API_ENDPOINTS.ATTENDANCE.BASE}${sessionId}/`);
        setSessionData(response.data);
      } catch (err) {
        console.error("Failed to load session attendance details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  if (loading) {
    return <div className={styles.container}><p>Loading real attendance metrics...</p></div>;
  }

  if (!sessionData) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <p>No session selected or record not found.</p>
          <Link to="/admin/attendance" className={styles.backBtn}>Back</Link>
        </div>
      </div>
    );
  }

  const expectedCount = Array.isArray(sessionData.attendees) ? sessionData.attendees.length : 0;
  const joinedCount = Array.isArray(sessionData.joined_students) ? sessionData.joined_students.length : 0;

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <div className={styles.header}>
          <h1>Attendance Details</h1>
          <Link to="/admin/attendance">Back</Link>
        </div>

        <div className={styles.grid}>
          <div>
            <label>Session Title</label>
            <p>{sessionData.title}</p>
          </div>

          <div>
            <label>Date</label>
            <p>{sessionData.class_date}</p>
          </div>

          <div>
            <label>Total Expected Students</label>
            <p>{expectedCount}</p>
          </div>

          <div>
            <label>Total Joined Students</label>
            <p>{joinedCount}</p>
          </div>

          <div>
            <label>Total Absent Students</label>
            <p>{Math.max(0, expectedCount - joinedCount)}</p>
          </div>

          <div>
            <label>Status</label>
            <span className={sessionData.conducted === false ? styles.absent : styles.present}>
              {sessionData.conducted === false ? "Conducted / Ended" : "Active"}
            </span>
          </div>
        </div>

        <div className={styles.buttons}>
          <Link to="/admin/update-attendance">Update Attendance</Link>
        </div>

      </div>
    </div>
  );
}

export default AttendanceDetails;