import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./AssignmentList.module.css";

function AssignmentList() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadAssignments = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.ASSIGNMENTS.BASE);
        if (isMounted) {
          setAssignments(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        console.error("Failed to load assignments:", err);
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
        <h1>Assignments</h1>

        <p className={styles.subtitle}>
          Complete and submit your internship assignments before the deadline.
        </p>

        {loading ? (
          <p>Loading assignments from the database...</p>
        ) : assignments.length === 0 ? (
          <p>No assignments are available yet.</p>
        ) : (
          <div className={styles.list}>
            {assignments.map((assignment) => (
              <div key={assignment.id} className={styles.assignmentCard}>
                <h3>{assignment.title}</h3>

                <p>
                  <strong>Type:</strong> {assignment.assignment_type || "Assignment"}
                </p>

                <p>
                  <strong>Due Date:</strong> {formatDate(assignment.deadline)}
                </p>

                <span
                  className={assignment.status === "SUBMITTED" ? styles.submitted : styles.pending}
                >
                  {assignment.status || "PENDING"}
                </span>

                <Link
                  to="/student/assignment-details"
                  state={{ assignment }}
                  className={styles.button}
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className={styles.actions}>
          <Link to="/student/certificates" className={styles.nextBtn}>
            Continue to Certificates →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AssignmentList;