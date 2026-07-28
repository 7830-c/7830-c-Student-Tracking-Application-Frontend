import { Link } from "react-router-dom";
import styles from "./ApplyCourse.module.css";

const courses = [
  {
    id: 1,
    code: "JFS001",
    name: "Java Full Stack Development",
    domain: "Software Development",
    duration: "12 Weeks",
    difficulty: "Beginner",
    description:
      "Learn Java, Spring Boot, React, MySQL and build real-world full-stack applications."
  },
  {
    id: 2,
    code: "EMB001",
    name: "Embedded C Programming",
    domain: "Embedded Systems",
    duration: "10 Weeks",
    difficulty: "Intermediate",
    description:
      "Master Embedded C programming, microcontrollers and embedded application development."
  },
  {
    id: 3,
    code: "VLSI001",
    name: "RTL001 - RTL Design with Verilog",
    domain: "VLSI",
    duration: "12 Weeks",
    difficulty: "Intermediate",
    description:
      "Learn Digital Design, Verilog HDL and RTL Design for VLSI industry."
  }
];

function ApplyCourse() {
  return (
    <div className={styles.coursePage}>
      <div className={styles.container}>

        <div className={styles.header}>
          <h1>Available Internship Courses</h1>

          <p>
            Browse the available internship courses. Select a course to view
            complete details before submitting your application.
          </p>
        </div>

        <div className={styles.courseGrid}>

          {courses.map((course) => (
            <div key={course.id} className={styles.courseCard}>

              <span className={styles.badge}>Published</span>

              <h2>{course.name}</h2>

              <p>{course.description}</p>

              <div className={styles.info}>

                <div>
                  <strong>Course Code</strong>
                  <span>{course.code}</span>
                </div>

                <div>
                  <strong>Domain</strong>
                  <span>{course.domain}</span>
                </div>

                <div>
                  <strong>Duration</strong>
                  <span>{course.duration}</span>
                </div>

                <div>
                  <strong>Difficulty</strong>
                  <span>{course.difficulty}</span>
                </div>

              </div>

              <div className={styles.buttons}>

                <Link
                  to={`/course/${course.id}`}
                  className={styles.detailsBtn}
                >
                  View Details
                </Link>

              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default ApplyCourse;