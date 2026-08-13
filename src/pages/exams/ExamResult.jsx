import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./ExamResult.module.css";

function ExamResult() {
  const navigate = useNavigate();
  const location = useLocation();

  const [result, setResult] = useState(location.state?.examResult || null);
  const [loading, setLoading] = useState(!location.state?.examResult);

  useEffect(() => {
    let isMounted = true;
    if (!result) {
      const fetchLatestResult = async () => {
        try {
          const res = await apiClient.get(API_ENDPOINTS.EXAMS.ACTIVE);
          if (isMounted && res.data?.has_exam) {
            setResult(res.data.exam);
          }
        } catch (err) {
          console.error("Failed to load exam results:", err);
        } finally {
          if (isMounted) setLoading(false);
        }
      };
      fetchLatestResult();
    } else {
      setLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, [result]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <p>Evaluating examination results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <h2>No Exam Results Found</h2>
          <p>Please complete your screening examination first.</p>
          <button className={styles.button} onClick={() => navigate("/student/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const marksObtained = result.marks_obtained || 0;
  const totalMarks = result.total_marks || 0;
  const percentage = result.percentage || 0;
  const qualified = result.qualified || percentage >= (result.pass_percentage || 60);
  const cheatCount = result.cheat_count || 0;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1>Screening Examination Results</h1>

        <div className={styles.resultBox}>
          <h2>{qualified ? "🎉 Congratulations!" : "Examination Completed"}</h2>
          <p>Your Final Marks Score</p>
          <div className={styles.score}>
            {marksObtained} / {totalMarks}
          </div>
          <div className={styles.percentage}>{percentage}%</div>
          <div className={qualified ? styles.qualified : styles.notQualified}>
            {qualified ? "QUALIFIED" : "NOT QUALIFIED"}
          </div>
        </div>

        {/* Security Audit Badge */}
        <div className={cheatCount > 0 ? styles.auditWarning : styles.auditClean}>
          {cheatCount === 0 ? (
            <span>🛡️ Anti-Cheating Status: <strong>Clean Exam Session (0 Violations)</strong></span>
          ) : (
            <span>⚠️ Anti-Cheating Audit: <strong>{cheatCount} Suspicious Activity Violations Flagged</strong></span>
          )}
        </div>

        <div className={styles.note}>
          {qualified ? (
            <p>
              Congratulations! You have successfully passed the screening examination for{" "}
              <strong>{result.course_name || result.domain || "your domain"}</strong> and qualified for the internship!
            </p>
          ) : (
            <p>
              Unfortunately, your score of {percentage}% was below the passing criteria of {result.pass_percentage || 60}%.
              You can re-apply when the next screening test opens.
            </p>
          )}
        </div>

        <div className={styles.actionButtons}>
          {qualified ? (
            <button className={styles.button} onClick={() => navigate("/student/cohort")}>
              Go to My Cohort
            </button>
          ) : (
            <button className={styles.button} onClick={() => navigate("/student/applications")}>
              View My Applications
            </button>
          )}
          <button className={styles.secondaryButton} onClick={() => navigate("/student/dashboard")}>
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExamResult;