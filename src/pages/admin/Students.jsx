import { Link } from "react-router-dom";
import styles from "./Students.module.css";

const students = [
  {
    id: 1,
    name: "Somesh Kumar",
    email: "somesh@gmail.com",
    course: "Java Full Stack",
    status: "Active",
  },
  {
    id: 2,
    name: "Rahul Kumar",
    email: "rahul@gmail.com",
    course: "Python Full Stack",
    status: "Active",
  },
  {
    id: 3,
    name: "Priya Sharma",
    email: "priya@gmail.com",
    course: "MERN Stack",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Kiran Reddy",
    email: "kiran@gmail.com",
    course: "Data Analytics",
    status: "Active",
  },
];

function Students() {
  return (
    <div className={styles.page}>

      <div className={styles.card}>

        <div className={styles.header}>

          <div>
            <h1>Student Management</h1>
            <p>Manage all registered students.</p>
          </div>

          <Link
            to="/add-student"
            className={styles.addButton}
          >
            + Add Student
          </Link>

        </div>

        <div className={styles.searchBox}>

          <input
            type="text"
            placeholder="Search student..."
          />

        </div>

        <div className={styles.total}>

          Total Students :
          <strong> {students.length}</strong>

        </div>

        <table className={styles.table}>

          <thead>

            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Course</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {students.map((student) => (

              <tr key={student.id}>

                <td>{student.name}</td>

                <td>{student.email}</td>

                <td>{student.course}</td>

                <td>

                  <span
                    className={
                      student.status === "Active"
                        ? styles.active
                        : styles.inactive
                    }
                  >
                    {student.status}
                  </span>

                </td>

                <td className={styles.actions}>

                  <Link to="/student-details">
                    View
                  </Link>

                  <Link to="/edit-student">
                    Edit
                  </Link>

                  <button>
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Students;