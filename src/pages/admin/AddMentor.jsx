import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./AddMentor.module.css";

function AddMentor() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    role: "MENTOR",
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.first_name.trim() || !form.last_name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Please provide the mentor's first name, last name, email, and a password.");
      return;
    }

    if (form.password.length < 8) {
      setError("The password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        phone_number: form.phone_number.trim() || null,
        password: form.password,
        role: "MENTOR",
        is_active: form.is_active,
      };

      await apiClient.post(API_ENDPOINTS.USERS.BASE, payload);
      setSuccess("Mentor account created successfully. Share the email and password with the mentor.");
      navigate("/admin/mentors");
    } catch (err) {
      const message = err?.response?.data?.detail || err?.response?.data?.email?.[0] || "Unable to create the mentor account.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1>Add New Mentor</h1>
        <p className={styles.subtitle}>Enter mentor information below.</p>

        {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
        {success ? <p style={{ color: "#166534" }}>{success}</p> : null}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.group}>
            <label>First Name</label>
            <input type="text" name="first_name" value={form.first_name} onChange={handleChange} placeholder="Enter first name" />
          </div>

          <div className={styles.group}>
            <label>Last Name</label>
            <input type="text" name="last_name" value={form.last_name} onChange={handleChange} placeholder="Enter last name" />
          </div>

          <div className={styles.group}>
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter email" />
          </div>

          <div className={styles.group}>
            <label>Phone Number</label>
            <input type="tel" name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="Enter phone number" />
          </div>

          <div className={styles.group}>
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Create a temporary password" />
          </div>

          <div className={styles.group}>
            <label>Active</label>
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
          </div>

          <div className={styles.buttons}>
            <button type="submit" className={styles.saveBtn} disabled={loading}>
              {loading ? "Saving..." : "Save Mentor"}
            </button>
            <Link to="/admin/mentors" className={styles.cancelBtn}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMentor;