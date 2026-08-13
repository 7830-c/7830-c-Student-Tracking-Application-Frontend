import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { studentService } from "../../services/studentService";
import apiClient from "../../services/apiClient";
import styles from "./ApplicationStatus.module.css";

function ApplicationStatus() {
  const location = useLocation();
  const { user } = useAuth();
  
  const [isExisting, setIsExisting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [courseName, setCourseName] = useState("Medical Coding");

  const application = location.state?.application;
  const navStatus = location.state?.status;

  useEffect(() => {
    async function loadDetails() {
      if (user?.email) {
        const profile = await studentService.getProfile(user.email);
        if (profile?.isExistingStudent === "yes" || profile?.isExistingStudent === true) {
          setIsExisting(true);
        }
      }

      // Resolve Course Name
      let resolved = application?.course_name || application?.course_display || application?.course?.name;

      if (!resolved && application?.course && typeof application.course === "string") {
        const cRes = await apiClient.get(`/api/courses/${application.course}/`).catch(() => null);
        if (cRes?.data?.name) {
          resolved = cRes.data.name;
        }
      }

      if (!resolved) {
        const coursesRes = await apiClient.get("/api/courses/").catch(() => null);
        const list = Array.isArray(coursesRes?.data) ? coursesRes.data : (coursesRes?.data?.results || []);
        if (list.length > 0) {
          resolved = list[0].name || list[0].title;
        }
      }

      if (resolved) {
        setCourseName(resolved);
      }

      setIsLoading(false);
    }
    loadDetails();
  }, [user, application]);

  // If navigated directly from profile OR backend confirms they are existing
  const isPendingVerification = isExisting || navStatus === "PENDING_VERIFICATION";

  const formatDate = (value) => {
    if (!value) return "N/A";
    return new Date(value).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className={styles.statusPage}>
        <div className={styles.statusCard} style={{ textAlign: "center" }}>
          <h2 style={{ color: "#1e3a8a" }}>Loading your status...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.statusPage}>
      <div className={styles.statusCard}>
        <h1>{isPendingVerification ? "Verification Status" : "Application Status"}</h1>

        <p className={styles.subtitle}>
          {isPendingVerification 
            ? "Track the status of your existing student verification." 
            : "Track the current status of your internship application."}
        </p>

        <div className={styles.details}>
          {isPendingVerification && !application ? (
            <>
              <div className={styles.row}>
                <strong>Request Type</strong>
                <span>Existing Student Profile Verification</span>
              </div>
              <div className={styles.row}>
                <strong>Submission Date</strong>
                <span>{formatDate(new Date())}</span>
              </div>
              <div className={styles.row}>
                <strong>Current Status</strong>
                <span className={styles.pending}>AWAITING ADMIN REVIEW</span>
              </div>
            </>
          ) : (
            <>
              <div className={styles.row}>
                <strong>Application Number</strong>
                <span>{application?.application_number || application?.id || "APP-SYS"}</span>
              </div>
              <div className={styles.row}>
                <strong>Course</strong>
                <span style={{ color: "#2563eb", fontWeight: "bold" }}>{courseName}</span>
              </div>
              <div className={styles.row}>
                <strong>Applied Date</strong>
                <span>{formatDate(application?.applied_at || application?.created_at || new Date())}</span>
              </div>
              <div className={styles.row}>
                <strong>Current Status</strong>
                <span className={styles.pending}>{application?.status || "PENDING"}</span>
              </div>
            </>
          )}
        </div>

        {isPendingVerification ? (
          <div className={styles.timeline}>
            <div className={styles.completed}>✓ Verification Data Submitted</div>
            <div className={styles.active}>⏳ Admin Verification Pending</div>
            <div>Cohort Assignment</div>
            <div>Internship Begins</div>
          </div>
        ) : (
          <div className={styles.timeline}>
            <div className={styles.completed}>✓ Application Submitted</div>
            <div className={styles.active}>⏳ Screening Exam Pending</div>
            <div>Qualification Result</div>
            <div>Cohort Assignment</div>
            <div>Internship Begins</div>
          </div>
        )}

        {!isPendingVerification && (
          <Link to="/student/exam-instructions" className={styles.examButton}>
            Start Screening Exam
          </Link>
        )}

        <Link to="/student/cohort" className={styles.button}>
          Continue to My Cohort →
        </Link>

        <Link to="/student/applications" className={styles.button} style={{ marginLeft: "10px", backgroundColor: "#6b7280" }}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default ApplicationStatus;