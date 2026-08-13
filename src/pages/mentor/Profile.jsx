import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../services/apiClient";
import styles from "./Profile.module.css";

function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    assigned_course: "General Track",
    experience_years: "5",
    bio: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resolveName = (userObj, emailStr) => {
    if (userObj) {
      const fn = (userObj.first_name || "").trim();
      const ln = (userObj.last_name || "").trim();
      if (fn || ln) return `${fn} ${ln}`.trim();
    }
    if (emailStr && emailStr.includes("@")) {
      const prefix = emailStr.split("@")[0];
      return prefix.replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }
    return "Mentor Account";
  };

  useEffect(() => {
    let isMounted = true;
    const loadMentorDetails = async () => {
      try {
        setFetching(true);
        let userObj = user || {};
        let mentorProfileObj = {};

        // Try fetching user profile by ID or current user me
        const meRes = await apiClient.get("/api/users/me/").catch(() => null);
        if (meRes?.data) {
          userObj = meRes.data;
        } else if (user?.email) {
          const uListRes = await apiClient.get("/api/users/").catch(() => null);
          const users = Array.isArray(uListRes?.data) ? uListRes.data : uListRes?.data?.results || [];
          const found = users.find((u) => u.email === user.email);
          if (found) userObj = found;
        }

        // Try fetching mentor profile by user ID or email
        const mpRes = await apiClient.get("/api/mentor-profile/").catch(() => null);
        const profiles = Array.isArray(mpRes?.data) ? mpRes.data : mpRes?.data?.results || [];
        const foundMp = profiles.find((p) => {
          const uid = typeof p.user === "object" ? p.user.id : p.user;
          return uid === userObj.id || p.user_email === userObj.email;
        });
        if (foundMp) mentorProfileObj = foundMp;

        const emailVal = userObj.email || user?.email || "mentor@sureproed.com";
        const inferredFirstName = userObj.first_name || (emailVal.includes("@") ? emailVal.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Demo");
        const inferredLastName = userObj.last_name || "";

        if (isMounted) {
          setForm({
            first_name: inferredFirstName,
            last_name: inferredLastName,
            email: emailVal,
            phone_number: userObj.phone_number || mentorProfileObj.phone_number || "",
            assigned_course: mentorProfileObj.course_name || "General Track",
            experience_years: mentorProfileObj.experience_years ? String(mentorProfileObj.experience_years) : "5",
            bio: mentorProfileObj.bio || "Senior Mentor at Sure ProEd Internship Portal",
            password: "",
          });
        }
      } catch (err) {
        console.error("Failed to load mentor details:", err);
      } finally {
        if (isMounted) setFetching(false);
      }
    };

    loadMentorDetails();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
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

      if (user?.id) {
        await apiClient.patch(`/api/users/${user.id}/`, payload).catch(() => null);
      }

      updateUser({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone_number: form.phone_number,
      });

      setSuccess("✅ Mentor profile updated successfully!");
    } catch (err) {
      const message = err?.response?.data?.detail || "Unable to update profile.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const fullName = `${form.first_name || ""} ${form.last_name || ""}`.trim() || resolveName(user, form.email);
  const avatarLetter = (fullName.charAt(0) || "M").toUpperCase();

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "0 1rem" }}>
      {/* HEADER BANNER CARD */}
      <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", marginBottom: "2rem", border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {/* Avatar Circle */}
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", backgroundColor: "#2563eb", color: "white", fontSize: "2rem", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {avatarLetter}
          </div>

          <div>
            <h1 style={{ margin: 0, fontSize: "1.75rem", color: "#0f172a" }}>{fullName}</h1>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "6px" }}>
              <span style={{ fontSize: "14px", color: "#2563eb", fontWeight: 600 }}>{form.email}</span>
              <span style={{ backgroundColor: "#dbeafe", color: "#1e40af", padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: 700 }}>
                Verified Mentor
              </span>
              <span style={{ backgroundColor: "#fef3c7", color: "#92400e", padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: 700 }}>
                {form.assigned_course}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FORM CARD */}
      <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", border: "1px solid #e2e8f0" }}>
        <h2 style={{ marginTop: 0, color: "#1e293b", fontSize: "1.25rem", marginBottom: "1.5rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
          Personal Profile & Account Settings
        </h2>

        {error && <div style={{ backgroundColor: "#fef2f2", color: "#b91c1c", padding: "0.75rem 1rem", borderRadius: "8px", marginBottom: "1rem", fontWeight: 600 }}>{error}</div>}
        {success && <div style={{ backgroundColor: "#f0fdf4", color: "#15803d", padding: "0.75rem 1rem", borderRadius: "8px", marginBottom: "1rem", fontWeight: 600 }}>{success}</div>}

        {fetching ? (
          <p style={{ color: "#64748b" }}>Loading profile information...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="Enter First Name"
                  required
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Enter Last Name"
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter Email Address"
                  required
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                  placeholder="Enter Phone Number"
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Assigned Track</label>
                <input
                  type="text"
                  value={form.assigned_course}
                  disabled
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", color: "#64748b", fontSize: "14px", fontWeight: 600, boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Experience (Years)</label>
                <input
                  type="text"
                  name="experience_years"
                  value={form.experience_years}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box" }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Change Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                disabled={loading}
                style={{ padding: "10px 24px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "14px", cursor: "pointer" }}
              >
                {loading ? "Saving Profile..." : "Save Profile Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;
