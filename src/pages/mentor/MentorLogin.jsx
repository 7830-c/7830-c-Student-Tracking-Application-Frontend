import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./MentorLogin.module.css";

function MentorLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password);
      navigate("/mentor/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Invalid Mentor Credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <h1>Mentor Login</h1>

        <p>
          Login to access the Sure ProEd Mentor Portal.
        </p>

        {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}

        <form onSubmit={handleLogin}>

          <div className={styles.group}>
            <label>Username / Email</label>

            <input
              type="text"
              placeholder="Enter Mentor Username or Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles.group}>
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={styles.button}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default MentorLogin;