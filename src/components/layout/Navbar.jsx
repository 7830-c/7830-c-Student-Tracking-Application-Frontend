import styles from "./Navbar.module.css";
import { FaLinkedin } from "react-icons/fa";

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        Student Tracking
      </div>

      <ul className={styles.menu}>
        <li><a href="/">Home</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#statistics">Statistics</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>

      <a href="/login" className={styles.loginBtn}>
        <FaLinkedin />
        <span>Login</span>
      </a>
    </nav>
  );
}

export default Navbar;