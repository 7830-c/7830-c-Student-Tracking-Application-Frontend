import styles from "./Footer.module.css";
import {
  FaGraduationCap,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.container}>
        <div className={styles.about}>
          <h2>
            <FaGraduationCap /> Student Tracking System
          </h2>

          <p>
            A modern platform to manage attendance, academics,
            student progress and reports with a clean and secure
            interface.
          </p>
        </div>

        <div className={styles.links}>
          <h3>Quick Links</h3>

          <a href="/">Home</a>
          <a href="#features">Features</a>
          <a href="#statistics">Statistics</a>
          <a href="/login">Login</a>
        </div>

        <div className={styles.contact}>
          <h3>Contact</h3>

          <p>
            <FaEnvelope /> support@studenttracking.com
          </p>

          <p>
            <FaPhoneAlt /> +91 98765 43210
          </p>

          <p>
            <FaMapMarkerAlt /> India
          </p>
        </div>
      </div>

      <hr />

      <p className={styles.copy}>
        © 2026 Student Tracking System. All Rights Reserved.
      </p>
    </footer>
  );
}

export default Footer;