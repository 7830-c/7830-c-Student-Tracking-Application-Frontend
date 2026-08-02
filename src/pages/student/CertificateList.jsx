import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./CertificateList.module.css";

function CertificateList() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCertificates = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.CERTIFICATES.BASE);
        if (isMounted) setCertificates(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to load certificates:", err);
        if (isMounted) setCertificates([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCertificates();
    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (value) => {
    if (!value) return "N/A";
    return new Date(value).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1>My Certificates</h1>

        <p className={styles.subtitle}>
          View and download your internship certificates.
        </p>

        {loading ? (
          <p>Loading certificates from the database...</p>
        ) : certificates.length === 0 ? (
          <p>No certificates are available yet.</p>
        ) : (
          <div className={styles.list}>
            {certificates.map((certificate) => (
              <div key={certificate.id} className={styles.certificateCard}>
                <h3>{certificate.certificate_type || "Certificate"}</h3>

                <p>
                  <strong>Certificate ID:</strong> {certificate.certificate_number || certificate.id}
                </p>

                <p>
                  <strong>Issue Date:</strong> {formatDate(certificate.issued_at)}
                </p>

                <span className={styles.issued}>{certificate.status || "ACTIVE"}</span>

                <Link to="/student/certificate-view" state={{ certificate }} className={styles.button}>
                  View Certificate →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CertificateList;