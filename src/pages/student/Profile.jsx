import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { studentService } from "../../services/studentService";
import styles from "./Profile.module.css";

function Profile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    collegeName: "",
    degree: "",
    branch: "",
    graduationYear: "",
    address: "",
    city: "",
    state: "",
    technicalSkills: "",
  });

  useEffect(() => {
    async function loadProfile() {
      if (!user?.email) return;
      try {
        const profile = await studentService.getProfile(user.email);
        setFormData({
          firstName: profile?.firstName || user?.firstName || user?.first_name || "",
          lastName: profile?.lastName || user?.lastName || user?.last_name || "",
          email: profile?.email || user?.email || "",
          phoneNumber: profile?.phoneNumber || user?.phoneNumber || user?.phone_number || "",
          collegeName: profile?.collegeName || "",
          degree: profile?.degree || "",
          branch: profile?.branch || "",
          graduationYear: profile?.graduationYear || "",
          address: profile?.address || "",
          city: profile?.city || "",
          state: profile?.state || "",
          technicalSkills: profile?.technicalSkills || "",
        });
      } catch (err) {
        console.error("Failed to load student profile:", err);
      }
    }
    loadProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userEmail = formData.email || user?.email;
    if (!userEmail) return;

    try {
      const savedProfile = await studentService.saveProfile(userEmail || user?.email, formData);
      const isComplete = studentService.isProfileComplete(savedProfile);
      if (updateUser) {
        updateUser({
          firstName: savedProfile.firstName,
          lastName: savedProfile.lastName,
          first_name: savedProfile.firstName,
          last_name: savedProfile.lastName,
          phoneNumber: savedProfile.phoneNumber,
          phone_number: savedProfile.phoneNumber,
        });
      }
      alert("Profile saved to the database successfully.");
      navigate("/student/apply-course", {
        state: {
          profileCompleted: isComplete,
        },
      });
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Profile save failed. Please try again.");
    }
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileCard}>

        <div className={styles.header}>
          <h1>Student Profile</h1>
          <p>
            Complete your profile before applying for a course.
          </p>
        </div>

       <form
          className={styles.form}
          onSubmit={handleSubmit}
        >

          {/* Personal Information */}
          <div className={styles.section}>
            <h2>Personal Information</h2>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter First Name"
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter Last Name"
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email Address"
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
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
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
                placeholder="Enter College Name"
              />
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Degree</label>

                <select
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                >
                  <option value="">Select Degree</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="B.E">B.E</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="BCA">BCA</option>
                  <option value="MCA">MCA</option>
                  <option value="M.Tech">M.Tech</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>Branch</label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="CSE / ECE / IT..."
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Graduation Year</label>
              <input
                type="number"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
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
                name="address"
                rows="4"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter Complete Address"
              />
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                />
              </div>

              <div className={styles.inputGroup}>
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
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
                name="technicalSkills"
                rows="3"
                value={formData.technicalSkills}
                onChange={handleChange}
                placeholder="Java, React, SQL, Spring Boot..."
              />
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
