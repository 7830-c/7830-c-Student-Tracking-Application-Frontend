import styles from "./CertificateVerify.module.css";

function CertificateVerify() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <h1>Certificate Verification</h1>

        <p className={styles.subtitle}>
          Enter the Certificate ID to verify its authenticity.
        </p>

        <div className={styles.form}>

          <input
            type="text"
            placeholder="Enter Certificate ID"
          />

          <button className={styles.verifyBtn}>
            Verify
          </button>

        </div>

        <div className={styles.result}>

          <h2 className={styles.verified}>
            ✅ Certificate Verified
          </h2>

          <div className={styles.details}>

            <div className={styles.row}>
              <strong>Student Name</strong>
              <span>Somesh Kumar Srinadha</span>
            </div>

            <div className={styles.row}>
              <strong>Course</strong>
              <span>Java Full Stack Development</span>
            </div>

            <div className={styles.row}>
              <strong>Certificate ID</strong>
              <span>CERT-2026-001</span>
            </div>

            <div className={styles.row}>
              <strong>Issue Date</strong>
              <span>20 Aug 2026</span>
            </div>

            <div className={styles.row}>
              <strong>Status</strong>
              <span className={styles.active}>Valid</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default CertificateVerify;