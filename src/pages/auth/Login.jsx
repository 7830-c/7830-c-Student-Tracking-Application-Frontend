import { useState } from "react";
import styles from "./Login.module.css";
import {
  FaLinkedin,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import heroImage from "../../assets/images/hero.svg";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.loginWrapper}>

        {/* Left Side */}
        <div className={styles.leftSide}>
          <img
            src={heroImage}
            alt="Student"
            className={styles.image}
          />
        </div>

        {/* Right Side */}
        <div className={styles.card}>
          <h1>Welcome Back</h1>

          <p>
            Sign in to continue to your Student Tracking Dashboard.
          </p>

          <button className={styles.linkedinBtn}>
            <FaLinkedin />
            Continue with LinkedIn
          </button>

          <div className={styles.inputBox}>
            <FaLock className={styles.icon} />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Application Password"
            />

            <span
              className={styles.eye}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button className={styles.loginBtn}>
            Login
          </button>

          <a href="/">← Back to Home</a>
        </div>

      </div>
    </div>
  );
}

export default Login;