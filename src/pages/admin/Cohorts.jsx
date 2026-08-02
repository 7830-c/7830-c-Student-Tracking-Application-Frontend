import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient, { normalizeListResponse } from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./Cohorts.module.css";

function Cohorts() {
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadCohorts = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.COHORTS.BASE);
        if (isMounted) setCohorts(normalizeListResponse(response.data));
      } catch (err) {
        console.error("Failed to load cohorts:", err);
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
          <h1>Cohort Management</h1>
          <p>Manage all training batches</p>
        </div>

        <Link to="/admin/add-cohort" className={styles.addBtn}>
          + Add Cohort
        </Link>
      </div>

      {loading ? (
        <p>Loading cohorts from the database...</p>
      ) : cohorts.length === 0 ? (
        <p>No cohorts have been created yet. Create one from the button above.</p>
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
                  <td>{cohort.name || cohort.code || "N/A"}</td>
                  <td>{cohort.course?.name || cohort.course_name || cohort.course || "N/A"}</td>
                  <td>{cohort.start_date || "N/A"}</td>
                  <td className={cohort.status === "ACTIVE" ? styles.active : cohort.status === "OPEN" ? styles.upcoming : styles.completed}>
                    {cohort.status || "DRAFT"}
                  </td>

                  <td className={styles.actions}>
                    <Link to={`/admin/cohort-details/${cohort.id}`}>View</Link>
                    <Link to={`/admin/edit-cohort/${cohort.id}`}>Edit</Link>
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

export default Cohorts;