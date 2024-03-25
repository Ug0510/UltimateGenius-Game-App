import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ScoreboardPage.module.css';
import { useParams } from 'react-router-dom';
import logo from '../../../assets/images/logo/logo.png';
import { GoHomeFill } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import { Link } from 'react-router-dom';
import profile from '../../../assets/images/common/team_3.png';

const ScoreboardPage = ({ userData }) => {
  const [quizResults, setQuizResults] = useState([]);
  const [quizOnGoing, setQuizOnGoing] = useState(true);

  let { quizId } = useParams();

  useEffect(() => {
    let intervalId2;
    const fetchQuizResults = async () => {
      try {
        const token = localStorage.getItem('ultimate_genius0510_token');

        console.log(quizId);
        if (!quizId) {
          quizId = localStorage.getItem('ug_game_id');
        }

        const response = await axios.get(`http://localhost:8000/api/user/quiz/results/${quizId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setQuizResults(response.data);
        
      } catch (error) {
        console.error('Error fetching quiz results:', error);
      }
    };

    

    intervalId2 = setInterval(fetchQuizResults, 3000);
    
    return () => clearInterval(intervalId2); 
  }, [userData]);

  useEffect(() => {
    let intervalId;

    const checkQuizStatus = async () => {
        try {
            // Fetch quiz status from the server
            const token = localStorage.getItem('ultimate_genius0510_token');
            const gameCode = localStorage.getItem('ug_game_id');

            const response = await axios.get(`http://localhost:8000/api/student/check-quiz-if-started/${gameCode}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data.isStarted);

            if (response.data.isStarted === false) {
              setQuizOnGoing(false);
            }
        } catch (error) {
            console.error('Error checking quiz status:', error);
        }
    };

    if(quizOnGoing)
    {
      checkQuizStatus(); 
      intervalId = setInterval(checkQuizStatus, 3000);
    }
    return () => clearInterval(intervalId); 
}, [userData]);


  return (
    <div className={styles.scoreboardWrapper} >
      <nav className={styles.navbar}>
        <div className={styles.logoContainer}>
          <img src={logo} alt='Logo' className={styles.logo} />
        </div>
      </nav>
      <div className={styles.backBtn}>
        <Link to="/"><GoHomeFill className={styles.navIcon + ' ' + styles.Hover} /></Link>
        <GoChevronRight className={styles.navIcon} />
        <Link to="/teacher/quizgame"><div className={styles.navIcon + " " + styles.text + ' ' + styles.Hover}>Quiz Game</div></Link>
        <GoChevronRight className={styles.navIcon} />
        <div className={styles.navIcon + " " + styles.text}>Scoreboard</div>
        <div className={styles.blackOverlay}></div>
        <div className={styles.blackOverlay}></div>
        <div className={styles.triangle}></div>
      </div>
      <div className={styles.scoreboardContainer}>

        {
          quizResults && quizResults.resultLog ? (<div className={styles.quizDetails}>
            <h1 className={styles.scoreboardHeading}>Quiz Scoreboard</h1>
            <div className='row'>
              <div className='col-4'>  <p>Title: {quizResults.title}</p>
                <p>Category: {quizResults.category}</p>
              </div>

              <div className='col-4'><p>Duration: {quizResults.timeLimit} minutes</p>
                <p>Total Questions: {quizResults.numberOfQuestions}</p>
              </div>
              <div className='col-3'>
              <Link to={`/user/profile/${quizResults.teacherId}`} ><p className={styles.Hover}>Teacher Name:  {quizResults.teacherName} {userData && (quizResults.teacherId == userData._id) ? '(You)' : ""}</p></Link>
                <p>Quiz Status: {quizOnGoing? 'Ongoing':'Ended'}</p>
              </div>
            </div>




          </div>) : <div></div>
        }

        <table className={styles.scoreboardTable}>
          <thead>
            <tr>
              <th>Student Name</th>
              <th style={{ textAlign: 'right', paddingRight: '2rem' }}>Score Obtained</th>
            </tr>
          </thead>
        </table>

        <div className={styles.studentScoreList}>
          <ul>
            {quizResults && quizResults.resultLog && quizResults.resultLog.length > 0 ? (
              quizResults.resultLog.map((log, logIndex) => (
                <li key={logIndex}>
                  <div className={styles.flexBox}>
                    <span className={styles.profileContainer}>
                      <img src={log.studentId.avatar}></img>
                    </span>
                    <span style={{ marginLeft: '20px' }}>
                      <Link to={`/user/profile/${log.studentId._id}`}><p className={styles.Hover}>{log.studentId.gameName} {userData && (log.studentId._id == userData._id) ? '(You)' : ""}</p></Link>
                    </span>
                  </div>
                  <p className={styles.flexBox + ' ' + styles.verticalAlign}>
                    Score Obtained: {log.scoreObtained}
                  </p>
                </li>
              ))
            ) : (
              <li style={{textAlign:'center'}}>No student has finished the game yet!</li>
            )}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default ScoreboardPage;
