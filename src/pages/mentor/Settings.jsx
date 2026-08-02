import { useState } from "react";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./Settings.module.css";

function Settings() {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!form.current_password || !form.new_password || !form.confirm_password) {
      setError("Please fill in all password fields.");
      return;
    }

    if (form.new_password !== form.confirm_password) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (form.new_password.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post(API_ENDPOINTS.USERS.RESET_PASSWORD, {
        current_password: form.current_password,
        new_password: form.new_password,
      });
      setMessage(response.data?.detail || "Password updated successfully.");
      setForm({ current_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      const msg = err?.response?.data?.detail || "Unable to update password right now.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Settings</h1>

        <div className={styles.section}>
          <h3>Change Password</h3>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>
              Current Password
              <input type="password" name="current_password" value={form.current_password} onChange={handleChange} />
            </label>

            <label className={styles.label}>
              New Password
              <input type="password" name="new_password" value={form.new_password} onChange={handleChange} />
            </label>

            <label className={styles.label}>
              Confirm New Password
              <input type="password" name="confirm_password" value={form.confirm_password} onChange={handleChange} />
            </label>

            {message ? <p className={styles.success}>{message}</p> : null}
            {error ? <p className={styles.error}>{error}</p> : null}

            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;