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
    dob: "",
    gender: "",
    email: "",
    phoneNumber: "",
    collegeName: "",
    university: "",
    degree: "",
    branch: "",
    currentYear: "",
    cgpa: "",
    graduationYear: "",
    address: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
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
          dob: profile?.dob || "",
          gender: profile?.gender || "",
          email: profile?.email || user?.email || "",
          phoneNumber: profile?.phoneNumber || user?.phoneNumber || user?.phone_number || "",
          collegeName: profile?.collegeName || "",
          university: profile?.university || "",
          degree: profile?.degree || "",
          branch: profile?.branch || "",
          currentYear: profile?.currentYear || "",
          cgpa: profile?.cgpa || "",
          graduationYear: profile?.graduationYear || "",
          address: profile?.address || "",
          city: profile?.city || "",
          district: profile?.district || "",
          state: profile?.state || "",
          pincode: profile?.pincode || "",
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
      const savedProfile = await studentService.saveProfile(userEmail, formData);
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
      alert("Profile Saved Successfully ✅");
      navigate("/student/apply-course", {
        state: {
          profileCompleted: true,
        },
      });
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to save profile. Please try again.");
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
                  required
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
                  required
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Gender</label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
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
                  required
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
                  required
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

            <div className={styles.inputGroup}>
              <label>University</label>
              <input
                type="text"
                name="university"
                value={formData.university}
                onChange={handleChange}
                placeholder="Enter University Name"
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

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Current Year / Semester</label>

                <select
                  name="currentYear"
                  value={formData.currentYear}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>CGPA / Percentage</label>
                <input
                  type="text"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  placeholder="8.75"
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
                <label>District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="District"
                />
              </div>
            </div>

            <div className={styles.row}>
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

              <div className={styles.inputGroup}>
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
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
                name="technicalSkills"
                rows="3"
                value={formData.technicalSkills}
                onChange={handleChange}
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