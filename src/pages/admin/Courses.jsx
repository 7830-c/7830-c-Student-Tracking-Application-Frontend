import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient, { normalizeListResponse } from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./Courses.module.css";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadCourses = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.COURSES.BASE);
        if (isMounted) setCourses(normalizeListResponse(response.data));
      } catch (err) {
        console.error("Failed to load courses:", err);
        if (isMounted) setCourses([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCourses();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Course Management</h1>
          <Link to="/admin/add-course" className={styles.addBtn}>
            + Add Course
          </Link>
        </div>

        {loading ? (
          <p>Loading courses from the database...</p>
        ) : courses.length === 0 ? (
          <p>No courses have been created yet. Create one from the button above.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Duration</th>
                  <th>Domain</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.name}</td>
                    <td>{course.duration_weeks ? `${course.duration_weeks} Weeks` : "N/A"}</td>
                    <td>{course.domain || "N/A"}</td>
                    <td>
                      <span className={styles.status}>{course.status || "DRAFT"}</span>
                    </td>

                    <td className={styles.actions}>
                      <Link to={`/admin/course-details/${course.id}`}>View</Link>
                      <Link to={`/admin/edit-course/${course.id}`}>Edit</Link>
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

export default Courses;