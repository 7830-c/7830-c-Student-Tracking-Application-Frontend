import { Link } from "react-router-dom";
import styles from "./AssignmentList.module.css";

const assignments = [
  {
    id: 1,
    title: "Java OOP Assignment",
    dueDate: "10 Aug 2026",
    status: "Pending",
  },
  {
    id: 2,
    title: "Spring Boot REST API",
    dueDate: "15 Aug 2026",
    status: "Submitted",
  },
  {
    id: 3,
    title: "ReactJS Components",
    dueDate: "20 Aug 2026",
    status: "Pending",
  },
];

function AssignmentList() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <h1>Assignments</h1>

        <p className={styles.subtitle}>
          Complete and submit your internship assignments before the deadline.
        </p>

        <div className={styles.list}>

          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className={styles.assignmentCard}
            >
              <h3>{assignment.title}</h3>

              <p>
                <strong>Due Date:</strong> {assignment.dueDate}
              </p>

              <span
                className={
                  assignment.status === "Submitted"
                    ? styles.submitted
                    : styles.pending
                }
              >
                {assignment.status}
              </span>

              <Link
                to="/student/assignment-details"
                className={styles.button}
              >
                View Details
              </Link>

            </div>
          ))}

        </div>

        <div className={styles.actions}>
          <Link
            to="/student/certificates"
            className={styles.nextBtn}
          >
            Continue to Certificates →
          </Link>
        </div>

      </div>
    </div>
  );
}

export default AssignmentList;