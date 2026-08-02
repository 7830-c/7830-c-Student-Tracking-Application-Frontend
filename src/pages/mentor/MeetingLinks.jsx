import { Link } from "react-router-dom";
import styles from "./MeetingLinks.module.css";

function MeetingLinks() {
  const meetings = [
    {
      id: 1,
      course: "Java Full Stack",
      batch: "Batch A",
      schedule: "Mon - Fri | 10:00 AM",
      link: "https://meet.google.com/java-batch-a",
    },
    {
      id: 2,
      course: "MERN Stack",
      batch: "Batch B",
      schedule: "Mon - Fri | 2:00 PM",
      link: "https://meet.google.com/mern-batch-b",
    },
    {
      id: 3,
      course: "Python Full Stack",
      batch: "Batch C",
      schedule: "Saturday | 9:00 AM",
      link: "https://meet.google.com/python-batch-c",
    },
  ];

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <h1>Meeting Links</h1>
        <p>Manage class meeting links</p>
      </div>

      <table className={styles.table}>

        <thead>
          <tr>
            <th>Course</th>
            <th>Batch</th>
            <th>Schedule</th>
            <th>Meeting Link</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {meetings.map((meeting) => (
            <tr key={meeting.id}>

              <td>{meeting.course}</td>
              <td>{meeting.batch}</td>
              <td>{meeting.schedule}</td>

              <td>
                <a
                  href={meeting.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  Join Meeting
                </a>
              </td>

              <td>
                <Link to="/mentor/edit-meeting-link">
                  Edit
                </Link>
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default MeetingLinks;