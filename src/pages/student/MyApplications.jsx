import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./MyApplications.module.css";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadApplications = async () => {
      try {
        const [appRes, courseRes] = await Promise.all([
          apiClient.get(API_ENDPOINTS.APPLICATIONS.BASE).catch(() => null),
          apiClient.get(API_ENDPOINTS.COURSES.BASE).catch(() => null),
        ]);

        const rawApps = Array.isArray(appRes?.data) ? appRes.data : (appRes?.data?.results || []);
        const rawCourses = Array.isArray(courseRes?.data) ? courseRes.data : (courseRes?.data?.results || []);

        const coursesMap = {};
        rawCourses.forEach((c) => { if (c?.id) coursesMap[c.id] = c.name || c.title; });

        const appMap = {};

        // 1. Process backend applications
        rawApps.forEach((a) => {
          let cName = a.course_name;
          if (!cName && a.course) {
            const cid = typeof a.course === "object" ? a.course.id : a.course;
            if (coursesMap[cid]) cName = coursesMap[cid];
          }
          if (a.id) {
            appMap[a.id] = {
              ...a,
              course_display: cName || (typeof a.course === "object" ? a.course?.name : "Course Track"),
            };
          }
        });

        // 2. Include local applications from localStorage
        const localApps = JSON.parse(localStorage.getItem("sure_student_applications") || "[]");
        localApps.forEach((la) => {
          if (la.id && !appMap[la.id]) {
            appMap[la.id] = la;
          }
        });

        const masterAppsList = Object.values(appMap);

        if (isMounted) setApplications(masterAppsList);
      } catch (err) {
        console.error("Failed to load applications:", err);
        if (isMounted) setApplications([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadApplications();
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
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>My Applications ({applications.length})</h1>
          <p>Track your internship applications and current application status.</p>
        </div>

        {loading ? (
          <p style={{ color: "#64748b" }}>Loading applications from the database...</p>
        ) : applications.length === 0 ? (
          <p style={{ color: "#64748b" }}>No applications have been submitted yet.</p>
        ) : (
          applications.map((app) => (
            <div key={app.id} className={styles.card}>
              <div className={styles.row}>
                <strong>Application Number</strong>
                <span>{app.application_number || app.id}</span>
              </div>

              <div className={styles.row}>
                <strong>Course</strong>
                <span style={{ color: "#2563eb", fontWeight: "bold" }}>{app.course_display || app.course_name || "Course Track"}</span>
              </div>

              <div className={styles.row}>
                <strong>Status</strong>
                <span className={styles.status}>{app.status || "APPLIED"}</span>
              </div>

              <div className={styles.row}>
                <strong>Applied On</strong>
                <span>{formatDate(app.applied_at || app.created_at)}</span>
              </div>

              <Link
                to="/student/application-status"
                state={{ application: { ...app, course_name: app.course_display || app.course_name } }}
                className={styles.button}
              >
                View Status
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyApplications;