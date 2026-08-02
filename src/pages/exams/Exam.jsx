import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Exam.module.css";

const questions = [
  {
    id: 1,
    question: "What is Java?",
    options: [
      "Programming Language",
      "Database",
      "Operating System",
      "Browser",
    ],
  },
  {
    id: 2,
    question: "Which language is used for styling web pages?",
    options: [
      "Python",
      "CSS",
      "Java",
      "C++",
    ],
  },
  {
    id: 3,
    question: "React is a...",
    options: [
      "Database",
      "JavaScript Library",
      "Compiler",
      "Operating System",
    ],
  },
];

function Exam() {
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleOptionSelect = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: option,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const submitExam = () => {
    alert("Exam Submitted Successfully ✅");
    navigate("/student/exam-result");
  };

  return (
    <div className={styles.examPage}>
      <div className={styles.examCard}>

        <div className={styles.topBar}>
          <h2>
            Question {currentQuestion + 1} of {questions.length}
          </h2>

          <div className={styles.timer}>
            30:00
          </div>
        </div>

        <div className={styles.questionSection}>
          <h3>{questions[currentQuestion].question}</h3>

          <div className={styles.options}>
            {questions[currentQuestion].options.map((option) => (
              <label
                key={option}
                className={styles.option}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={option}
                  checked={answers[currentQuestion] === option}
                  onChange={() => handleOptionSelect(option)}
                />

                {option}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.buttons}>
          <button
            type="button"
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
          >
            Previous
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              type="button"
              onClick={submitExam}
            >
              Submit Exam
            </button>
          ) : (
            <button
              type="button"
              onClick={nextQuestion}
            >
              Next
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default Exam;