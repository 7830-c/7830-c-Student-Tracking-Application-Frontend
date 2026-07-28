import styles from "./Profile.module.css";

function Profile() {
  return (
    <div className={styles.profilePage}>
      <div className={styles.profileCard}>

        <div className={styles.header}>
          <h1>Student Profile</h1>
          <p>
            Complete your profile before applying for a course.
          </p>
        </div>

        <form className={styles.form}>

          {/* Personal Information */}
          <div className={styles.section}>
            <h2>Personal Information</h2>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>First Name</label>
                <input
                  type="text"
                  placeholder="Enter First Name"
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Last Name</label>
                <input
                  type="text"
                  placeholder="Enter Last Name"
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Date of Birth</label>
                <input type="date" />
              </div>

              <div className={styles.inputGroup}>
                <label>Gender</label>

                <select>
                  <option>Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter Email Address"
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Phone Number</label>
                <input
                  type="text"
                  placeholder="Enter Phone Number"
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}

          <div className={styles.section}>
            <h2>Academic Information</h2>

            <div className={styles.inputGroup}>
              <label>College Name</label>
              <input
                type="text"
                placeholder="Enter College Name"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>University</label>
              <input
                type="text"
                placeholder="Enter University Name"
              />
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Degree</label>

                <select>
                  <option>Select Degree</option>
                  <option>B.Tech</option>
                  <option>B.E</option>
                  <option>B.Sc</option>
                  <option>BCA</option>
                  <option>MCA</option>
                  <option>M.Tech</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>Branch</label>
                <input
                  type="text"
                  placeholder="CSE / ECE / IT..."
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Current Year / Semester</label>

                <select>
                  <option>Select</option>
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>CGPA / Percentage</label>
                <input
                  type="text"
                  placeholder="8.75"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Graduation Year</label>
              <input
                type="number"
                placeholder="2028"
              />
            </div>
          </div>

          {/* Address */}

          <div className={styles.section}>
            <h2>Address</h2>

            <div className={styles.inputGroup}>
              <label>Address</label>

              <textarea
                rows="4"
                placeholder="Enter Complete Address"
              />
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>City</label>
                <input
                  type="text"
                  placeholder="City"
                />
              </div>

              <div className={styles.inputGroup}>
                <label>District</label>
                <input
                  type="text"
                  placeholder="District"
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>State</label>
                <input
                  type="text"
                  placeholder="State"
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Pincode</label>
                <input
                  type="text"
                  placeholder="Pincode"
                />
              </div>
            </div>
          </div>

          {/* Skills */}

          <div className={styles.section}>
            <h2>Skills</h2>

            <div className={styles.inputGroup}>
              <label>Technical Skills</label>

              <textarea
                rows="3"
                placeholder="Java, React, SQL, Spring Boot..."
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Upload Resume</label>
              <input type="file" />
            </div>
          </div>

          <button
            type="submit"
            className={styles.saveButton}
          >
            Save & Continue
          </button>

        </form>

      </div>
    </div>
  );
}

export default Profile;