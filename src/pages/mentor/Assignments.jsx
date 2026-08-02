import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./Assignments.module.css";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadAssignments = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.ASSIGNMENTS.BASE);
        if (isMounted) setAssignments(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to load mentor assignments:", err);
        if (isMounted) setAssignments([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAssignments();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Assignments</h1>
        <p>Review student submissions</p>
      </div>

      {loading ? (
        <p>Loading assignments from the database...</p>
      ) : assignments.length === 0 ? (
        <p>No assignments are available yet.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Assignment</th>
                <th>Cohort</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {assignments.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.cohort?.name || item.cohort || "N/A"}</td>
                  <td>{item.deadline || "N/A"}</td>
                  <td>{item.status || "DRAFT"}</td>
                  <td>
                    <Link to="/mentor/assignment-feedback">Review</Link>
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

export default Assignments;