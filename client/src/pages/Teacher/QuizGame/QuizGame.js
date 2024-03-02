import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './QuizGame.module.css'; 

const QuizGame = ({ isLoggedIn, userData }) => {
  // Check if user is logged in and is a teacher
  const isTeacher = isLoggedIn && userData && userData.userType === 'teacher';
  const navigate = useNavigate();

  // Redirect if user is not a teacher or not logged in
  if (!isTeacher) {
    navigate('/');
  }

  // Handle click on Quiz Game card
  const handleManageQuestionsClick = () => {
    // Redirect to manage questions page
    navigate('/teacher/question/manage');
  };

  // Handle click on Manage Question Banks card
  const handleManageQuestionBanksClick = () => {
    // Redirect to manage question banks page
    navigate('/teacher/question-banks/manage');
  };

  // Handle click on Create Quiz card
  const handleCreateQuizClick = () => {
    // Redirect to create quiz page
    navigate('/teacher/quiz/create');
  };

  return (
    <div className={styles.container}>
      <h1>Quiz Game</h1>
      <div className={styles.card}>
        <button className={styles.button} onClick={handleManageQuestionsClick}>
          Manage Questions
        </button>
      </div>
      <div className={styles.card}>
        <button className={styles.button} onClick={handleManageQuestionBanksClick}>
          Manage Question Banks
        </button>
      </div>
      <div className={styles.card}>
        <button className={styles.button} onClick={handleCreateQuizClick}>
          Create Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizGame;
