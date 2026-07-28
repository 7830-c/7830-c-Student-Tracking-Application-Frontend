import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        Sure ProEd
      </div>

      <ul className={styles.menu}>
        <li><a href="/">Home</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#statistics">Statistics</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>

      <div className={styles.buttons}>
        <Link to="/signup" className={styles.signupBtn}>
          Sign Up
        </Link>

        <Link to="/login" className={styles.loginBtn}>
          Student Login
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;