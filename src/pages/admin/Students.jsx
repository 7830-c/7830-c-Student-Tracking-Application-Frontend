import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient, { normalizeListResponse } from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./Students.module.css";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadStudents = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.STUDENTS.BASE);
        if (isMounted) setStudents(normalizeListResponse(response.data));
      } catch (err) {
        console.error("Failed to load students:", err);
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
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <h1>Student Management</h1>
            <p>Manage all registered students.</p>
          </div>

          <Link to="/admin/add-student" className={styles.addButton}>
            + Add Student
          </Link>
        </div>

        <div className={styles.searchBox}>
          <input type="text" placeholder="Search student..." />
        </div>

        <div className={styles.total}>
          Total Students : <strong>{students.length}</strong>
        </div>

        {loading ? (
          <p>Loading students from the database...</p>
        ) : students.length === 0 ? (
          <p>No student profiles are available yet.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>College</th>
                  <th>Status</th>
                  <th>Actions</th>
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
                      <td>
                        <span className={student.status === "ACTIVE" ? styles.active : styles.inactive}>
                          {student.status || "PENDING"}
                        </span>
                      </td>
                      <td className={styles.actions}>
                        <Link to={`/admin/student-details/${student.id}`}>View</Link>
                        <Link to={`/admin/edit-student/${student.id}`}>Edit</Link>
                        <button type="button">Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Students;