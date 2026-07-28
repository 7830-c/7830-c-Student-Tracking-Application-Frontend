import { Link } from "react-router-dom";
import styles from "./CertificateView.module.css";

function CertificateView() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <h1>Internship Completion Certificate</h1>

        <div className={styles.certificate}>

          <h2>Certificate of Completion</h2>

          <p>
            This is to certify that
          </p>

          <h3>Somesh Kumar Srinadha</h3>

          <p>
            has successfully completed the
          </p>

          <h4>Java Full Stack Development Internship</h4>

          <p>
            conducted by Sure Trust.
          </p>

          <div className={styles.details}>

            <div>
              <strong>Certificate ID</strong>
              <p>CERT-2026-001</p>
            </div>

            <div>
              <strong>Issue Date</strong>
              <p>20 Aug 2026</p>
            </div>

          </div>

          <div className={styles.qr}>
            QR CODE
          </div>

        </div>

        <div className={styles.actions}>

          <button className={styles.download}>
            Download PDF
          </button>

          <Link
            to="/certificate-verify"
            className={styles.verify}
          >
            Verify Certificate
          </Link>

        </div>

      </div>
    </div>
  );
}

export default CertificateView;