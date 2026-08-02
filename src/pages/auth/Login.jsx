import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLinkedin } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { setAccessToken, setRefreshToken, setUserInfo, parseJwt } from "../../utils/tokenStorage";
import heroImage from "../../assets/images/hero.svg";
import styles from "./Login.module.css";

function Login() {
  const navigate = useNavigate();
  const { login, updateUser } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check for LinkedIn OAuth redirect tokens in URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const access = params.get("access");
    const refresh = params.get("refresh");

    if (access) {
      setAccessToken(access);
      if (refresh) setRefreshToken(refresh);
      const decoded = parseJwt(access) || {};
      const firstName = params.get("firstName") || decoded.first_name || decoded.firstName || "";
      const lastName = params.get("lastName") || decoded.last_name || decoded.lastName || "";
      const email = params.get("email") || decoded.email || "linkedin_user@sureproed.com";
      const userObj = {
        id: decoded.user_id || decoded.id || undefined,
        email,
        first_name: firstName,
        last_name: lastName,
        firstName,
        lastName,
        role: decoded.role || "STUDENT",
      };
      setUserInfo(userObj);
      updateUser(userObj);
      window.history.replaceState({}, "", "/login");
      navigate("/student/profile", { replace: true });
    }
  }, [navigate, updateUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(username, password);
      const userRole = res?.user?.role;
      if (userRole === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (userRole === "MENTOR") {
        navigate("/mentor/dashboard");
      } else {
        navigate("/student/profile");
      }
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
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedInAuth = async () => {
    setError("");
    try {
      const data = await authService.getLinkedInConnectUrl();
      const targetUrl = data?.authorization_url || data?.auth_url;
      if (targetUrl) {
        window.location.href = targetUrl;
      } else {
        setError("Could not retrieve LinkedIn authorization URL.");
      }
    } catch (err) {
      console.error("LinkedIn Auth Error:", err);
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
            Access is available for registered students, mentors, and administrators.
          </p>

          {error && <div style={{ color: "#dc2626", marginBottom: "1rem", fontSize: "14px", backgroundColor: "#fef2f2", padding: "0.5rem", borderRadius: "4px" }}>❌ {error}</div>}

          {/* Email & Password Form */}
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Email / Username</label>
              <input
                type="text"
                className={styles.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Email or Username (e.g. student@sureproed.com)"
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
            <h3>Portal Access</h3>
            <ul>
              <li>Students: Use Student Login or Sign in with LinkedIn</li>
              <li>Mentors: Use Email Login or <Link to="/mentor/login">Mentor Portal</Link></li>
              <li>Admins: Use Email Login or <Link to="/admin/login">Admin Portal</Link></li>
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