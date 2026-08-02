import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient, { normalizeListResponse } from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./Mentors.module.css";

function Mentors() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadMentors = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.USERS.BASE);
        const users = normalizeListResponse(response.data);
        if (isMounted) {
          setMentors(users.filter((user) => user.role === "MENTOR"));
        }
      } catch (err) {
        console.error("Failed to load mentors:", err);
        if (isMounted) setMentors([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadMentors();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Mentor Management</h1>
          <Link to="/admin/add-mentor" className={styles.addBtn}>
            + Add Mentor
          </Link>
        </div>

        {loading ? (
          <p>Loading mentors from the database...</p>
        ) : mentors.length === 0 ? (
          <p>No mentor accounts have been created yet.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {mentors.map((mentor) => (
                  <tr key={mentor.id || mentor.email || Math.random()}>
                    <td>{typeof mentor.id === "string" ? mentor.id.slice(0, 8) : "N/A"}</td>
                    <td>{`${mentor.first_name || ""} ${mentor.last_name || ""}`.trim() || mentor.email}</td>
                    <td>{mentor.email}</td>
                    <td>
                      <span className={styles.status}>{mentor.is_active ? "Active" : "Inactive"}</span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Link to={`/admin/mentor-details/${mentor.id}`}>View</Link>
                        <Link to={`/admin/edit-mentor/${mentor.id}`}>Edit</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Mentors;