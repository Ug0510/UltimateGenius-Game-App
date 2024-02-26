import React, { useState } from 'react';
import axios from 'axios';
import styles from './JoinQuizPage.module.css'; // Import CSS module for styling
import {useNavigate} from 'react-router-dom';

const JoinQuizPage = () => {
  const [gameCode, setGameCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate =  useNavigate();

  const handleInputChange = (e) => {
    setGameCode(e.target.value);
  };

  const handleJoinQuiz = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Fetch JWT token from localStorage
      const token = localStorage.getItem('ultimate_genius0510_token');

      // Send a request to join the quiz using the game code
      const response = await axios.post(
        `http://localhost:8000/api/student/join-quiz/${gameCode}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      localStorage.setItem('ug_game_id',response.data.quizId);

      navigate('/student/quiz/waiting-room');
    } catch (error) {
      // Handle errors
      console.error('Error joining quiz:', error);
      setError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Join Quiz</h2>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={gameCode}
          onChange={handleInputChange}
          placeholder="Enter Game Code"
          className={styles.input}
        />
        <button onClick={handleJoinQuiz} className={styles.joinButton} disabled={isLoading}>
          {isLoading ? 'Joining...' : 'Join Quiz'}
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default JoinQuizPage;
