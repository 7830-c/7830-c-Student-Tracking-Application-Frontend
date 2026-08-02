import { Link } from "react-router-dom";
import styles from "./Hero.module.css";
import heroImage from "../../assets/images/hero.svg";

function Hero() {
  return (
    <section id="home" className={styles.hero}>
      <div className={styles.left}>
        <h1>Sure ProEd Internship Management Platform</h1>

        <p>
          Manage internships, screening exams, attendance,
          assignments, certificates and student progress from one
          powerful platform.
        </p>

        <div className={styles.portalContainer}>

          {/* Student */}

          <div className={styles.portalCard}>
            <h2>🎓 Student Portal</h2>

            <p>
              Apply for internships, attend exams and track your
              complete learning journey.
            </p>

            <div className={styles.portalButtons}>
              <Link
                to="/login"
                className={styles.primaryBtn}
              >
                Student Login
              </Link>

              <Link
                to="/signup"
                className={styles.secondaryBtn}
              >
                Student Signup
              </Link>
            </div>
          </div>

          {/* Mentor */}

          <div className={styles.portalCard}>
            <h2>👨‍🏫 Mentor Portal</h2>

            <p>
              Manage your students, attendance, assignments and
              class schedules.
            </p>

            <div className={styles.portalButtons}>
              <Link
                to="/mentor/login"
                className={styles.primaryBtn}
              >
                Mentor Login
              </Link>
            </div>
          </div>

          {/* Admin */}

          <div className={styles.portalCard}>
            <h2>👨‍💼 Admin Portal</h2>

            <p>
              Manage the complete internship platform including
              students, mentors, companies, exams and reports.
            </p>

            <div className={styles.portalButtons}>
              <Link
                to="/admin/login"
                className={styles.primaryBtn}
              >
                Admin Login
              </Link>
            </div>
          </div>

        </div>
      </div>

      <div className={styles.right}>
        <img
          src={heroImage}
          alt="Sure ProEd"
        />
      </div>
    </section>
  );
}

export default Hero;