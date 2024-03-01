import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChooseGame.module.css'; 


const ChooseGame = ({ isLoggedIn, userData }) => {
  // Check if user is logged in and is a teacher
  const isTeacher = isLoggedIn && userData && userData.userType === 'teacher';
  console.log(isTeacher);
  const navigate = useNavigate();

  // Redirect if user is not a teacher or not logged in
  if (!isTeacher) {
    navigate('/');
  }

  // Handle click on Quiz Game card
  const handleQuizGameClick = () => {
    // Redirect to quiz game creation page for teachers
    navigate('/teacher/quizgame');
  };

  return (
    <div className={styles.container}>
      <h1>Choose Game</h1>
      <div className={styles.card}>
        <button className={styles.button} onClick={handleQuizGameClick}>
          Quiz Game
        </button>
        <button className={styles.button } onClick={handleQuizGameClick} disabled>
          Game 2
        </button>
      </div>
    </div>
  );
};

export default ChooseGame;
