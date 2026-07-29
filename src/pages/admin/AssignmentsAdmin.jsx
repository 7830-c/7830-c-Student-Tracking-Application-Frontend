import { Link } from "react-router-dom";
import styles from "./AssignmentsAdmin.module.css";

function AssignmentsAdmin() {
  const assignments = [
    {
      id: 1,
      title: "React Mini Project",
      course: "MERN Stack",
      dueDate: "30 Jul 2026",
      submissions: 42,
      status: "Active",
    },
    {
      id: 2,
      title: "Java OOP Assignment",
      course: "Java Full Stack",
      dueDate: "05 Aug 2026",
      submissions: 28,
      status: "Upcoming",
    },
    {
      id: 3,
      title: "Python API Task",
      course: "Python Full Stack",
      dueDate: "20 Jul 2026",
      submissions: 40,
      status: "Completed",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Assignment Management</h1>
          <p>Manage all assignments</p>
        </div>

        <Link to="/add-assignment" className={styles.addBtn}>
          + Add Assignment
        </Link>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Assignment</th>
            <th>Course</th>
            <th>Due Date</th>
            <th>Submissions</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment.id}>
              <td>{assignment.title}</td>
              <td>{assignment.course}</td>
              <td>{assignment.dueDate}</td>
              <td>{assignment.submissions}</td>

              <td
                className={
                  assignment.status === "Active"
                    ? styles.active
                    : assignment.status === "Upcoming"
                    ? styles.upcoming
                    : styles.completed
                }
              >
                {assignment.status}
              </td>

              <td className={styles.actions}>
                <Link to="/assignment-admin-details">View</Link>
                <Link to="/edit-assignment">Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AssignmentsAdmin;