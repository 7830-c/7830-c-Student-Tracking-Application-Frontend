import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userService } from "../../services/userService";
import { studentService } from "../../services/studentService";
import styles from "./Signup.module.css";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please verify and try again.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        phone_number: formData.phoneNumber ? formData.phoneNumber.trim() : null,
        role: "STUDENT",
      };

      await userService.createUser(payload);

      // Register profile details in local storage as well for fast access
      await studentService.registerStudentProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
      });

      setSuccess("Account Created Successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);
      const resData = err.response?.data;
      let msg = "Failed to create account. Please check your inputs and try again.";
      if (resData) {
        if (typeof resData === "string") {
          msg = resData;
        } else if (resData.email) {
          msg = Array.isArray(resData.email) ? `Email: ${resData.email.join(" ")}` : `Email: ${resData.email}`;
        } else if (resData.detail) {
          msg = resData.detail;
        } else if (typeof resData === "object") {
          msg = Object.entries(resData)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(" ") : v}`)
            .join(" | ");
        }
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupPage}>
      <div className={styles.signupCard}>
        <div className={styles.header}>
          <h1>Welcome to Sure ProEd</h1>

          <p>
            Start your internship journey by creating your student account.
          </p>
        </div>

        <div className={styles.formSection}>
          <h2>Create Student Account</h2>

          {error && (
            <div style={{ color: "#dc2626", marginBottom: "1rem", fontSize: "14px", textAlign: "center", backgroundColor: "#fef2f2", padding: "0.5rem", borderRadius: "4px" }}>
              ❌ {error}
            </div>
          )}

          {success && (
            <div style={{ color: "#16a34a", marginBottom: "1rem", fontSize: "14px", textAlign: "center", fontWeight: "600", backgroundColor: "#f0fdf4", padding: "0.5rem", borderRadius: "4px" }}>
              ✅ {success}
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter First Name"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter Last Name"
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email Address"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter Phone Number"
              />
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className={styles.signupButton}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <p className={styles.loginText}>
              Already have an account?{" "}
              <Link to="/login">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;