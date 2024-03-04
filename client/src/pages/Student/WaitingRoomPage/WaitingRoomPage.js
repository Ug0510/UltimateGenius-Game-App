import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './WaitingRoomPage.module.css'; 
import { Navigate } from 'react-router-dom';

const StudentWaitingRoomPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isQuizStarted, setIsQuizStarted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      checkQuizStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const checkQuizStatus = async () => {
    try {
      const token = localStorage.getItem('ultimate_genius0510_token');
      const quizId = localStorage.getItem('ug_game_id');


      const response = await axios.get(`http://localhost:8000/api/student/check-quiz-if-started/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('test');

      setIsQuizStarted(response.data.isStarted);
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking quiz status:', error);
      setError('Error checking quiz status');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {isLoading && <p className={styles.loadingText}>Loading...{localStorage.getItem('ug_game_id')}</p>}
      {error && <p className={styles.errorText}>{error}{localStorage.getItem('ug_game_id')}</p>}
      {!isLoading && !error && (
        <p className={styles.waitingText}>
          {
            isQuizStarted ? (
              <>
                <Navigate to={`/student/quiz/play/${localStorage.getItem('ug_game_id')}`} replace />
              </>
            ) : (
              <p>Waiting for the quiz to start...</p>
            )
          }
        </p>
      )}
    </div>
  );
};

export default StudentWaitingRoomPage;
