import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ProfilePage.module.css';
import { FaEdit, FaUnlockAlt, FaSignOutAlt, FaSave } from 'react-icons/fa';
import logo from '../../../assets/images/logo/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import gameImgage from '../../../assets/images/games/quizGame.png'
import { toast } from 'react-toastify';
import { ImCross } from "react-icons/im";

const ProfilePage = ({ userData, login  }) => {


  const [loading, setLoading] = useState(true);
  const [resultLogs, setResultLogs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState({ ...userData });
  const [otp, setOtp] = useState('');
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpError, setOtpError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      setUpdatedUserData({ ...userData });
    }
  }, [userData])

  useEffect(() => {

    console.log(userData);

    if (userData) {
      setLoading(false);
    }

    // Function to fetch result logs
    const fetchResultLogs = async () => {
      try {
        const token = localStorage.getItem('ultimate_genius0510_token');
        // Make API call to fetch result logs
        const response = await axios.get('http://localhost:8000/api/student/quiz/resultLog/0', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Set the result logs in state
        setResultLogs(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching result logs:', error);
        // Handle error
        console.log(error.response.data);
      }
    };

    const fetchLastMatchLog = async (token) => {
      try {
        const token = localStorage.getItem('ultimate_genius0510_token');

        // Make API call to fetch latest quiz results
        const response = await axios.get(`http://localhost:8000/api/teacher/quiz/getlog/0`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setResultLogs(response.data);
        // Return the fetched data
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching latest quiz results:', error);
      }
    };


    // Call the fetchResultLogs function
    if (userData && userData.userType === 'student') {
      fetchResultLogs();
    }
    else if (userData && userData.userType === 'teacher') {
      fetchLastMatchLog();
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserData({ ...updatedUserData, [name]: value });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const navigateToScoreboard = (id) => {
    navigate(`/user/quiz/scoreboard/${id}`);
  }

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleUpdateProfile = async () => {
    try {
      // Username Validation
      if (!updatedUserData.userName.trim()) {
        toast.error('Username is required.');
        return;
      }

      // Required Field Validation
      if (
        !updatedUserData.email.trim() ||
        !updatedUserData.userGender ||
        !updatedUserData.userType ||
        !updatedUserData.gameName.trim()
      ) {
        toast.error('All fields are required.');
        return;
      }

      // Email Format Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updatedUserData.email)) {
        toast.error('Invalid email format.');
        return;
      }

      // Maximum Length Validation
      if (
        updatedUserData.userName.length > 20 ||
        updatedUserData.email.length > 50 ||
        updatedUserData.gameName.length > 20
      ) {
        toast.error('Maximum length exceeded for one or more fields.');
        return;
      }


      const token = localStorage.getItem('ultimate_genius0510_token');
      let flag = true;
        
      if(updatedUserData.gameName !== userData.gameName) {
        // Duplicate User Check Validation
        const { data } = await axios.get(
          `http://localhost:8000/api/user/check-gname/${updatedUserData.gameName}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data.exists) {
          toast.error('Game name already exists.');
          return;
        }
      }

      if (updatedUserData.email !== userData.email)
      {
        // Duplicate User Check Validation
        const { data } = await axios.get(
          `http://localhost:8000/api/user/check-mail/${updatedUserData.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.exists) {
          toast.error('Email already exists.');
          return;
        }
        sendOTP(updatedUserData.email);
        setShowOtpPopup(true);
        setOtpError('');
        flag = false;
      }


      // If all validations pass, proceed with updating the profile
      if(flag)
      {
        await updateProfile();
      }
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response.data.message);
    }
  };

  const updateProfile = async () => {
    try{
      const token = localStorage.getItem('ultimate_genius0510_token');
      const response = await axios.put(
        'http://localhost:8000/api/user/profile',
        updatedUserData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsEditing(false);
      toast.success('Profile updated successfully!');
    }
    catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response.data.message);
    }
  }


  const sendOTP = async (email) => {
    try {
      // Read code.txt in template folder to understand codes for email template
      const response = await axios.post(
        'http://localhost:8000/api/user/send-otp',
        { email, code:'1' }
      );
      toast.success('OTP sent successfully!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      if(error.response.status === 400 && error.response.data.resendTime != null)
      {
        toast.warning(error.response.data.message);
      }
    }
  };

  const verifyOTP = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/user/verify-otp',
        { email: updatedUserData.email, otp }
      );
      // Handle OTP verification success
      await updateProfile();
      setShowOtpPopup(false);
      toast.success('Email verified successfully!');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setOtpError(error.response.data.message);
    }
  };

  const handleChangePassword = () => {
    navigate('/user/forgot-password');
  };

  const handleLogout = () => {
    toast.success('Logging out successfully!');
    login(false);
    navigate('/');
  };

  return (
    <div className={styles.profileContainer}>
      <nav className={styles.navbar}>
        <div className={styles.logoContainer}>
          <Link to="/"><img src={logo} alt='Logo' className={styles.logo} /></Link>
        </div>
        <div className={styles.actions}>
          {!isEditing && (
            <button onClick={handleEditProfile} className={styles.navOption}>
              <FaEdit /> Edit Profile
            </button>
          )}
          {isEditing && (
            <button onClick={handleUpdateProfile} className={styles.navOption}>
              <FaSave /> Save
            </button>
          )}
          <button onClick={handleChangePassword} className={styles.navOption}>
            <FaUnlockAlt /> Change Password
          </button>
          <button onClick={handleLogout} className={styles.navOption}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>


      <table className={styles.userDetails}>
        <div className={styles.spaceFiller}></div>
        <tbody>
          <tr>
            <td><img src={updatedUserData.avatar} alt="Avatar" className={styles.avatar} /></td>
            <td></td>
            <td className={styles.userData}>
              <div className={styles.userDataInner}>
                <h6>User Name:</h6>
                <h6>Gender:</h6>
                <h6>Usertype:</h6>
                <h6>Email:</h6>
                <h6>Game Name:</h6>
              </div>
            </td>
            <td className={styles.userData + " " + styles.values}>
              {isEditing ? (
                <>
                  <input className={styles.inputText} type="text" name="userName" value={updatedUserData.userName} onChange={handleInputChange} />
                  <select className={styles.inputSelect} name="userGender" value={updatedUserData.userGender} onChange={handleInputChange}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <select className={styles.inputSelect} name="userType" value={updatedUserData.userType} onChange={handleInputChange}>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                  </select>
                  <input className={styles.inputText} type="email" name="email" value={updatedUserData.email} onChange={handleInputChange} />
                  <input className={styles.inputText} type="text" name="gameName" value={updatedUserData.gameName} onChange={handleInputChange} />
                </>
              ) : (
                <>
                  <h6>{updatedUserData.userName}</h6>
                  <h6>{updatedUserData.userGender}</h6>
                  <h6>{updatedUserData.userType}</h6>
                  <h6>{updatedUserData.email}</h6>
                  <h6>{updatedUserData.gameName}</h6>
                </>
              )}
            </td>
            <td>
              {/* <FaEdit style={{ width: '22px' }} className={styles.editIcon}/> */}
            </td>
          </tr>
        </tbody>
      </table>

      <div className={styles.matchesContainer}>
      {userData.userType === 'student' && (
          <div className={styles.matchesCreated}>
            <h3>Matches Played</h3>
            <ul className={styles.ourList}>
              {resultLogs.map((match, index) => (
                <li key={match._id} onClick={() => { navigateToScoreboard(match.quiz.quizId) }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                    <div className="card-img-area rounded-circle overflow-hidden">
                      <img src={gameImgage} alt="profile" className={styles.profile + " w-100"} />
                    </div>
                    <p className={styles.link}>{match.quiz.title}</p>
                  </span>
                  <p>Your Score: {match.scoreObtained} / {match.totalScore}</p>
                </li>
              ))}
              {
                resultLogs.length === 0 ?
                  <li >You have not played any matches yet.</li> : <></>
              }
            </ul>
          </div>
        )}
        {userData.userType === 'teacher' && (
          <div className={styles.matchesCreated}>
            <h3>Matches Created</h3>
            <ul className={styles.ourList}>
              {resultLogs.map((match, index) => (
                <li key={match._id} onClick={() => { navigateToScoreboard(match._id) }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                    <div className="card-img-area rounded-circle overflow-hidden">
                      <img src={gameImgage} alt="profile" className={styles.profile + " w-100"} />
                    </div>
                    <p className={styles.link}>{match.title}</p>
                  </span>
                  <p>Total Students played: {match.studentIds.length}</p>
                </li>
              ))}
              {
                resultLogs.length === 0 ?
                  <li >You have not created any matches yet.</li> : <></>
              }
            </ul>
          </div>
        )}
      </div>

      {/* OTP Popup */}
      {showOtpPopup && (
        <div className={styles.otpPopup}>
          <div className={styles.otpPopupContent}>
            <span onClick={() => setShowOtpPopup(false)} className={styles.closeBtn}>
              <ImCross />
            </span>
            <h2 className={styles.otpPopupTitle}>Verify Email address</h2>
            <input
              type="number"
              placeholder="Enter OTP"
              value={otp}
              className={styles.otpInput}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={verifyOTP} className={styles.otpButton}>Verify</button>
            {otpError && <p className={styles.errorMsg}>{otpError}</p>}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;
