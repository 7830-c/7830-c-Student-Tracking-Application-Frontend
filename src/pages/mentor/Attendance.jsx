import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./Attendance.module.css";

function Attendance() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadStudents = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.STUDENTS.BASE);
        if (isMounted) setStudents(Array.isArray(response.data) ? response.data : []);
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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Attendance</h1>
        <Link to="/mentor/attendance-history">Attendance History</Link>
      </div>

      {loading ? (
        <p>Loading students from the database...</p>
      ) : students.length === 0 ? (
        <p>No students are available yet.</p>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Student</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{`${student.user?.first_name || ""} ${student.user?.last_name || ""}`.trim() || student.user?.email || "Unknown"}</td>
                  <td>{student.is_active ? "Active" : "Inactive"}</td>
                  <td>
                    <select defaultValue="Active">
                      <option>Active</option>
                      <option>Inactive</option>
                      <option>Late</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className={styles.button}>Save Attendance</button>
        </>
      )}
    </div>
  );
}

export default Attendance;