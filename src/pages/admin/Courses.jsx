import { Link } from "react-router-dom";
import styles from "./Courses.module.css";

function Courses() {
  const courses = [
    {
      id: 1,
      title: "Java Full Stack",
      duration: "6 Months",
      mentor: "Ravi Kumar",
      students: 120,
      status: "Active",
    },
    {
      id: 2,
      title: "Python Full Stack",
      duration: "5 Months",
      mentor: "Anitha",
      students: 95,
      status: "Active",
    },
    {
      id: 3,
      title: "MERN Stack",
      duration: "4 Months",
      mentor: "Suresh",
      students: 80,
      status: "Upcoming",
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <div className={styles.header}>
          <h1>Course Management</h1>

          <Link to="/add-course" className={styles.addBtn}>
            + Add Course
          </Link>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Course</th>
              <th>Duration</th>
              <th>Mentor</th>
              <th>Students</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.title}</td>
                <td>{course.duration}</td>
                <td>{course.mentor}</td>
                <td>{course.students}</td>
                <td>
                  <span className={styles.status}>
                    {course.status}
                  </span>
                </td>

                <td className={styles.actions}>
                  <Link to="/course-details">View</Link>

                  <Link to="/edit-course">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default Courses;