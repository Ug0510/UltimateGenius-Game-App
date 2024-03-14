import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ScoreboardPage.module.css';
import { useParams } from 'react-router-dom';
import logo from '../../../assets/images/logo/logo.png';
import { GoHomeFill } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import { Link } from 'react-router-dom';
import profile from '../../../assets/images/common/team_3.png';

const ScoreboardPage = ({userData}) => {
  const [quizResults, setQuizResults] = useState([]);

  let {quizId} = useParams();

  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const token = localStorage.getItem('ultimate_genius0510_token');

        console.log(quizId);
        if(!quizId)
        {
          quizId = localStorage.getItem('ug_game_id');
        }

        const response = await axios.get(`http://localhost:8000/api/user/quiz/results/${quizId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.data);
        console.log(typeof (response.data));
        setQuizResults(response.data);
        setTimeout(()=>{
          console.log(quizResults.resultLog);
        },1000);
      } catch (error) {
        console.error('Error fetching quiz results:', error);
      }
    };

    fetchQuizResults();
  }, []);

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
              <div className='col-6'>  <p>Title: {quizResults.title}</p>
            <p>Category: {quizResults.category}</p>
            <p>Teacher Name: {quizResults.resultLog[0].quiz.teacherName} {userData && (quizResults.teacherId == userData._id)? '(You)':""}</p></div>

              <div className={'col-6 '}><p>Duration: {quizResults.resultLog[0].quiz.duration} minutes</p>
            <p>Total Questions: {quizResults.resultLog[0].quiz.totalQuestions}</p></div>
              </div>
            
            
          </div>) : <div></div>
        }

        <table className={styles.scoreboardTable}>
          <thead>
            <tr>
              <th>Student Name</th>
              <th style={{textAlign:'right', paddingRight:'2rem'}}>Score Obtained</th>
            </tr>
          </thead>
        </table>

        <div className={styles.studentScoreList}>

              <ul>
              {quizResults && quizResults.resultLog && quizResults.resultLog.map((log, logIndex) => (
              <li key={logIndex}>
                <div className={styles.flexBox}>
                <span className={styles.profileContainer}>
                  <img src={profile}></img>
                </span>
                <span style={{marginLeft:'20px'}}>
                  <p>{log.studentName} {userData && (log.studentId._id == userData._id)? '(You)':""}</p>
                  {/* <p className={styles.userEmail}>{log.studentId.email}</p> */}
                </span>
                </div>
                <p className={styles.flexBox + ' ' + styles.verticalAlign}>
                  Score Obtained: {log.scoreObtained}
                </p>

                {/* <p>{log.studentName}</p> */}
              </li>
            ))}
              </ul>
        </div>
      </div>
    </div>
  );
};

export default ScoreboardPage;
