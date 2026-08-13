import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./ApplicationDetails.module.css";

function ApplicationDetails() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const resolveName = (userObj, fallbackCode, fallbackEmail) => {
    if (userObj && typeof userObj === "object") {
      const fn = (userObj.first_name || "").trim();
      const ln = (userObj.last_name || "").trim();
      if (fn || ln) return `${fn} ${ln}`.trim();
      if (userObj.email && userObj.email.includes("@")) {
        const prefix = userObj.email.split("@")[0];
        return prefix.replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      }
    }
    if (fallbackEmail && fallbackEmail.includes("@")) {
      const prefix = fallbackEmail.split("@")[0];
      return prefix.replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }
    if (fallbackCode) return fallbackCode;
    return "Registered Student";
  };

  useEffect(() => {
    const loadApplication = async () => {
      try {
        const appRes = await apiClient.get(API_ENDPOINTS.APPLICATIONS.BY_ID(id));
        const appData = appRes.data || {};

        let studentObj = typeof appData.student === "object" ? appData.student : null;
        let userObj = studentObj?.user && typeof studentObj.user === "object" ? studentObj.user : null;
        let courseObj = typeof appData.course === "object" ? appData.course : null;

        // Fetch student profile if FK is UUID string
        if (!studentObj && typeof appData.student === "string") {
          const sRes = await apiClient.get(`/api/students/${appData.student}/`).catch(() => null);
          if (sRes?.data) studentObj = sRes.data;
        }

        // Fetch user account if FK is UUID string
        const userId = userObj?.id || (typeof studentObj?.user === "string" ? studentObj.user : (typeof appData.student === "string" ? appData.student : null));
        if (userId) {
          const uRes = await apiClient.get(`/api/users/${userId}/`).catch(() => null);
          if (uRes?.data) userObj = uRes.data;
        }

        // Fetch course title if FK is UUID string
        if (!courseObj && typeof appData.course === "string") {
          const cRes = await apiClient.get(`/api/courses/${appData.course}/`).catch(() => null);
          if (cRes?.data) courseObj = cRes.data;
        }

        const fullName = resolveName(userObj, studentObj?.student_code, userObj?.email || appData.student_email);

        setApplication({
          ...appData,
          student_display_name: fullName,
          student_email: userObj?.email || appData.student_email || "N/A",
          student_phone: userObj?.phone_number || studentObj?.phone_number || "N/A",
          course_title: courseObj?.name || courseObj?.title || appData.course_name || "Course Track",
        });
      } catch (err) {
        console.error("Failed to load application details:", err);
        setError("Unable to load application details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadApplication();
    }
  }, [id]);

  if (loading) return <div className={styles.container}><div className={styles.card}><h1>Application Details</h1><p>Loading application details...</p></div></div>;
  if (error) return <div className={styles.container}><div className={styles.card}><h1>Application Details</h1><p style={{ color: "#b91c1c" }}>{error}</p></div></div>;
  if (!application) return <div className={styles.container}><div className={styles.card}><h1>Application Details</h1><p>No application found.</p></div></div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Application Details</h1>
          <Link to="/admin/applications">Back to Applications</Link>
        </div>

        <div className={styles.grid}>
          <div>
            <label>Student Name</label>
            <p><strong>{application.student_display_name}</strong></p>
          </div>

          <div>
            <label>Email</label>
            <p>{application.student_email}</p>
          </div>

          <div>
            <label>Phone</label>
            <p>{application.student_phone}</p>
          </div>

          <div>
            <label>Course</label>
            <p><strong>{application.course_title}</strong></p>
          </div>

          <div>
            <label>Application Number</label>
            <p>{application.application_number || "N/A"}</p>
          </div>

          <div>
            <label>Applied On</label>
            <p>{application.applied_at || application.created_at ? new Date(application.applied_at || application.created_at).toLocaleDateString() : "N/A"}</p>
          </div>

          <div>
            <label>Status</label>
            <span className={application.status === "REJECTED" ? styles.rejected : application.status === "QUALIFIED" || application.status === "APPROVED" || application.status === "COHORT_ASSIGNED" ? styles.approved : styles.pending}>
              {application.status || "PENDING"}
            </span>
          </div>

          <div>
            <label>Remarks</label>
            <p>{application.remarks || "No remarks provided."}</p>
          </div>
        </div>

        <div className={styles.buttons}>
          <Link to={`/admin/approve-application/${application.id}`}>Approve Application</Link>
          <Link to={`/admin/reject-application/${application.id}`}>Reject Application</Link>
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetails;