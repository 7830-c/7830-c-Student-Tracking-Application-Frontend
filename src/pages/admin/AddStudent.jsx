import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./AddStudent.module.css";

function AddStudent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    role: "STUDENT",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.first_name.trim() || !form.last_name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Please provide the student's first name, last name, email, and password.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      await apiClient.post(API_ENDPOINTS.USERS.BASE, {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        phone_number: form.phone_number.trim() || null,
        password: form.password,
        role: "STUDENT",
      });

      setSuccess("Student account created successfully.");
      navigate("/admin/students");
    } catch (err) {
      const message = err?.response?.data?.detail || err?.response?.data?.email?.[0] || "Unable to create the student account.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1>Add New Student</h1>

        {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
        {success ? <p style={{ color: "#166534" }}>{success}</p> : null}

        <form className={styles.form} onSubmit={handleSubmit}>
          <input type="text" name="first_name" value={form.first_name} onChange={handleChange} placeholder="First Name" />
          <input type="text" name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last Name" />
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email Address" />
          <input type="text" name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="Phone Number" />
          <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Temporary Password" />

          <div className={styles.buttons}>
            <button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Student"}</button>
            <Link to="/admin/students">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;