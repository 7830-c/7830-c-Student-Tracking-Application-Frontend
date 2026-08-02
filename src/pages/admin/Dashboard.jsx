import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { studentService } from "../../services/studentService";
import { courseService } from "../../services/courseService";
import { cohortService } from "../../services/cohortService";
import { applicationService } from "../../services/applicationService";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const [stats, setStats] = useState({
    studentsCount: 0,
    coursesCount: 0,
    cohortsCount: 0,
    applicationsCount: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [studentsRes, coursesRes, cohortsRes, appsRes] = await Promise.allSettled([
          studentService.getStudentProfiles(),
          courseService.getCourses(),
          cohortService.getCohorts(),
          applicationService.getApplications(),
        ]);

        const studentsCount = studentsRes.status === "fulfilled" ? (studentsRes.value.count || studentsRes.value.length || 0) : 0;
        const coursesCount = coursesRes.status === "fulfilled" ? (coursesRes.value.count || coursesRes.value.length || 0) : 0;
        const cohortsCount = cohortsRes.status === "fulfilled" ? (cohortsRes.value.count || cohortsRes.value.length || 0) : 0;
        
        let appsData = [];
        let applicationsCount = 0;
        if (appsRes.status === "fulfilled") {
          appsData = appsRes.value.results || appsRes.value || [];
          applicationsCount = appsRes.value.count || appsData.length;
        }

        setStats({
          studentsCount,
          coursesCount,
          cohortsCount,
          applicationsCount,
        });
        setRecentApplications(appsData.slice(0, 5));
      } catch (err) {
        console.error("Failed to load admin dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div className={styles.dashboard}>
      <h1>Admin Dashboard</h1>

      <p className={styles.subtitle}>
        Welcome Admin! Here's your internship management overview.
      </p>

      {/* Statistics */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Total Students</h3>
          <p>{loading ? "..." : stats.studentsCount}</p>
        </div>

        <div className={styles.card}>
          <h3>Total Courses</h3>
          <p>{loading ? "..." : stats.coursesCount}</p>
        </div>

        <div className={styles.card}>
          <h3>Active Cohorts</h3>
          <p>{loading ? "..." : stats.cohortsCount}</p>
        </div>

        <div className={styles.card}>
          <h3>Total Applications</h3>
          <p>{loading ? "..." : stats.applicationsCount}</p>
        </div>
      </div>

      {/* Recent Applications */}
      <div className={styles.tableSection}>
        <h2>Recent Applications</h2>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Application #</th>
                <th>Course / Student</th>
                <th>Applied Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "1rem" }}>
                    {loading ? "Loading applications..." : "No recent applications found."}
                  </td>
                </tr>
              ) : (
                recentApplications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.application_number || app.id.slice(0, 8)}</td>
                    <td>{app.course_title || app.course || "Course N/A"}</td>
                    <td>{app.applied_at ? new Date(app.applied_at).toLocaleDateString() : "N/A"}</td>
                    <td>
                      <span
                        className={
                          app.status === "ACCEPTED" || app.status === "EXAM_PASSED"
                            ? styles.approved
                            : app.status === "REJECTED"
                            ? styles.rejected
                            : styles.pending
                        }
                      >
                        {app.status || "PENDING"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.announcementSection}>
        <h2>Quick Actions</h2>
        <div className={styles.cards}>
          <Link to="/admin/add-student" className={styles.card}>
            ➕ Add Student
          </Link>
          <Link to="/admin/add-mentor" className={styles.card}>
            👨‍🏫 Add Mentor
          </Link>
          <Link to="/admin/add-course" className={styles.card}>
            📚 Add Course
          </Link>
          <Link to="/admin/add-exam" className={styles.card}>
            📝 Create Exam
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;