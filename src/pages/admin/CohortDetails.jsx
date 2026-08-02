import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./CohortDetails.module.css";

function CohortDetails() {
  const { id } = useParams();
  const [cohort, setCohort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCohort = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.COHORTS.BY_ID(id));
        setCohort(response.data || null);
      } catch (err) {
        console.error("Failed to load cohort details:", err);
        setError("Unable to load cohort details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCohort();
    }
  }, [id]);

  if (loading) return <div className={styles.container}><div className={styles.card}><h1>Cohort Details</h1><p>Loading cohort details...</p></div></div>;
  if (error) return <div className={styles.container}><div className={styles.card}><h1>Cohort Details</h1><p style={{ color: "#b91c1c" }}>{error}</p></div></div>;
  if (!cohort) return <div className={styles.container}><div className={styles.card}><h1>Cohort Details</h1><p>No cohort found.</p></div></div>;

  const mentorNames = (cohort.mentors || [])
    .map((mentor) => `${mentor.first_name || ""} ${mentor.last_name || ""}`.trim() || mentor.email || "Unknown")
    .filter(Boolean)
    .join(", ") || "Not assigned";

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Cohort Details</h1>
          <Link to="/admin/cohorts">Back</Link>
        </div>

        <div className={styles.grid}>
          <div>
            <label>Cohort Name</label>
            <p>{cohort.name || cohort.code || "N/A"}</p>
          </div>

          <div>
            <label>Course</label>
            <p>{cohort.course?.name || cohort.course || "N/A"}</p>
          </div>

          <div>
            <label>Mentors</label>
            <p>{mentorNames}</p>
          </div>

          <div>
            <label>Max Students</label>
            <p>{cohort.max_students ?? "N/A"}</p>
          </div>

          <div>
            <label>Start Date</label>
            <p>{cohort.start_date || "N/A"}</p>
          </div>

          <div>
            <label>End Date</label>
            <p>{cohort.end_date || "N/A"}</p>
          </div>

          <div>
            <label>Status</label>
            <span className={styles.active}>{cohort.status || "DRAFT"}</span>
          </div>

          <div>
            <label>Meeting Link</label>
            <p>{cohort.meeting_link || "N/A"}</p>
          </div>
        </div>

        <div className={styles.description}>
          <label>Code</label>
          <p>{cohort.code || "N/A"}</p>
        </div>

        <div className={styles.buttons}>
          <Link to={`/admin/edit-cohort/${cohort.id}`}>Edit Cohort</Link>
        </div>
      </div>
    </div>
  );
}

export default CohortDetails;