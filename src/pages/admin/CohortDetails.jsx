import { Link } from "react-router-dom";
import styles from "./CohortDetails.module.css";

function CohortDetails() {
  const cohort = {
    name: "Java Full Stack - Batch 12",
    mentor: "Rahul Sharma",
    students: 45,
    startDate: "01 August 2026",
    endDate: "30 November 2026",
    duration: "4 Months",
    status: "Active",
    description:
      "This cohort is designed for Java Full Stack training covering Java, Spring Boot, React, SQL and placement preparation.",
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <div className={styles.header}>
          <h1>Cohort Details</h1>

          <Link to="/cohorts">
            Back
          </Link>
        </div>

        <div className={styles.grid}>

          <div>
            <label>Cohort Name</label>
            <p>{cohort.name}</p>
          </div>

          <div>
            <label>Mentor</label>
            <p>{cohort.mentor}</p>
          </div>

          <div>
            <label>Students</label>
            <p>{cohort.students}</p>
          </div>

          <div>
            <label>Duration</label>
            <p>{cohort.duration}</p>
          </div>

          <div>
            <label>Start Date</label>
            <p>{cohort.startDate}</p>
          </div>

          <div>
            <label>End Date</label>
            <p>{cohort.endDate}</p>
          </div>

          <div>
            <label>Status</label>
            <span className={styles.active}>
              {cohort.status}
            </span>
          </div>

        </div>

        <div className={styles.description}>
          <label>Description</label>
          <p>{cohort.description}</p>
        </div>

        <div className={styles.buttons}>
          <Link to="/edit-cohort">
            Edit Cohort
          </Link>
        </div>

      </div>
    </div>
  );
}

export default CohortDetails;