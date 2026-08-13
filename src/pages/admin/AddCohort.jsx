import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { useAuth } from "../../context/AuthContext";

function AddCohort() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [adminUserId, setAdminUserId] = useState(user?.id || null);

  const [form, setForm] = useState({
    code: "G35",
    name: "Batch G35 - Professional Track",
    course: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    max_students: 30,
    status: "OPEN",
    meeting_link: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Multi-page harvester for courses
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

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingCourses(true);
        const [courseList, usersList] = await Promise.all([
          fetchAllPages("/api/courses/"),
          fetchAllPages("/api/users/").catch(() => []),
        ]);

        setCourses(courseList);
        if (courseList.length > 0) {
          setForm((prev) => ({ ...prev, course: courseList[0].id }));
        }

        const foundAdmin = usersList.find((u) => u.email === user?.email || u.role === "ADMIN") || usersList[0];
        if (foundAdmin?.id) {
          setAdminUserId(foundAdmin.id);
        }
      } catch (err) {
        console.error("Failed to load cohort form data:", err);
      } finally {
        setLoadingCourses(false);
      }
    };

    loadData();
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    let codeVal = form.code.trim().toUpperCase();
    if (!codeVal.startsWith("G")) {
      codeVal = `G${codeVal.replace(/[^0-9]/g, "") || "35"}`;
    }

    if (!codeVal || !form.name.trim() || !form.course || !form.start_date || !form.end_date) {
      setError("Please provide the cohort code (e.g. G35), name, course, and both start/end dates.");
      return;
    }

    setLoading(true);

    try {
      let creatorId = adminUserId || user?.id;
      if (!creatorId) {
        const uRes = await apiClient.get("/api/users/?role=ADMIN").catch(() => null);
        const uList = Array.isArray(uRes?.data) ? uRes.data : (uRes?.data?.results || []);
        if (uList.length > 0) creatorId = uList[0].id;
      }

      const payload = {
        code: codeVal,
        name: form.name.trim(),
        course: form.course,
        start_date: form.start_date,
        end_date: form.end_date,
        max_students: Number(form.max_students) || 30,
        status: (form.status === "ACTIVE" || form.status === "COMPLETED") ? "OPEN" : form.status,
      };

      if (creatorId) {
        payload.created_by = creatorId;
      }

      if (form.meeting_link.trim()) {
        payload.meeting_link = form.meeting_link.trim();
      }

      await apiClient.post(API_ENDPOINTS.COHORTS.BASE, payload);
      setSuccess("✅ Cohort batch created successfully in database!");
      setTimeout(() => {
        navigate("/admin/cohorts");
      }, 800);
    } catch (err) {
      console.error("Cohort Creation Error:", err.response?.data);
      let serverMsg = "";
      if (err?.response?.data) {
        const d = err.response.data;
        if (typeof d === "string") serverMsg = d;
        else if (d.created_by) serverMsg = `created_by: ${Array.isArray(d.created_by) ? d.created_by.join(" ") : String(d.created_by)}`;
        else if (d.code) serverMsg = `Code error: ${Array.isArray(d.code) ? d.code.join(" ") : String(d.code)}`;
        else if (d.status) serverMsg = `Status error: ${Array.isArray(d.status) ? d.status.join(" ") : String(d.status)}`;
        else if (d.detail) serverMsg = String(d.detail);
        else serverMsg = JSON.stringify(d);
      }
      setError(serverMsg || "Unable to save cohort to database. Please check field format.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ margin: 0, color: "#111827", fontSize: "2rem" }}>Add New Batch / Cohort</h1>
          <p style={{ color: "#6b7280", margin: "4px 0 0 0" }}>Create a new training group and save directly to PostgreSQL DB.</p>
        </div>
        <Link to="/admin/cohorts" style={{ padding: "10px 20px", backgroundColor: "#f3f4f6", color: "#374151", borderRadius: "8px", textDecoration: "none", fontWeight: "bold" }}>← Back to Batches</Link>
      </div>

      <div style={{ backgroundColor: "white", padding: "2.5rem", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
        {error ? <div style={{ color: "#b91c1c", backgroundColor: "#fee2e2", border: "1px solid #fca5a5", padding: "14px", borderRadius: "8px", marginBottom: "1.5rem", fontWeight: "bold" }}>❌ {error}</div> : null}
        {success ? <div style={{ color: "#166534", backgroundColor: "#dcfce7", border: "1px solid #86efac", padding: "14px", borderRadius: "8px", marginBottom: "1.5rem", fontWeight: "bold" }}>{success}</div> : null}

        {loadingCourses ? (
          <p style={{ color: "#6b7280", fontWeight: "bold" }}>Loading Domain options...</p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontWeight: "bold", color: "#374151", fontSize: "14px" }}>
                Group / Cohort Code * <span style={{ color: "#6b7280", fontWeight: "normal", fontSize: "12px" }}>(Format: 'G' + Number e.g. G35)</span>
              </label>
              <input type="text" name="code" value={form.code} onChange={handleChange} placeholder="e.g. G35" style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", fontWeight: "bold" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontWeight: "bold", color: "#374151", fontSize: "14px" }}>Group / Cohort Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter batch name (e.g. Batch G35)" style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontWeight: "bold", color: "#374151", fontSize: "14px" }}>Assign Course / Domain * ({courses.length} Options Available)</label>
              <select name="course" value={form.course} onChange={handleChange} style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", backgroundColor: "white", fontWeight: "bold" }}>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.domain || "Domain"})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontWeight: "bold", color: "#374151", fontSize: "14px" }}>Maximum Students *</label>
              <input type="number" name="max_students" value={form.max_students} onChange={handleChange} min="1" style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontWeight: "bold", color: "#374151", fontSize: "14px" }}>Start Date *</label>
              <input type="date" name="start_date" value={form.start_date} onChange={handleChange} style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontWeight: "bold", color: "#374151", fontSize: "14px" }}>End Date *</label>
              <input type="date" name="end_date" value={form.end_date} onChange={handleChange} style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontWeight: "bold", color: "#374151", fontSize: "14px" }}>Batch Status *</label>
              <select name="status" value={form.status} onChange={handleChange} style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", backgroundColor: "white", fontWeight: "bold" }}>
                <option value="OPEN">Open (Open for Applications)</option>
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active (In Progress)</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontWeight: "bold", color: "#374151", fontSize: "14px" }}>Temporary Meeting Link (Optional)</label>
              <input type="url" name="meeting_link" value={form.meeting_link} onChange={handleChange} placeholder="https://meet.google.com/..." style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db" }} />
            </div>

            <div style={{ gridColumn: "1 / -1", display: "flex", gap: "1rem", marginTop: "1rem", borderTop: "1px solid #e5e7eb", paddingTop: "1.5rem" }}>
              <button type="submit" disabled={loading} style={{ padding: "12px 28px", backgroundColor: "#2563eb", color: "white", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer", fontSize: "15px" }}>
                {loading ? "Saving to Database..." : "Create Cohort Batch"}
              </button>
              <Link to="/admin/cohorts" style={{ padding: "12px 24px", backgroundColor: "#f3f4f6", color: "#374151", borderRadius: "8px", textDecoration: "none", fontWeight: "bold" }}>Cancel</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AddCohort;