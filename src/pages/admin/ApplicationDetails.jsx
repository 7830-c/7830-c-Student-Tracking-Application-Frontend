import { Link } from "react-router-dom";
import styles from "./ApplicationDetails.module.css";

function ApplicationDetails() {
  const application = {
    student: "Rahul Kumar",
    email: "rahul@gmail.com",
    phone: "+91 9876543210",
    course: "Java Full Stack",
    company: "Infosys",
    appliedOn: "15 July 2026",
    status: "Pending",
    resume: "Resume.pdf",
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <div className={styles.header}>
          <h1>Application Details</h1>

          <Link to="/admin/applications">
            Back
          </Link>
        </div>

        <div className={styles.grid}>

          <div>
            <label>Student Name</label>
            <p>{application.student}</p>
          </div>

          <div>
            <label>Email</label>
            <p>{application.email}</p>
          </div>

          <div>
            <label>Phone</label>
            <p>{application.phone}</p>
          </div>

          <div>
            <label>Course</label>
            <p>{application.course}</p>
          </div>

          <div>
            <label>Company</label>
            <p>{application.company}</p>
          </div>

          <div>
            <label>Applied On</label>
            <p>{application.appliedOn}</p>
          </div>

          <div>
            <label>Status</label>
            <span className={styles.pending}>
              {application.status}
            </span>
          </div>

          <div>
            <label>Resume</label>
            <p>{application.resume}</p>
          </div>

        </div>

        <div className={styles.buttons}>
          <Link to="/admin/approve-application">
            Approve
          </Link>

          <Link to="/admin/reject-application">
            Reject
          </Link>
        </div>

      </div>
    </div>
  );
}

export default ApplicationDetails;