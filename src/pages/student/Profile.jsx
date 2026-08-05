import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { studentService } from "../../services/studentService";
import apiClient from "../../services/apiClient"; // <-- Added for dynamic fetching
import { API_ENDPOINTS } from "../../constants/apiEndpoints"; // <-- Added for dynamic fetching
import styles from "./Profile.module.css";

function Profile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [isExistingStudent, setIsExistingStudent] = useState(false);
  const [isVerificationLocked, setIsVerificationLocked] = useState(false);
  const [availableDomains, setAvailableDomains] = useState([]);

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
    // Existing Student Fields
    domain: "",
    courseBatch: "", 
    offerLetter: null,
  });

  const calculateProgress = () => {
    const baseFields = ["firstName", "lastName", "email", "phoneNumber", "collegeName", "degree", "branch", "graduationYear", "address", "city", "state", "technicalSkills"];
    let filled = baseFields.filter(f => formData[f] && String(formData[f]).trim() !== "").length;
    let total = baseFields.length;

    if (isExistingStudent) {
      total += 3; // Accounts for domain, batch, and offer letter
      if (formData.domain) filled++;
      if (formData.courseBatch) filled++;
      if (formData.offerLetter) filled++;
    }
    return Math.round((filled / total) * 100);
  };

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        // 1. Fetch ALL courses by looping through Django's pagination pages
        let allCourses = [];
        let currentPage = 1;
        let hasNextPage = true;

        while (hasNextPage) {
          const courseRes = await apiClient.get(API_ENDPOINTS.COURSES?.BASE || "/courses/", {
            params: { page: currentPage }
          });
          
          // Grab the courses from the current page
          const results = courseRes.data?.results || courseRes.data || [];
          allCourses = [...allCourses, ...results];
          
          // Check if Django says there is another page
          if (courseRes.data?.next) {
            currentPage++; // Flip to the next page and loop again
          } else {
            hasNextPage = false; // Stop looping when we hit the end
          }
        }

        // Extract unique domains from ALL fetched courses
        const uniqueDomains = [...new Set(allCourses.map(c => c.domain || c.streamName || c.name).filter(Boolean))];
        if (isMounted) setAvailableDomains(uniqueDomains.sort());

      } catch (err) {
        console.error("Failed to load domains from backend:", err);
      }

      // 2. Load Student Profile
      if (!user?.email) return;
      try {
        const profile = await studentService.getProfile(user.email);
        if (profile && isMounted) {
          setIsExistingStudent(profile.isExistingStudent === "yes" || profile.isExistingStudent === true);
          if (profile.domain || profile.courseBatch) setIsVerificationLocked(true);
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
            domain: profile?.domain || "",
            courseBatch: profile?.courseBatch || "",
            offerLetter: profile?.offerLetter || null,
          });
        }
      } catch (err) {
        console.error("Failed to load student profile:", err);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      offerLetter: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userEmail = formData.email || user?.email;
    if (!userEmail) return;

    try {
      const payload = {
        ...formData,
        isExistingStudent: isExistingStudent ? "yes" : "no", // Convert boolean to string for the service
      };

      // 🚨 CRITICAL FIX: If submitting verification for the first time, force account into PENDING lock!
      if (isExistingStudent && !isVerificationLocked) {
        payload.status = "NOT_AVAILABLE";
      }

      const savedProfile = await studentService.saveProfile(userEmail, payload);
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

      if (isExistingStudent) {
        alert("✅ Verification data submitted! Please wait for Admin approval.");
        // Do NOT navigate away. The calculateProgress() will hit 100% and lock the screen automatically.
      } else {
        alert("Profile saved successfully.");
        navigate("/student/apply-course", {
          state: { profileCompleted: isComplete },
        });
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Profile save failed. Please try again.");
    }
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileCard}>
        <div className={styles.headerRow}>
          <div>
            <h1>Student Profile</h1>
            <p>
              {isExistingStudent && calculateProgress() === 100 
                ? "Your profile is locked while Admin verifies your enrollment." 
                : "Complete your profile before accessing courses or verification."}
            </p>
          </div>
          <div className={styles.progressContainer}>
            <div className={styles.progressRing} style={{ background: `conic-gradient(#2563eb ${calculateProgress()}%, #e5e7eb ${calculateProgress()}%)` }}>
              <div className={styles.progressInner}>
                {calculateProgress()}%
              </div>
            </div>
            <span className={styles.progressLabel}>Completed</span>
          </div>
        </div>

        {calculateProgress() === 100 && isExistingStudent && (
          <div className={styles.lockedBanner}>
            <span className={styles.lockedIcon}>🔒</span>
            <div>
              <div className={styles.lockedTitle}>Verification Submitted</div>
              <div className={styles.lockedSub}>Please wait for Admin approval. You cannot edit your profile at this time.</div>
            </div>
          </div>
        )}

        {/* Existing Student Toggle Banner */}
        {isVerificationLocked ? (
          <div className={styles.lockedBanner}>
             <span className={styles.lockedIcon}>✅</span>
             <div>
               <div className={styles.lockedTitle}>Verification Under Review</div>
               <div className={styles.lockedSub}>Admin is verifying your enrollment. You can safely complete the rest of your profile below.</div>
             </div>
          </div>
        ) : (
          <div className={styles.toggleBanner}>
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                className={styles.toggleCheckbox}
                checked={isExistingStudent}
                onChange={(e) => setIsExistingStudent(e.target.checked)}
              />
              Are you already an enrolled Sure ProEd Student?
            </label>
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
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

          {/* Conditional Existing Student Verification Section */}
          {isExistingStudent && (
            <div className={styles.section} style={{ borderLeft: "4px solid #2563eb", paddingLeft: "12px", opacity: isVerificationLocked ? 0.7 : 1 }}>
              <h2>Sure ProEd Verification Details</h2>
              
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>Enrolled Domain</label>
                  <select name="domain" value={formData.domain} onChange={handleChange} required disabled={isVerificationLocked}>
                    <option value="">Select Domain</option>
                    {availableDomains.map((domainName, index) => (
                      <option key={index} value={domainName}>
                        {domainName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label>Group Number</label>
                  <input
                    type="text"
                    name="courseBatch"
                    value={formData.courseBatch}
                    onChange={handleChange}
                    placeholder="e.g. G2-26"
                    required
                    disabled={isVerificationLocked}
                    style={{ textTransform: "uppercase" }}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>Upload Offer Letter (PDF/Image)</label>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    required={!formData.offerLetter}
                    disabled={isVerificationLocked}
                  />
                </div>
              </div>
            </div>
          )}

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
                <select name="degree" value={formData.degree} onChange={handleChange}>
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
                placeholder="2027"
              />
            </div>
          </div>

          {/* Address & Skills */}
          <div className={styles.section}>
            <h2>Address & Skills</h2>
            <div className={styles.inputGroup}>
              <label>Address</label>
              <textarea
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter Complete Address"
              />
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
              </div>
              <div className={styles.inputGroup}>
                <label>State</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" />
              </div>
            </div>

            <div className={styles.inputGroup} style={{ marginTop: "12px" }}>
              <label>Technical Skills</label>
              <textarea
                name="technicalSkills"
                rows="2"
                value={formData.technicalSkills}
                onChange={handleChange}
                placeholder="Java, React, Verilog, C++..."
              />
            </div>
          </div>

          <button type="submit" className={styles.saveButton}>
            {isVerificationLocked ? "Save Profile Updates" : (isExistingStudent ? "Submit for Verification" : "Save & Continue")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;