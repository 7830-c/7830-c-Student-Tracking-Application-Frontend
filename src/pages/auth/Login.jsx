import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLinkedin } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import heroImage from "../../assets/images/hero.svg";
import styles from "./Login.module.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate("/student/profile");
    } catch (err) {
      console.error("Login error:", err);
      const resData = err.response?.data;
      let msg = "Invalid credentials. Please try again.";
      if (resData) {
        if (typeof resData === "string") {
          msg = resData;
        } else if (resData.detail) {
          msg = resData.detail;
        } else if (resData.non_field_errors) {
          msg = Array.isArray(resData.non_field_errors)
            ? resData.non_field_errors.join(" ")
            : resData.non_field_errors;
        } else if (typeof resData === "object") {
          msg = Object.entries(resData)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(" ") : v}`)
            .join(" | ");
        }
      }
      setError(msg);
    }
 finally {
      setLoading(false);
    }
  };

  const handleLinkedInAuth = async () => {
    try {
      const data = await authService.getLinkedInConnectUrl();
      if (data?.auth_url) {
        window.location.href = data.auth_url;
      }
    } catch (err) {
      setError("Failed to connect to LinkedIn OAuth provider.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginWrapper}>
        {/* Left Side */}
        <div className={styles.leftSide}>
          <img src={heroImage} alt="Student Login" className={styles.image} />
        </div>

        {/* Right Side */}
        <div className={styles.card}>
          <h1>Student Login</h1>

          <p className={styles.subtitle}>
            Access is available only for students who have successfully
            qualified the screening exam and have been assigned to an
            internship cohort.
          </p>

          {error && <div style={{ color: "#dc2626", marginBottom: "1rem", fontSize: "14px" }}>{error}</div>}

          {/* Email & Password Form above LinkedIn button */}
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Email / Username</label>
              <input
                type="text"
                className={styles.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Email or Username"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Password</label>
              <input
                type="password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                required
              />
            </div>

            <div className={styles.forgotPassword}>
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            <button
              type="submit"
              className={styles.loginBtn}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login to Account"}
            </button>
          </form>

          <div className={styles.divider}>
            <span>OR</span>
          </div>

          <button className={styles.linkedinBtn} onClick={handleLinkedInAuth} type="button">
            <FaLinkedin />
            <span>Sign in with LinkedIn</span>
          </button>

          <div className={styles.infoBox}>
            <h3>Who can login?</h3>
            <ul>
              <li>Qualified Screening Exam</li>
              <li>Assigned to Internship Cohort</li>
              <li>LinkedIn Account Connected</li>
            </ul>
          </div>

          <p className={styles.note}>New student?</p>

          <Link to="/signup" className={styles.signupLink}>
            Create Student Account
          </Link>

          <Link to="/" className={styles.homeLink}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;