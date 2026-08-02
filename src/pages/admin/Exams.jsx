import { Link } from "react-router-dom";
import styles from "./Exams.module.css";

function Exams() {
  const exams = [
    {
      id: 1,
      title: "Java Screening Test",
      course: "Java Full Stack",
      duration: "60 mins",
      questions: 30,
      status: "Active",
    },
    {
      id: 2,
      title: "MERN Screening Test",
      course: "MERN Stack",
      duration: "45 mins",
      questions: 25,
      status: "Upcoming",
    },
    {
      id: 3,
      title: "Python Screening Test",
      course: "Python Full Stack",
      duration: "60 mins",
      questions: 35,
      status: "Completed",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Exam Management</h1>
          <p>Manage all screening exams</p>
        </div>

        <Link to="/admin/add-exam" className={styles.addBtn}>
          + Add Exam
        </Link>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Exam</th>
              <th>Course</th>
              <th>Duration</th>
              <th>Questions</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {exams.map((exam) => (
              <tr key={exam.id}>
                <td>{exam.title}</td>
                <td>{exam.course}</td>
                <td>{exam.duration}</td>
                <td>{exam.questions}</td>

                <td
                  className={
                    exam.status === "Active"
                      ? styles.active
                      : exam.status === "Upcoming"
                      ? styles.upcoming
                      : styles.completed
                  }
                >
                  {exam.status}
                </td>

                <td className={styles.actions}>
                  <Link to="/admin/exam-details">View</Link>
                  <Link to="/admin/edit-exam">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Exams;