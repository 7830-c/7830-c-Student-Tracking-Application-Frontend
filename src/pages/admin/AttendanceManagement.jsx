import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./AttendanceManagement.module.css";

function AttendanceManagement() {
  const [attendance, setAttendance] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [attendanceResponse, cohortsResponse] = await Promise.all([
          apiClient.get(API_ENDPOINTS.ATTENDANCE.BASE),
          apiClient.get(API_ENDPOINTS.COHORTS.BASE),
        ]);

        if (isMounted) {
          setAttendance(Array.isArray(attendanceResponse.data) ? attendanceResponse.data : []);
          setCohorts(Array.isArray(cohortsResponse.data) ? cohortsResponse.data : []);
        }
      } catch (err) {
        console.error("Failed to load attendance data:", err);
        if (isMounted) {
          setAttendance([]);
          setCohorts([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const getCohortName = (cohortId) => {
    const cohort = cohorts.find((item) => item.id === cohortId);
    return cohort?.name || cohort?.code || "Unknown";
  };

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
        <div>
          <h1>Attendance Management</h1>
          <p>Manage daily attendance records</p>
        </div>

        <Link to="/admin/update-attendance" className={styles.addBtn}>
          + Update Attendance
        </Link>
      </div>

      {loading ? (
        <p>Loading attendance records from the database...</p>
      ) : attendance.length === 0 ? (
        <p>No attendance sessions have been recorded yet.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Session</th>
                <th>Cohort</th>
                <th>Date</th>
                <th>Attendees</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {attendance.map((item) => (
                <tr key={item.id}>
                  <td>{item.title || "Attendance Session"}</td>
                  <td>{getCohortName(item.cohort)}</td>
                  <td>{formatDate(item.class_date)}</td>
                  <td>{Array.isArray(item.attendees) ? item.attendees.length : 0}</td>

                  <td className={item.conducted ? styles.present : styles.absent}>
                    {item.conducted ? "Conducted" : "Cancelled"}
                  </td>

                  <td className={styles.actions}>
                    <Link to="/admin/attendance-details">View</Link>
                    <Link to="/admin/attendance-history-admin">History</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AttendanceManagement;