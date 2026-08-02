import { Link } from "react-router-dom";
import styles from "./Attendance.module.css";

function Attendance() {
  const students = [
    {
      id: 1,
      name: "Rahul Kumar",
      attendance: "Present",
    },
    {
      id: 2,
      name: "Priya Sharma",
      attendance: "Present",
    },
    {
      id: 3,
      name: "Sai Kiran",
      attendance: "Absent",
    },
    {
      id: 4,
      name: "Anjali Reddy",
      attendance: "Present",
    },
  ];

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <h1>Attendance</h1>

        <Link to="/mentor/attendance-history">
          Attendance History
        </Link>
      </div>

      <table className={styles.table}>

        <thead>
          <tr>
            <th>Student</th>
            <th>Status</th>
            <th>Update</th>
          </tr>
        </thead>

        <tbody>

          {students.map((student) => (

            <tr key={student.id}>

              <td>{student.name}</td>

              <td>{student.attendance}</td>

              <td>

                <select defaultValue={student.attendance}>
                  <option>Present</option>
                  <option>Absent</option>
                  <option>Late</option>
                </select>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      <button className={styles.button}>
        Save Attendance
      </button>

    </div>
  );
}

export default Attendance;