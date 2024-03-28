import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ProfilePage.module.css';
import { FaEdit, FaUnlockAlt, FaSignOutAlt } from 'react-icons/fa';
import logo from '../../../assets/images/logo/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import gameImgage from '../../../assets/images/games/quizGame.png'
import { toast } from 'react-toastify';

const ProfilePage = ({ userData, login }) => {


  const [loading, setLoading] = useState(true);
  const [resultLogs, setResultLogs] = useState([]);
  const navigate = useNavigate();

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

  if (loading) {
    return <div>Loading...</div>;
  }

  const navigateToScoreboard = (id) => {
    navigate(`/user/quiz/scoreboard/${id}`);
  }

  const handleEditProfile = () => {
    // Add logic to handle editing profile
  };

  const handleChangePassword = () => {
    // Add logic to handle changing password
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
          <img src={logo} alt='Logo' className={styles.logo} />
        </div>
        <div className={styles.actions}>
          <button onClick={handleEditProfile} className={styles.navOption}>
            <FaEdit /> Edit Profile
          </button>
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
      <td><img src={userData.avatar} alt="Avatar" className={styles.avatar} /></td>
      <td className={styles.userData}>
        <div className={styles.userDataInner}>
          <h6>User Name:</h6>
          <h6>Gender:</h6>
          <h6>Usertype:</h6>
          <h6>Email:</h6>
          <h6>Game Name:</h6>
        </div>
      </td>
      <td className={styles.userData}>
        <div className={styles.userDataInner + " " + styles.values}>
          <h6>{userData.userName}</h6>
          <h6>{userData.userGender}</h6>
          <h6>{userData.userType}</h6>
          <h6>{userData.email}</h6>
          <h6>{userData.gameName}</h6>
        </div>
      </td>
      <td><FaEdit style={{ width: '22px' }} className={styles.editIcon}/></td>
    </tr>
  </tbody>
</table>

      <div className={styles.matchesContainer}>
        {userData.userType === 'student' && (
          <div className={styles.matchesPlayed}>
            <h3>Matches Played</h3>
            <ul>
              {resultLogs.map((match, index) => (
                <li key={index}>{match}</li>
              ))}
            </ul>
          </div>
        )}
        {userData.userType === 'teacher' && (
          <div className={styles.matchesCreated}>
            <h3>Matches Created</h3>
            <ul className={styles.ourList}>
              {resultLogs.map((match, index) => (
                <li key={match._id} onClick={() => {navigateToScoreboard(match._id)}}>
                  <span style={{display:'flex', alignItems:'center', gap:'1.2rem'}}>
                  <div className="card-img-area rounded-circle overflow-hidden">
                    <img src={gameImgage} alt="profile" className={styles.profile + " w-100"}/>
                  </div>
                  <p className={styles.link}>{match.title}</p>
                  </span>
                  <p>Total Students played: {match.studentIds.length}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

    </div>
  );
};

export default ProfilePage;
