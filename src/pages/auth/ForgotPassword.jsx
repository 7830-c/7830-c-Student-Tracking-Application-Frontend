import { Link } from "react-router-dom";
import styles from "./ForgotPassword.module.css";

function ForgotPassword() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <h1>Forgot Password</h1>

        <p>
          Enter your registered email address. We will send you a password
          reset link.
        </p>

        <form>

          <div className={styles.formGroup}>
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your registered email"
            />
          </div>

          <button type="submit" className={styles.button}>
            Send Reset Link
          </button>

        </form>

        <div className={styles.footer}>
          <Link to="/login">
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;