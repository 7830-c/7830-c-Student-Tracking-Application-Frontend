import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./MyCohorts.module.css";

function MyCohorts() {
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadCohorts = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.COHORTS.BASE);
        if (isMounted) setCohorts(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to load mentor cohorts:", err);
        if (isMounted) setCohorts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCohorts();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>My Cohorts</h1>
          <p>Assigned cohorts for mentoring</p>
        </div>
      </div>

      {loading ? (
        <p>Loading cohorts from the database...</p>
      ) : cohorts.length === 0 ? (
        <p>No cohorts are assigned to you yet. They will appear once an admin creates them.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Cohort</th>
                <th>Course</th>
                <th>Start Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {cohorts.map((cohort) => (
                <tr key={cohort.id}>
                  <td>{cohort.name}</td>
                  <td>{cohort.course?.name || cohort.course || "N/A"}</td>
                  <td>{cohort.start_date || "N/A"}</td>
                  <td className={cohort.status === "ACTIVE" ? styles.ongoing : styles.upcoming}>
                    {cohort.status || "DRAFT"}
                  </td>
                  <td>
                    <Link to="/mentor/cohort-details">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyCohorts;