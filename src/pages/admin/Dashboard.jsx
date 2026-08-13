import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { applicationService } from "../../services/applicationService";
import { attendanceService } from "../../services/attendanceService";
import apiClient, { normalizeListResponse } from "../../services/apiClient";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    studentsCount: 0,
    coursesCount: 0,
    cohortsCount: 0,
    applicationsCount: 0,
    mentorsCount: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Multi-page harvester
  const fetchAllPages = async (endpoint) => {
    let results = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= 20) {
      try {
        const separator = endpoint.includes("?") ? "&" : "?";
        const res = await apiClient.get(`${endpoint}${separator}page=${page}&page_size=100`);
        const data = res?.data;

        if (Array.isArray(data)) {
          results = results.concat(data);
          hasMore = false;
        } else if (data && Array.isArray(data.results)) {
          results = results.concat(data.results);
          hasMore = !!data.next;
          page++;
        } else {
          hasMore = false;
        }
      } catch (err) {
        hasMore = false;
      }
    }
    return results;
  };

  const resolveName = (userObj, fallbackCode, fallbackEmail) => {
    if (userObj && typeof userObj === "object") {
      const fn = (userObj.first_name || "").trim();
      const ln = (userObj.last_name || "").trim();
      if (fn || ln) return `${fn} ${ln}`.trim();
      if (userObj.email && userObj.email.includes("@")) {
        const prefix = userObj.email.split("@")[0];
        return prefix.replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      }
    }
    if (fallbackEmail && fallbackEmail.includes("@")) {
      const prefix = fallbackEmail.split("@")[0];
      return prefix.replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }
    if (fallbackCode) return fallbackCode;
    return "Registered Student";
  };

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [rawStudents, rawCourses, rawCohorts, rawApps, rawUsers, rawMentors] = await Promise.all([
          fetchAllPages("/api/students/"),
          fetchAllPages("/api/courses/"),
          fetchAllPages("/api/cohorts/"),
          fetchAllPages("/api/applications/"),
          fetchAllPages("/api/users/"),
          fetchAllPages("/api/mentor-profile/"),
        ]);

        const usersMap = {};
        rawUsers.forEach((u) => { if (u?.id) usersMap[u.id] = u; });

        const studentsMap = {};
        rawStudents.forEach((s) => {
          let uObj = s.user;
          if (typeof uObj === "string" && usersMap[uObj]) uObj = usersMap[uObj];
          if (s?.id) studentsMap[s.id] = { ...s, user: uObj };
        });

        const coursesMap = {};
        rawCourses.forEach((c) => { if (c?.id) coursesMap[c.id] = c.name || c.title; });

        // Master union for Students
        const studentUserIdsInProfiles = new Set();
        const stuList = [];

        rawStudents.forEach((s) => {
          let userObj = s.user;
          if (typeof userObj === "string" && usersMap[userObj]) userObj = usersMap[userObj];
          if (userObj && typeof userObj === "object" && userObj.role && userObj.role !== "STUDENT") return;
          if (typeof userObj === "object" && userObj?.id) studentUserIdsInProfiles.add(userObj.id);
          stuList.push(s);
        });

        rawUsers.filter((u) => u.role === "STUDENT" && !studentUserIdsInProfiles.has(u.id)).forEach((u) => {
          stuList.push({ id: u.id, user: u });
        });

        // Master union for Mentors
        const mentorUserIds = new Set();
        rawMentors.forEach((m) => {
          if (m.user) {
            const uid = typeof m.user === "object" ? m.user.id : m.user;
            mentorUserIds.add(uid);
          }
        });
        rawUsers.filter((u) => u.role === "MENTOR").forEach((u) => mentorUserIds.add(u.id));

        const hydratedApps = rawApps.map((a) => {
          let sName = a.student_name;
          let sEmail = a.student_email;

          if (!sName && a.student) {
            if (typeof a.student === "object") {
              const uObj = a.student.user || a.student;
              sName = resolveName(uObj, a.student.student_code, uObj.email || a.student.email);
              sEmail = uObj.email || a.student.email;
            } else if (studentsMap[a.student]) {
              const stu = studentsMap[a.student];
              const uObj = stu.user;
              sName = resolveName(uObj, stu.student_code, uObj?.email || stu.email);
              sEmail = uObj?.email || stu.email;
            } else if (usersMap[a.student]) {
              const uObj = usersMap[a.student];
              sName = resolveName(uObj, null, uObj.email);
              sEmail = uObj.email;
            }
          }

          let cName = a.course_name;
          if (!cName && a.course && coursesMap[a.course]) cName = coursesMap[a.course];

          return {
            ...a,
            student_display: sName || resolveName(null, null, sEmail) || "Registered Candidate",
            student_email: sEmail || "N/A",
            course_display: cName || "Course Track",
          };
        });

        setStats({
          studentsCount: stuList.length,
          coursesCount: rawCourses.length,
          cohortsCount: rawCohorts.length,
          applicationsCount: rawApps.length,
          mentorsCount: mentorUserIds.size,
        });

        setRecentApplications(hydratedApps.slice(0, 5));
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

        <div className={styles.card}>
          <h3>Mentors</h3>
          <p>{loading ? "..." : stats.mentorsCount}</p>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div style={{ marginTop: "2rem", backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#1e293b" }}>Recent Applications</h2>
          <Link to="/admin/applications" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>View All Applications →</Link>
        </div>

        {loading ? (
          <p style={{ color: "#64748b" }}>Loading recent applications...</p>
        ) : recentApplications.length === 0 ? (
          <p style={{ color: "#64748b" }}>No recent applications available.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "0.75rem", color: "#475569" }}>Application No.</th>
                <th style={{ padding: "0.75rem", color: "#475569" }}>Candidate Name & Email</th>
                <th style={{ padding: "0.75rem", color: "#475569" }}>Course Track</th>
                <th style={{ padding: "0.75rem", color: "#475569" }}>Status</th>
                <th style={{ padding: "0.75rem", color: "#475569" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.map((app) => (
                <tr key={app.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "0.75rem" }}><strong>{app.application_number || "APP-SYS"}</strong></td>
                  <td style={{ padding: "0.75rem" }}>
                    <strong style={{ color: "#0f172a", display: "block" }}>{app.student_display}</strong>
                    {app.student_email && app.student_email !== "N/A" && (
                      <span style={{ fontSize: "12px", color: "#2563eb", fontWeight: 600 }}>{app.student_email}</span>
                    )}
                  </td>
                  <td style={{ padding: "0.75rem", color: "#3b82f6", fontWeight: 600 }}>{app.course_display}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <span style={{
                      backgroundColor: app.status === "QUALIFIED" || app.status === "APPROVED" || app.status === "ACCEPTED" ? "#dcfce7" : app.status === "REJECTED" ? "#fee2e2" : "#fef3c7",
                      color: app.status === "QUALIFIED" || app.status === "APPROVED" || app.status === "ACCEPTED" ? "#15803d" : app.status === "REJECTED" ? "#b91c1c" : "#b45309",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: 700
                    }}>
                      {app.status || "PENDING"}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    <Link to={`/admin/application-details/${app.id}`} style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;