import { Link } from "react-router-dom";
import styles from "./Assignments.module.css";

function Assignments() {

  const assignments = [
    {
      id: 1,
      title: "React Dashboard",
      batch: "Java Full Stack - Batch A",
      due: "05 Aug 2026",
      submitted: "38 / 42",
    },
    {
      id: 2,
      title: "REST API Integration",
      batch: "Java Full Stack - Batch A",
      due: "10 Aug 2026",
      submitted: "34 / 42",
    },
    {
      id: 3,
      title: "Authentication Module",
      batch: "Java Full Stack - Batch A",
      due: "15 Aug 2026",
      submitted: "29 / 42",
    },
  ];

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <h1>Assignments</h1>
        <p>Review student submissions</p>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>

          <thead>
            <tr>
              <th>Assignment</th>
              <th>Batch</th>
              <th>Due Date</th>
              <th>Submitted</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {assignments.map((item) => (

              <tr key={item.id}>

                <td>{item.title}</td>
                <td>{item.batch}</td>
                <td>{item.due}</td>
                <td>{item.submitted}</td>

                <td>
                  <Link to="/mentor/assignment-feedback">
                    Review
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

export default Assignments;