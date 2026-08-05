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
                <th>Timings</th>
                <th>Expected</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {attendance.map((item) => {
                const getDownloadLink = (item) => {
                  const safeTitle = (item.title || "Attendance Session").replace(/ /g, "_").replace(/\//g, "-");
                  const fileName = `${safeTitle}_${item.class_date}.csv`;
                  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
                  const serverUrl = baseUrl.replace(/\/api\/?$/, "");
                  return `${serverUrl}/media/attendance_reports/${fileName}`;
                };

                return (
                <tr key={item.id}>
                  <td>{item.title || "Attendance Session"}</td>
                  <td>{getCohortName(item.cohort)}</td>
                  <td>{formatDate(item.class_date)}</td>
                  <td>{item.start_time?.slice(0,5)} - {item.end_time ? item.end_time.slice(0,5) : "TBD"}</td>
                  <td>{Array.isArray(item.attendees) ? item.attendees.length : 0}</td>
                  <td>{Array.isArray(item.joined_students) ? item.joined_students.length : 0}</td>

                  <td className={item.conducted === false ? styles.absent : styles.present}>
                    {item.conducted === false ? "Ended" : "Active"}
                  </td>

                  <td className={styles.actions} style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {item.conducted === false && (
                       <a href={getDownloadLink(item)} target="_blank" rel="noreferrer" style={{background: "#16a34a", color: "white", padding: "6px 12px", borderRadius: "6px", textDecoration: "none", fontWeight: "bold", fontSize: "12px", display: "inline-block", textAlign: "center"}}>⬇️ CSV</a>
                    )}
                    <Link to="/admin/attendance-details">View</Link>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AttendanceManagement;