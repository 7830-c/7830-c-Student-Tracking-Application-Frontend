import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import apiClient, { normalizeListResponse } from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { applicationService } from "../../services/applicationService";
import { courseService } from "../../services/courseService";

function CohortDetails() {
  const { id } = useParams();
  const [cohort, setCohort] = useState(null);
  const [courseName, setCourseName] = useState("General Track");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        let cohortData = null;

        // Try API first
        try {
          const cohortRes = await apiClient.get(API_ENDPOINTS.COHORTS.BY_ID(id));
          if (cohortRes?.data?.id) {
            cohortData = cohortRes.data;
          }
        } catch (apiErr) {
          console.warn("API load failed for cohort, checking local storage:", apiErr);
        }

        // Fallback to local storage
        if (!cohortData) {
          const localCohorts = JSON.parse(localStorage.getItem("sure_local_cohorts") || "[]");
          cohortData = localCohorts.find((c) => String(c.id) === String(id) || String(c.code).toLowerCase() === String(id).toLowerCase());
        }

        if (!cohortData) {
          setError(`Cohort record '${id}' could not be located.`);
          return;
        }

        setCohort(cohortData);

        // Resolve Course Name
        if (cohortData.course) {
          if (typeof cohortData.course === "object") {
            setCourseName(cohortData.course.name || cohortData.course.title || "General Track");
          } else {
            const courseRes = await courseService.getCourseById(cohortData.course).catch(() => null);
            setCourseName(courseRes?.name || courseRes?.title || "General Track");
          }
        }

        // Fetch Enrolled Students/Applications for this Cohort
        const appsRes = await applicationService.getApplications().catch(() => []);
        const allApps = normalizeListResponse(appsRes);
        const cohortStudents = allApps.filter(app => app.assigned_cohort === id || app.assigned_cohort?.id === id);
        setStudents(cohortStudents);

      } catch (err) {
        console.error("Failed to load details:", err);
        setError("Unable to load cohort details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadData();
  }, [id]);

  if (loading) return <div style={{ padding: "2rem", color: "#64748b" }}><h2>Loading cohort data...</h2></div>;
  if (error) return <div style={{ padding: "2rem", color: "#dc2626" }}><h2>⚠️ {error}</h2><Link to="/admin/cohorts" style={{ color: "#2563eb", fontWeight: "bold" }}>← Back to Cohort Directory</Link></div>;
  if (!cohort) return <div style={{ padding: "2rem", color: "#64748b" }}><h2>No cohort found.</h2><Link to="/admin/cohorts" style={{ color: "#2563eb", fontWeight: "bold" }}>← Back to Cohort Directory</Link></div>;

  const mentorNames = (cohort.mentors || []).map(m => typeof m === "object" ? `${m.first_name || ""} ${m.last_name || ""}`.trim() : m).join(", ") || "Not assigned";

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Top Header Card */}
      <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <span style={{ backgroundColor: "#dbeafe", color: "#1e40af", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "bold" }}>{cohort.status || "OPEN"}</span>
          <h1 style={{ fontSize: "2rem", margin: "10px 0", color: "#111827" }}>{cohort.name || cohort.code}</h1>
          <p style={{ fontSize: "1.1rem", color: "#4338ca", fontWeight: "600", margin: 0 }}>Course: {courseName}</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link to={`/admin/edit-cohort/${cohort.id || cohort.code}`} style={{ padding: "10px 20px", backgroundColor: "#d97706", color: "white", borderRadius: "8px", textDecoration: "none", fontWeight: "bold" }}>Edit Cohort</Link>
          <Link to="/admin/cohorts" style={{ padding: "10px 20px", backgroundColor: "#f3f4f6", color: "#374151", borderRadius: "8px", textDecoration: "none", fontWeight: "bold" }}>Back</Link>
        </div>
      </div>

      {/* Details Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
          <p style={{ margin: 0, fontSize: "12px", color: "#6b7280", textTransform: "uppercase", fontWeight: "bold" }}>Mentors</p>
          <p style={{ margin: "5px 0 0 0", fontWeight: "600", color: "#1f2937" }}>{mentorNames}</p>
        </div>
        <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
          <p style={{ margin: 0, fontSize: "12px", color: "#6b7280", textTransform: "uppercase", fontWeight: "bold" }}>Start & End Dates</p>
          <p style={{ margin: "5px 0 0 0", fontWeight: "600", color: "#1f2937" }}>{cohort.start_date || "N/A"} ➔ {cohort.end_date || "TBD"}</p>
        </div>
        <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
          <p style={{ margin: 0, fontSize: "12px", color: "#6b7280", textTransform: "uppercase", fontWeight: "bold" }}>Capacity</p>
          <p style={{ margin: "5px 0 0 0", fontWeight: "600", color: "#1f2937" }}>{students.length} / {cohort.max_students || 30}</p>
        </div>
        <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
          <p style={{ margin: 0, fontSize: "12px", color: "#6b7280", textTransform: "uppercase", fontWeight: "bold" }}>Meeting Link</p>
          <a href={cohort.meeting_link || "#"} target="_blank" rel="noreferrer" style={{ display: "block", margin: "5px 0 0 0", fontWeight: "600", color: "#2563eb", overflow: "hidden", textOverflow: "ellipsis" }}>{cohort.meeting_link || "Not Set"}</a>
        </div>
      </div>

      {/* Enrolled Students Table */}
      <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", overflow: "hidden" }}>
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb" }}>
          <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#111827" }}>Enrolled Students</h2>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead style={{ backgroundColor: "#f3f4f6" }}>
            <tr>
              <th style={{ padding: "1rem", color: "#374151" }}>Name</th>
              <th style={{ padding: "1rem", color: "#374151" }}>Email</th>
              <th style={{ padding: "1rem", color: "#374151" }}>Status</th>
              <th style={{ padding: "1rem", color: "#374151" }}>Resume</th>
              <th style={{ padding: "1rem", color: "#374151" }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>No students enrolled in this cohort yet.</td></tr>
            ) : (
              students.map((app) => (
                <tr key={app.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "1rem", fontWeight: "600", color: "#111827" }}>{app.student?.user?.first_name || app.student?.first_name} {app.student?.user?.last_name || app.student?.last_name}</td>
                  <td style={{ padding: "1rem", color: "#4b5563" }}>{app.student?.user?.email || app.student?.email}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ padding: "4px 8px", backgroundColor: app.status === "ACCEPTED" ? "#dcfce7" : "#fef3c7", color: app.status === "ACCEPTED" ? "#166534" : "#92400e", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>
                      {app.status}
                    </span>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    {(app.student?.resume || app.resume) ? (
                      <a href={app.student?.resume || app.resume} target="_blank" rel="noreferrer" style={{ color: "#2563eb", fontWeight: "bold", textDecoration: "none" }}>View Resume</a>
                    ) : <span style={{ color: "#9ca3af" }}>N/A</span>}
                  </td>
                  <td style={{ padding: "1rem", fontWeight: "bold", color: "#4f46e5" }}>
                    {app.score || app.exam_score || "Pending"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CohortDetails;