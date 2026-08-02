import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./AddCourse.module.css";

function AddCourse() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    code: "",
    name: "",
    domain: "",
    subject: "",
    description: "",
    prerequisites: "",
    duration_weeks: 4,
    difficulty: "BEGINNER",
    status: "DRAFT",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.USERS.ME);
        setCurrentUser(response.data);
      } catch (err) {
        console.error("Failed to load current user:", err);
      }
    };

    loadCurrentUser();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.code.trim() || !form.name.trim() || !form.domain.trim() || !form.description.trim()) {
      setError("Please provide the course code, name, domain, and description.");
      return;
    }

    if (!currentUser?.id) {
      setError("Your current user profile could not be loaded. Please refresh and try again.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        code: form.code.trim(),
        name: form.name.trim(),
        domain: form.domain.trim(),
        subject: form.subject.trim() || null,
        description: form.description.trim(),
        prerequisites: form.prerequisites.trim() || null,
        duration_weeks: Number(form.duration_weeks) || 4,
        difficulty: form.difficulty,
        status: form.status,
        created_by: currentUser.id,
      };

      await apiClient.post(API_ENDPOINTS.COURSES.BASE, payload);
      setSuccess("Course created successfully.");
      navigate("/admin/courses");
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Unable to create the course right now.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1>Add New Course</h1>
        <p className={styles.subtitle}>Fill in the course details below.</p>

        {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
        {success ? <p style={{ color: "#166534" }}>{success}</p> : null}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.group}>
            <label>Course Code</label>
            <input type="text" name="code" value={form.code} onChange={handleChange} placeholder="e.g. JAVA-01" />
          </div>

          <div className={styles.group}>
            <label>Course Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter course name" />
          </div>

          <div className={styles.group}>
            <label>Domain</label>
            <input type="text" name="domain" value={form.domain} onChange={handleChange} placeholder="e.g. Software Development" />
          </div>

          <div className={styles.group}>
            <label>Subject</label>
            <input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="Optional subject" />
          </div>

          <div className={styles.group}>
            <label>Duration (Weeks)</label>
            <input type="number" name="duration_weeks" value={form.duration_weeks} onChange={handleChange} min="1" />
          </div>

          <div className={styles.group}>
            <label>Difficulty</label>
            <select name="difficulty" value={form.difficulty} onChange={handleChange}>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          <div className={styles.group}>
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div className={styles.groupFull}>
            <label>Description</label>
            <textarea name="description" rows="5" value={form.description} onChange={handleChange} placeholder="Enter course description" />
          </div>

          <div className={styles.groupFull}>
            <label>Prerequisites</label>
            <textarea name="prerequisites" rows="3" value={form.prerequisites} onChange={handleChange} placeholder="Optional prerequisites" />
          </div>

          <div className={styles.buttons}>
            <button type="submit" className={styles.saveBtn} disabled={loading}>
              {loading ? "Saving..." : "Save Course"}
            </button>

            <Link to="/admin/courses" className={styles.cancelBtn}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCourse;