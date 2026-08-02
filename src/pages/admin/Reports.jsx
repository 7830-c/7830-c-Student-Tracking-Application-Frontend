import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./Reports.module.css";

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadReports = async () => {
      try {
        const [studentsResponse, applicationsResponse, coursesResponse] = await Promise.all([
          apiClient.get(API_ENDPOINTS.STUDENTS.BASE),
          apiClient.get(API_ENDPOINTS.APPLICATIONS.BASE),
          apiClient.get(API_ENDPOINTS.COURSES.BASE),
        ]);

        if (isMounted) {
          setReports([
            {
              title: "Student Report",
              description: `${Array.isArray(studentsResponse.data) ? studentsResponse.data.length : 0} student profiles currently stored.`,
              link: "/admin/students",
            },
            {
              title: "Course Report",
              description: `${Array.isArray(coursesResponse.data) ? coursesResponse.data.length : 0} courses available in the database.`,
              link: "/admin/courses",
            },
            {
              title: "Application Report",
              description: `${Array.isArray(applicationsResponse.data) ? applicationsResponse.data.length : 0} applications currently recorded.`,
              link: "/admin/applications",
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to load reports:", err);
        if (isMounted) setReports([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadReports();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Reports & Analytics</h1>
        <p>View system reports and analytics.</p>
      </div>

      {loading ? (
        <p>Loading report data from the database...</p>
      ) : reports.length === 0 ? (
        <p>No report data is available yet.</p>
      ) : (
        <div className={styles.cards}>
          {reports.map((report, index) => (
            <div key={index} className={styles.card}>
              <h2>{report.title}</h2>
              <p>{report.description}</p>
              <Link to={report.link}>View Report</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reports;