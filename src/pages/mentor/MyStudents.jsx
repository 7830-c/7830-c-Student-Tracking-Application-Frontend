import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./MyStudents.module.css";

function MyStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadStudents = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.STUDENTS.BASE);
        if (isMounted) setStudents(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to load mentor students:", err);
        if (isMounted) setStudents([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadStudents();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Students</h1>
        <p>Students available from the database</p>
      </div>

      {loading ? (
        <p>Loading students from the database...</p>
      ) : students.length === 0 ? (
        <p>No student records are available yet.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>College</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => {
                const user = student.user || {};
                return (
                  <tr key={student.id}>
                    <td>{`${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email || "Unknown"}</td>
                    <td>{user.email || "N/A"}</td>
                    <td>{student.college || "N/A"}</td>
                    <td>{student.status || "PENDING"}</td>
                    <td>
                      <Link to="/mentor/student-details">View</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyStudents;