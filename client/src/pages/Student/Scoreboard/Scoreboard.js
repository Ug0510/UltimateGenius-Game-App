// ScoreboardPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ScoreboardPage.module.css';

const ScoreboardPage = () => {
  const [quizResults, setQuizResults] = useState([]);

  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const token = localStorage.getItem('ultimate_genius0510_token');
        const response = await axios.get(`http://localhost:8000/api/student/quiz/results`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuizResults(response.data);
      } catch (error) {
        console.error('Error fetching quiz results:', error);
      }
    };

    fetchQuizResults();
  }, []);

  return (
    <div className={styles.scoreboard-container}>
      <h1 className={styles.scoreboard-heading}>Scoreboard</h1>
      <table className={styles.scoreboard-table}>
        <thead>
          <tr>
            <th>Quiz Title</th>
            <th>Category</th>
            <th>Score Obtained</th>
            <th>Total Score</th>
            <th>Date Submitted</th>
          </tr>
        </thead>
        <tbody>
          {quizResults.map((result, index) => (
            <tr key={index}>
              <td>{result.quiz.title}</td>
              <td>{result.quiz.category}</td>
              <td>{result.scoreObtained}</td>
              <td>{result.totalScore}</td>
              <td>{new Date(result.submittedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreboardPage;
