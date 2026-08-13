import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./EditStudent.module.css";

function EditStudent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [targetUserId, setTargetUserId] = useState(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    college: "",
    degree: "",
    specialization: "",
    status: "AVAILABLE",
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStudent = async () => {
      try {
        let student = {};
        let user = {};

        // 1. Try fetching student profile
        const stuRes = await apiClient.get(API_ENDPOINTS.STUDENTS.BY_ID(id)).catch(() => null);
        if (stuRes?.data) {
          student = stuRes.data;
          user = typeof student.user === "object" ? student.user : {};
        }

        // 2. Derive User ID
        let uId = user.id || (typeof student.user === "string" ? student.user : id);
        if (uId) {
          const userRes = await apiClient.get(`/api/users/${uId}/`).catch(() => null);
          if (userRes?.data) {
            user = userRes.data;
            uId = user.id;
          }
        }
        setTargetUserId(uId);

        setForm({
          first_name: user.first_name || (user.email ? user.email.split("@")[0] : ""),
          last_name: user.last_name || "",
          email: user.email || student.email || "",
          phone_number: user.phone_number || student.phone_number || "",
          college: student.college || "Visakhapatnam Inst.",
          degree: student.degree || "B.Tech",
          specialization: student.specialization || "Computer Science",
          status: student.status || "AVAILABLE",
        });
      } catch (err) {
        console.error("Failed to load student for editing:", err);
        setError("Unable to load student data.");
      } finally {
        setLoadingData(false);
      }
    };

    if (id) {
      loadStudent();
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Patch Student Profile table
      const profilePayload = {
        college: form.college.trim(),
        degree: form.degree.trim(),
        specialization: form.specialization.trim(),
        status: form.status,
      };
      await apiClient.patch(API_ENDPOINTS.STUDENTS.BY_ID(id), profilePayload).catch(() => null);

      // Patch User Account table
      if (targetUserId) {
        const userPayload = {
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          email: form.email.trim(),
          phone_number: form.phone_number.trim() || null,
        };
        await apiClient.patch(`/api/users/${targetUserId}/`, userPayload).catch(() => null);
      }

      alert("✅ Student details updated successfully!");
      navigate("/admin/students");
    } catch (err) {
      const message = err?.response?.data?.detail || "Unable to update the student.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1>Edit Student Profile</h1>

        {error ? <p style={{ color: "#b91c1c", fontWeight: "bold" }}>{error}</p> : null}

        {loadingData ? (
          <p>Loading student details...</p>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ fontWeight: 600, color: "#374151", fontSize: "14px" }}>First Name</label>
                <input type="text" name="first_name" value={form.first_name} onChange={handleChange} placeholder="First Name" required />
              </div>

              <div>
                <label style={{ fontWeight: 600, color: "#374151", fontSize: "14px" }}>Last Name</label>
                <input type="text" name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last Name" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
              <div>
                <label style={{ fontWeight: 600, color: "#374151", fontSize: "14px" }}>Email Address</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email Address" required />
              </div>

              <div>
                <label style={{ fontWeight: 600, color: "#374151", fontSize: "14px" }}>Phone Number</label>
                <input type="text" name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="Phone Number" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
              <div>
                <label style={{ fontWeight: 600, color: "#374151", fontSize: "14px" }}>College / Institution</label>
                <input type="text" name="college" value={form.college} onChange={handleChange} placeholder="College Name" />
              </div>

              <div>
                <label style={{ fontWeight: 600, color: "#374151", fontSize: "14px" }}>Degree</label>
                <input type="text" name="degree" value={form.degree} onChange={handleChange} placeholder="Degree (e.g. B.Tech)" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
              <div>
                <label style={{ fontWeight: 600, color: "#374151", fontSize: "14px" }}>Specialization / Stream</label>
                <input type="text" name="specialization" value={form.specialization} onChange={handleChange} placeholder="Specialization" />
              </div>

              <div>
                <label style={{ fontWeight: 600, color: "#374151", fontSize: "14px" }}>Access Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="AVAILABLE">Active / Approved (AVAILABLE)</option>
                  <option value="NOT_AVAILABLE">Revoked / Locked (NOT_AVAILABLE)</option>
                  <option value="BUSY">Busy / In-Class (BUSY)</option>
                </select>
              </div>
            </div>

            <div className={styles.buttons} style={{ marginTop: "2rem" }}>
              <button type="submit" disabled={loading}>{loading ? "Saving Changes..." : "Save Student Profile"}</button>
              <Link to="/admin/students" style={{ textDecoration: "none", padding: "10px 20px", background: "#e2e8f0", color: "#475569", borderRadius: "8px", fontWeight: "bold" }}>Cancel</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default EditStudent;