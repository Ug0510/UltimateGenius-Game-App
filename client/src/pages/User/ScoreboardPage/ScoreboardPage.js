import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ScoreboardPage.module.css';

const ScoreboardPage = () => {
  const [quizResults, setQuizResults] = useState([]);

  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const token = localStorage.getItem('ultimate_genius0510_token');
        const quizId = localStorage.getItem('ug_game_id');
        const response = await axios.get(`http://localhost:8000/api/user/quiz/results/${quizId}`, {
          headers:{
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.data);
        console.log(typeof(response.data));
        setQuizResults(response.data);
      } catch (error) {
        console.error('Error fetching quiz results:', error);
      }
    };

    fetchQuizResults();
  }, []);

  return (
    <div className={styles.scoreboardContainer}>
  <h1 className={styles.scoreboardHeading}>Scoreboard</h1>
  {/* Commented out data */}
  {
    quizResults && quizResults.resultLog?(<div className={styles.commentOutData}>
      <p>Quiz Title: {quizResults.title}</p>
      <p>Category: {quizResults.category}</p>
      <p>Teacher Name: {quizResults.resultLog[0].quiz.teacherName}</p>
      <p>Duration: {quizResults.resultLog[0].quiz.duration} minutes</p>
      <p>Total Questions: {quizResults.resultLog[0].quiz.totalQuestions}</p>
    </div>): <div></div>
  }
  <table className={styles.scoreboardTable}>
    <thead>
      <tr>
        <th>Student Name</th>
        <th>Score Obtained</th>
      </tr>
    </thead>
    <tbody>
      {quizResults && quizResults.resultLog && quizResults.resultLog.map((log, logIndex) => (
        <tr key={logIndex}>
          <td>{log.studentName}</td>
          <td>{log.scoreObtained}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
};

export default ScoreboardPage;
