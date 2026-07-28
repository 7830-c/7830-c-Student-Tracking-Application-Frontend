import { useNavigate } from "react-router-dom";
import styles from "./ExamResult.module.css";

function ExamResult() {
  const navigate = useNavigate();

  // Dummy result (Backend vachaka API nundi vastundi)
  const score = 24;
  const total = 30;
  const percentage = Math.round((score / total) * 100);

  const qualified = percentage >= 60;

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <h1>Screening Exam Result</h1>

        <div className={styles.resultBox}>

          <h2>
            {qualified ? "🎉 Congratulations!" : "Exam Completed"}
          </h2>

          <p>
            Your Score
          </p>

          <div className={styles.score}>
            {score} / {total}
          </div>

          <div className={styles.percentage}>
            {percentage}%
          </div>

          <div
            className={
              qualified
                ? styles.qualified
                : styles.notQualified
            }
          >
            {qualified
              ? "QUALIFIED"
              : "NOT QUALIFIED"}
          </div>

        </div>

        <div className={styles.note}>

          {qualified ? (
            <p>
              Congratulations! Your application will now be
              reviewed for cohort allocation.
            </p>
          ) : (
            <p>
              Unfortunately you did not reach the qualifying
              score. You may apply again when the next
              screening exam opens.
            </p>
          )}

        </div>

        <button
          className={styles.button}
          onClick={() => navigate("/my-applications")}
        >
          Back to My Applications
        </button>

      </div>
    </div>
  );
}

export default ExamResult;