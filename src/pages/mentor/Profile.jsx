import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./Profile.module.css";

function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        password: "",
      });
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!user?.id) {
      setError("Your profile could not be loaded.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        phone_number: form.phone_number.trim() || null,
      };

      if (form.password.trim()) {
        payload.password = form.password;
      }

      const response = await apiClient.put(API_ENDPOINTS.USERS.BY_ID(user.id), payload);
      updateUser({
        first_name: response.data.first_name || form.first_name,
        last_name: response.data.last_name || form.last_name,
        email: response.data.email || form.email,
        phone_number: response.data.phone_number || form.phone_number,
      });
      setSuccess("Profile updated successfully.");
    } catch (err) {
      const message = err?.response?.data?.detail || err?.response?.data?.email?.[0] || "Unable to update profile.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const fullName = `${form.first_name || ""} ${form.last_name || ""}`.trim() || form.email || "Mentor";

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>{fullName.charAt(0).toUpperCase()}</div>
          <div>
            <h2>{fullName}</h2>
            <p>Mentor account</p>
          </div>
        </div>

        {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
        {success ? <p style={{ color: "#166534" }}>{success}</p> : null}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.group}>
            <label>First Name</label>
            <input type="text" name="first_name" value={form.first_name} onChange={handleChange} />
          </div>
          <div className={styles.group}>
            <label>Last Name</label>
            <input type="text" name="last_name" value={form.last_name} onChange={handleChange} />
          </div>
          <div className={styles.group}>
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} />
          </div>
          <div className={styles.group}>
            <label>Phone</label>
            <input type="text" name="phone_number" value={form.phone_number} onChange={handleChange} />
          </div>
          <div className={styles.full}>
            <label>Change Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Leave blank to keep current password" />
          </div>
          <button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
