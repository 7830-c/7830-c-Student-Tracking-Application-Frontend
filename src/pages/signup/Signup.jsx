import { Link, useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";

function Signup() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/profile");
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

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>First Name</label>
                <input type="text" placeholder="Enter first name" />
              </div>

              <div className={styles.inputGroup}>
                <label>Last Name</label>
                <input type="text" placeholder="Enter last name" />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <input type="email" placeholder="Enter email address" />
            </div>

            <div className={styles.inputGroup}>
              <label>Phone Number</label>
              <input type="text" placeholder="Enter phone number" />
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Password</label>
                <input type="password" placeholder="Enter password" />
              </div>

              <div className={styles.inputGroup}>
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm password"
                />
              </div>
            </div>

            <button type="submit" className={styles.signupButton}>
              Create Account
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