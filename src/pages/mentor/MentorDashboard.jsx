import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./MentorDashboard.module.css";

function MentorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ cohorts: 0, students: 0, attendance: 0, assignments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [cohortsRes, studentsRes, attendanceRes, assignmentsRes] = await Promise.allSettled([
          apiClient.get(API_ENDPOINTS.COHORTS.BASE),
          apiClient.get(API_ENDPOINTS.STUDENTS.BASE),
          apiClient.get(API_ENDPOINTS.ATTENDANCE.BASE),
          apiClient.get(API_ENDPOINTS.ASSIGNMENTS.BASE),
        ]);

        const cohorts = cohortsRes.status === "fulfilled" ? (cohortsRes.value.data?.results || cohortsRes.value.data || []).length : 0;
        const students = studentsRes.status === "fulfilled" ? (studentsRes.value.data?.results || studentsRes.value.data || []).length : 0;
        const attendance = attendanceRes.status === "fulfilled" ? (attendanceRes.value.data?.results || attendanceRes.value.data || []).length : 0;
        const assignments = assignmentsRes.status === "fulfilled" ? (assignmentsRes.value.data?.results || assignmentsRes.value.data || []).length : 0;

        setStats({ cohorts, students, attendance, assignments });
      } catch (err) {
        console.error("Failed to load mentor dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const fullName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || user?.email || "Mentor";

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Mentor Dashboard</h1>
        <p>Welcome back, {fullName}</p>
      </div>

      <div className={styles.cards}>
        <Link to="/mentor/cohorts" className={styles.card}>
          <h2>My Cohorts</h2>
          <span>{loading ? "..." : stats.cohorts}</span>
        </Link>
        <Link to="/mentor/students" className={styles.card}>
          <h2>My Students</h2>
          <span>{loading ? "..." : stats.students}</span>
        </Link>
        <Link to="/mentor/attendance" className={styles.card}>
          <h2>Attendance</h2>
          <span>{loading ? "..." : stats.attendance}</span>
        </Link>
        <Link to="/mentor/assignments" className={styles.card}>
          <h2>Assignments</h2>
          <span>{loading ? "..." : stats.assignments}</span>
        </Link>
      </div>

      <div className={styles.quickLinks}>
        <Link to="/mentor/profile">Profile</Link>
      </div>
    </div>
  );
}

export default MentorDashboard;
