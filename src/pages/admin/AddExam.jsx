import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./AddExam.module.css";

function AddExam() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState({
    application: "",
    level: "MIXED",
    duration_minutes: "45",
    pass_percentage: "60",
    status: "PENDING",
    total_marks: "100",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadApplications = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.APPLICATIONS.BASE);
        if (isMounted) setApplications(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to load applications:", err);
      }
    };

    loadApplications();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.application) {
      setError("Please select an application before creating an exam.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        application: form.application,
        level: form.level,
        duration_minutes: Number(form.duration_minutes) || 45,
        pass_percentage: Number(form.pass_percentage) || 60,
        status: form.status,
        total_marks: Number(form.total_marks) || 100,
      };

      await apiClient.post(API_ENDPOINTS.EXAMS.BASE, payload);
      setSuccess("Exam created successfully.");
      navigate("/admin/exams");
    } catch (err) {
      const message = err?.response?.data?.detail || err?.response?.data?.message || err?.response?.data?.non_field_errors?.[0] || "Unable to create the exam.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Add New Exam</h1>

        {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
        {success ? <p style={{ color: "#166534" }}>{success}</p> : null}

        <form onSubmit={handleSubmit}>
          <div className={styles.grid}>
            <div>
              <label>Application</label>
              <select name="application" value={form.application} onChange={handleChange} required>
                <option value="">Select an application</option>
                {applications.map((application) => (
                  <option key={application.id} value={application.id}>
                    {application.application_number || application.id} - {application.course?.name || application.course || "Unknown course"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Level</label>
              <select name="level" value={form.level} onChange={handleChange}>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
                <option value="MIXED">Mixed</option>
              </select>
            </div>

            <div>
              <label>Duration (Minutes)</label>
              <input type="number" name="duration_minutes" value={form.duration_minutes} onChange={handleChange} min="1" required />
            </div>

            <div>
              <label>Pass Percentage</label>
              <input type="number" name="pass_percentage" value={form.pass_percentage} onChange={handleChange} min="0" max="100" required />
            </div>

            <div>
              <label>Total Marks</label>
              <input type="number" name="total_marks" value={form.total_marks} onChange={handleChange} min="1" required />
            </div>

            <div>
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="EVALUATED">Evaluated</option>
              </select>
            </div>
          </div>

          <div className={styles.buttons}>
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Add Exam"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddExam;