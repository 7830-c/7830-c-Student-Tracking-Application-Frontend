import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient, { normalizeListResponse } from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./AddCohort.module.css";

function AddCohort() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    code: "",
    name: "",
    course: "",
    start_date: "",
    end_date: "",
    max_students: 30,
    status: "DRAFT",
    meeting_link: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesResponse, userResponse] = await Promise.all([
          apiClient.get(API_ENDPOINTS.COURSES.BASE),
          apiClient.get(API_ENDPOINTS.USERS.ME),
        ]);
        setCourses(normalizeListResponse(coursesResponse.data));
        setCurrentUser(userResponse.data);
      } catch (err) {
        console.error("Failed to load cohort form data:", err);
      } finally {
        setLoadingCourses(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.code.trim() || !form.name.trim() || !form.course || !form.start_date || !form.end_date) {
      setError("Please provide the cohort code, name, course, and both dates.");
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
        course: form.course,
        start_date: form.start_date,
        end_date: form.end_date,
        max_students: Number(form.max_students) || 30,
        status: form.status,
        meeting_link: form.meeting_link.trim() || null,
        created_by: currentUser.id,
      };

      await apiClient.post(API_ENDPOINTS.COHORTS.BASE, payload);
      setSuccess("Cohort created successfully.");
      navigate("/admin/cohorts");
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Unable to create the cohort right now.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Add New Cohort</h1>
          <Link to="/admin/cohorts">Back</Link>
        </div>

        {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
        {success ? <p style={{ color: "#166534" }}>{success}</p> : null}

        {loadingCourses ? (
          <p>Loading course options...</p>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.group}>
              <label>Cohort Code</label>
              <input type="text" name="code" value={form.code} onChange={handleChange} placeholder="e.g. JAVA-B1" />
            </div>

            <div className={styles.group}>
              <label>Cohort Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter cohort name" />
            </div>

            <div className={styles.group}>
              <label>Course</label>
              <select name="course" value={form.course} onChange={handleChange}>
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.group}>
              <label>Start Date</label>
              <input type="date" name="start_date" value={form.start_date} onChange={handleChange} />
            </div>

            <div className={styles.group}>
              <label>End Date</label>
              <input type="date" name="end_date" value={form.end_date} onChange={handleChange} />
            </div>

            <div className={styles.group}>
              <label>Maximum Students</label>
              <input type="number" name="max_students" value={form.max_students} onChange={handleChange} min="1" />
            </div>

            <div className={styles.group}>
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="DRAFT">Draft</option>
                <option value="OPEN">Open</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div className={styles.group}>
              <label>Meeting Link</label>
              <input type="url" name="meeting_link" value={form.meeting_link} onChange={handleChange} placeholder="Optional meeting link" />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Cohort"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AddCohort;