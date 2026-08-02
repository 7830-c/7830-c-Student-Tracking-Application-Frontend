import { Link } from "react-router-dom";
import styles from "./CertificateList.module.css";

const certificates = [
  {
    id: "CERT-2026-001",
    title: "Java Full Stack Internship",
    issueDate: "20 Aug 2026",
    status: "Issued",
  },
  {
    id: "CERT-2026-002",
    title: "ReactJS Completion",
    issueDate: "22 Aug 2026",
    status: "Issued",
  },
];

function CertificateList() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <h1>My Certificates</h1>

        <p className={styles.subtitle}>
          View and download your internship certificates.
        </p>

        <div className={styles.list}>

          {certificates.map((certificate) => (
            <div
              key={certificate.id}
              className={styles.certificateCard}
            >
              <h3>{certificate.title}</h3>

              <p>
                <strong>Certificate ID:</strong> {certificate.id}
              </p>

              <p>
                <strong>Issue Date:</strong> {certificate.issueDate}
              </p>

              <span className={styles.issued}>
                {certificate.status}
              </span>

              <Link
                to="/student/certificate-view"
                state={{ certificate }}
                className={styles.button}
              >
                View Certificate →
              </Link>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default CertificateList;