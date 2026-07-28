import { useNavigate } from "react-router-dom";
import styles from "./ExamInstructions.module.css";

function ExamInstructions() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <h1>Screening Examination</h1>

        <p className={styles.subtitle}>
          Please read all instructions carefully before starting the exam.
        </p>

        <div className={styles.section}>
          <h2>Exam Details</h2>

          <ul>
            <li>Total Questions : <strong>30</strong></li>
            <li>Duration : <strong>30 Minutes</strong></li>
            <li>Question Type : <strong>Multiple Choice Questions</strong></li>
            <li>Passing Score : <strong>60%</strong></li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>Instructions</h2>

          <ul>
            <li>Read every question carefully.</li>
            <li>Each question has only one correct answer.</li>
            <li>Do not refresh the browser during the exam.</li>
            <li>Timer will automatically submit the exam.</li>
            <li>Ensure stable internet connectivity.</li>
          </ul>
        </div>

        <button
          className={styles.startButton}
          onClick={() => navigate("/exam")}
        >
          Start Examination
        </button>

      </div>
    </div>
  );
}

export default ExamInstructions;