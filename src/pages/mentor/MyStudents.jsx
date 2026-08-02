import { Link } from "react-router-dom";
import styles from "./MyStudents.module.css";

function MyStudents() {
  const students = [
    {
      id: 1,
      name: "Rahul Kumar",
      email: "rahul@gmail.com",
      cohort: "Java Full Stack - Batch A",
      attendance: "96%",
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya@gmail.com",
      cohort: "Java Full Stack - Batch A",
      attendance: "92%",
    },
    {
      id: 3,
      name: "Sai Kiran",
      email: "saikiran@gmail.com",
      cohort: "Java Full Stack - Batch A",
      attendance: "89%",
    },
    {
      id: 4,
      name: "Anjali Reddy",
      email: "anjali@gmail.com",
      cohort: "Java Full Stack - Batch A",
      attendance: "98%",
    },
  ];

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <h1>My Students</h1>
        <p>Students assigned to your cohort</p>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>

          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Cohort</th>
              <th>Attendance</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {students.map((student) => (
              <tr key={student.id}>

                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.cohort}</td>
                <td>{student.attendance}</td>

                <td>
                  <Link to="/mentor/student-details">
                    View
                  </Link>
                </td>

              </tr>
            ))}

          </tbody>

        </table>
      </div>

    </div>
  );
}

export default MyStudents;