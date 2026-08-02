import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AddExam.module.css";

function AddExam() {
  const navigate = useNavigate();

  const [exam, setExam] = useState({
    title: "",
    course: "",
    duration: "",
    questions: "",
    totalMarks: "",
    passingMarks: "",
    status: "Active",
    description: "",
  });

  const handleChange = (e) => {
    setExam({
      ...exam,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Exam Added Successfully!");

    navigate("/admin/exams");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <h1>Add New Exam</h1>

        <form onSubmit={handleSubmit}>

          <div className={styles.grid}>

            <div>
              <label>Exam Title</label>
              <input
                type="text"
                name="title"
                value={exam.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Course</label>
              <input
                type="text"
                name="course"
                value={exam.course}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Duration (Minutes)</label>
              <input
                type="number"
                name="duration"
                value={exam.duration}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>No. of Questions</label>
              <input
                type="number"
                name="questions"
                value={exam.questions}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Total Marks</label>
              <input
                type="number"
                name="totalMarks"
                value={exam.totalMarks}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Passing Marks</label>
              <input
                type="number"
                name="passingMarks"
                value={exam.passingMarks}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Status</label>

              <select
                name="status"
                value={exam.status}
                onChange={handleChange}
              >
                <option>Active</option>
                <option>Upcoming</option>
                <option>Completed</option>
              </select>
            </div>

          </div>

          <label>Description</label>

          <textarea
            name="description"
            rows="5"
            value={exam.description}
            onChange={handleChange}
            placeholder="Enter exam description..."
          />

          <div className={styles.buttons}>
            <button type="submit">
              Add Exam
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default AddExam;