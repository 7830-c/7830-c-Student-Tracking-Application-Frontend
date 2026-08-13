import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient, { normalizeListResponse } from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { cohortService } from "../../services/cohortService";
import styles from "./Cohorts.module.css";

const getActionBtnStyle = (bgColor) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: "34px",
  padding: "0 14px",
  backgroundColor: bgColor,
  color: "#ffffff",
  textDecoration: "none",
  borderRadius: "6px",
  fontSize: "13px",
  fontWeight: "700",
  lineHeight: "1",
  boxSizing: "border-box",
  whiteSpace: "nowrap",
  border: "none",
  cursor: "pointer",
  margin: "0",
  verticalAlign: "middle",
});

function Cohorts() {
  const [cohorts, setCohorts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Publishing State
  const [publishCohortId, setPublishCohortId] = useState(null);
  const [publishDate, setPublishDate] = useState("");

  const handlePublish = async (id) => {
    if (!publishDate) return alert("Please select an end date for applications.");
    try {
      await cohortService.patchCohort(id, { status: "OPEN", end_date: publishDate }).catch(() => null);
      setCohorts(prev => prev.map(c => c.id === id ? { ...c, status: "OPEN", end_date: publishDate } : c));
      setPublishCohortId(null);
      setPublishDate("");
      alert("✅ Cohort published successfully!");
    } catch (err) {
      alert("❌ Failed to publish cohort.");
    }
  };

  const handleStop = async (id) => {
    if (!window.confirm("Are you sure you want to stop applications? This cohort will no longer be visible to students.")) return;
    try {
      await cohortService.patchCohort(id, { status: "CLOSED" }).catch(() => null);
      setCohorts(prev => prev.map(c => c.id === id ? { ...c, status: "CLOSED" } : c));
    } catch (err) {
      alert("❌ Failed to stop applications.");
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        localStorage.removeItem("sure_local_cohorts");

        const [cohortsRes, coursesRes] = await Promise.all([
          apiClient.get(API_ENDPOINTS.COHORTS.BASE).catch(() => null),
          apiClient.get(API_ENDPOINTS.COURSES.BASE).catch(() => null)
        ]);

        const dbCohorts = normalizeListResponse(cohortsRes?.data);
        const dbCourses = normalizeListResponse(coursesRes?.data);

        if (isMounted) {
          setCohorts(dbCohorts);
          setCourses(dbCourses);
        }
      } catch (err) {
        console.error("Failed to load database cohorts:", err);
        if (isMounted) setCohorts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const getCourseName = (courseId) => {
    if (!courseId) return "General Track";
    const course = courses.find(c => c.id === courseId);
    return course ? (course.name || course.title) : courseId;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Cohort Management ({cohorts.length} DB Batches)</h1>
          <p>Database synchronization active — listing all PostgreSQL cohort records</p>
        </div>

        <Link to="/admin/add-cohort" className={styles.addBtn}>
          + Add Cohort
        </Link>
      </div>

      {loading ? (
        <p style={{ color: "#64748b" }}>Loading real cohort records from database...</p>
      ) : cohorts.length === 0 ? (
        <p style={{ color: "#64748b" }}>No cohorts exist in database. Create one from the button above.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Cohort Name & Code</th>
                <th>Course Track</th>
                <th>Start Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {cohorts.map((cohort) => (
                <tr key={cohort.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "12px", verticalAlign: "middle" }}>
                    <strong style={{ color: "#0f172a", fontSize: "15px", display: "block" }}>{cohort.name || cohort.code}</strong>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>Code: {cohort.code}</span>
                  </td>
                  <td style={{ padding: "12px", fontWeight: "600", color: "#4338ca", verticalAlign: "middle" }}>
                    {cohort.course_name || cohort.course?.name || getCourseName(cohort.course)}
                  </td>
                  <td style={{ padding: "12px", verticalAlign: "middle" }}>{cohort.start_date || "N/A"}</td>
                  <td style={{ padding: "12px", verticalAlign: "middle" }} className={cohort.status === "ACTIVE" ? styles.active : cohort.status === "OPEN" ? styles.upcoming : styles.completed}>
                    <div style={{ fontWeight: "bold" }}>{cohort.status || "OPEN"}</div>
                    {cohort.status === "OPEN" && cohort.end_date && (
                      <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>
                        Closes: {cohort.end_date}
                      </div>
                    )}
                  </td>

                  {/* 🎨 100% PERFECTLY ALIGNED BASELINE ACTION BUTTONS 🎨 */}
                  <td style={{ padding: "12px", verticalAlign: "middle" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", verticalAlign: "middle" }}>
                      <Link
                        to={`/admin/cohort-details/${cohort.id}`}
                        style={getActionBtnStyle("#2563eb")}
                      >
                        View
                      </Link>

                      <Link
                        to={`/admin/edit-cohort/${cohort.id}`}
                        style={getActionBtnStyle("#d97706")}
                      >
                        Edit
                      </Link>

                      {cohort.status !== "OPEN" && cohort.status !== "ACTIVE" ? (
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", verticalAlign: "middle" }}>
                          {publishCohortId === cohort.id ? (
                            <>
                              <input
                                type="date"
                                value={publishDate}
                                onChange={(e) => setPublishDate(e.target.value)}
                                style={{ padding: "4px 8px", fontSize: "12px", borderRadius: "6px", border: "1px solid #cbd5e1", height: "34px", boxSizing: "border-box", verticalAlign: "middle" }}
                              />
                              <button
                                type="button"
                                onClick={() => handlePublish(cohort.id)}
                                style={getActionBtnStyle("#059669")}
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setPublishCohortId(null)}
                                style={getActionBtnStyle("#64748b")}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setPublishCohortId(cohort.id)}
                              style={getActionBtnStyle("#059669")}
                            >
                              Publish
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStop(cohort.id)}
                          style={getActionBtnStyle("#dc2626")}
                        >
                          Stop Applications
                        </button>
                      )}
                    </div>
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

export default Cohorts;