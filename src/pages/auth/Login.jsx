import { Link } from "react-router-dom";
import { FaLinkedin } from "react-icons/fa";
import heroImage from "../../assets/images/hero.svg";
import styles from "./Login.module.css";

function Login() {
  return (
    <div className={styles.container}>
      <div className={styles.loginWrapper}>

        {/* Left Side */}
        <div className={styles.leftSide}>
          <img
            src={heroImage}
            alt="Student Login"
            className={styles.image}
          />
        </div>

        {/* Right Side */}
        <div className={styles.card}>

          <h1>Student Login</h1>

          <p className={styles.subtitle}>
            Access is available only for students who have successfully
            qualified the screening exam and have been assigned to an
            internship cohort.
          </p>

          <button className={styles.linkedinBtn}>
            <FaLinkedin />
            <span>Continue with LinkedIn</span>
          </button>

          <div className={styles.forgotPassword}>
            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </div>

          <div className={styles.infoBox}>
            <h3>Who can login?</h3>

            <ul>
              <li>Qualified Screening Exam</li>
              <li>Assigned to Internship Cohort</li>
              <li>LinkedIn Account Connected</li>
            </ul>
          </div>

          <p className={styles.note}>
            New student?
          </p>

          <Link
            to="/signup"
            className={styles.signupLink}
          >
            Create Student Account
          </Link>

          <Link
            to="/"
            className={styles.homeLink}
          >
            ← Back to Home
          </Link>

        </div>

      </div>
    </div>
  );
}

export default Login;