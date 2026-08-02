import { Link } from "react-router-dom";
import styles from "./CertificatesAdmin.module.css";

function CertificatesAdmin() {
  const certificates = [
    {
      id: 1,
      student: "Rahul Sharma",
      course: "Java Full Stack",
      issued: "25 Jul 2026",
      status: "Issued",
    },
    {
      id: 2,
      student: "Anjali Verma",
      course: "MERN Stack",
      issued: "26 Jul 2026",
      status: "Pending",
    },
    {
      id: 3,
      student: "Kiran Kumar",
      course: "Python Full Stack",
      issued: "20 Jul 2026",
      status: "Issued",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Certificate Management</h1>
          <p>Manage student certificates</p>
        </div>

        <Link to="/admin/add-certificate" className={styles.addBtn}>
          + Add Certificate
        </Link>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Issued On</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {certificates.map((certificate) => (
              <tr key={certificate.id}>
                <td>{certificate.student}</td>
                <td>{certificate.course}</td>
                <td>{certificate.issued}</td>

                <td
                  className={
                    certificate.status === "Issued"
                      ? styles.issued
                      : styles.pending
                  }
                >
                  {certificate.status}
                </td>

                <td className={styles.actions}>
                  <Link to="/admin/certificate-admin-details">View</Link>
                  <Link to="/admin/edit-certificate">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CertificatesAdmin;