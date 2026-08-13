import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { courseService } from "../../services/courseService";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./CourseDetails.module.css";

function CourseDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadCourse = async () => {
      if (!id) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const data = await courseService.getCourseById(id);
        if (isMounted) setCourse(data);
      } catch (err) {
        console.error("Failed to load course details:", err);
        if (isMounted) setCourse(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCourse();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const renderList = (value) => {
    if (!value) return [];
    let items = [];
    if (Array.isArray(value)) {
      items = value;
    } else {
      items = String(value).split(/\n|,/).filter(Boolean);
    }
    return items.map((item) => {
      if (typeof item === "object" && item !== null) {
        return item.name || item.title || item.topic || item.description || JSON.stringify(item);
      }
      return String(item);
    });
  };

  const handleApplyCourse = async () => {
    if (!course?.id || applying) return;
    setApplying(true);

    try {
      await apiClient.post(API_ENDPOINTS.APPLICATIONS.BASE, {
        course_id: course.id,
      });

      navigate("/student/application-success", { state: { course } });
    } catch (err) {
      console.warn("Application creation info:", err.response?.data || err.message);
      // Even if already applied, navigate to application success / instructions
      navigate("/student/application-success", { state: { course } });
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className={styles.courseDetailsPage}>
      <div className={styles.container}>
        {loading ? (
          <p>Loading course details from the database...</p>
        ) : !course ? (
          <p>No course details are available for this selection.</p>
        ) : (
          <>
            <h1>{course.name}</h1>

            <p className={styles.description}>{course.description || "No description available."}</p>

            <div className={styles.infoGrid}>
              <div>
                <h3>Course Code</h3>
                <p>{course.code || "N/A"}</p>
              </div>

              <div>
                <h3>Domain</h3>
                <p>{course.domain || "N/A"}</p>
              </div>

              <div>
                <h3>Duration</h3>
                <p>{course.duration_weeks ? `${course.duration_weeks} Weeks` : "N/A"}</p>
              </div>

              <div>
                <h3>Difficulty</h3>
                <p>{course.difficulty || "N/A"}</p>
              </div>
            </div>

            <div className={styles.section}>
              <h2>Prerequisites</h2>
              <ul>
                {renderList(course.prerequisites).length > 0 ? (
                  renderList(course.prerequisites).map((item, index) => <li key={index}>{item}</li>)
                ) : (
                  <li>No prerequisites listed.</li>
                )}
              </ul>
            </div>

            <div className={styles.section}>
              <h2>Curriculum</h2>
              <ul>
                {renderList(course.curriculum).length > 0 ? (
                  renderList(course.curriculum).map((item, index) => <li key={index}>{item}</li>)
                ) : (
                  <li>No curriculum listed.</li>
                )}
              </ul>
            </div>
          </>
        )}

        <button
          className={styles.applyBtn}
          onClick={handleApplyCourse}
          disabled={applying || loading || !course}
        >
          {applying ? "Submitting Application..." : "Apply for this Course"}
        </button>
      </div>
    </div>
  );
}

export default CourseDetails;
