import { Link } from "react-router-dom";
import styles from "./Applications.module.css";

function Applications() {
  const applications = [
    {
      id: 1,
      student: "Rahul Kumar",
      course: "Java Full Stack",
      company: "Infosys",
      status: "Pending",
    },
    {
      id: 2,
      student: "Sneha Reddy",
      course: "MERN Stack",
      company: "TCS",
      status: "Approved",
    },
    {
      id: 3,
      student: "Vijay Sharma",
      course: "Python Full Stack",
      company: "Wipro",
      status: "Rejected",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Application Management</h1>
          <p>Manage all student applications</p>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Company</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((application) => (
              <tr key={application.id}>
                <td>{application.student}</td>
                <td>{application.course}</td>
                <td>{application.company}</td>
                <td
                  className={
                    application.status === "Approved"
                      ? styles.approved
                      : application.status === "Rejected"
                      ? styles.rejected
                      : styles.pending
                  }
                >
                  {application.status}
                </td>

                <td className={styles.actions}>
                  <Link to="/admin/application-details">View</Link>
                  <Link to="/admin/approve-application">Approve</Link>
                  <Link to="/admin/reject-application">Reject</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Applications;