import React, {useState} from 'react';
import styles from './JoinQuizPage.module.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {toast} from 'react-toastify';
import logo from '../../../assets/images/logo/logo.png';

const JoinQuizPage = () => {
  const spans = [];
  const numberOfSpans = 200;

  for (let i = 0; i < numberOfSpans; i++) {
    spans.push(<span key={i}></span>);
  }

  const [gameCode, setGameCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate =  useNavigate();

  const handleInputChange = (e) => {
    setGameCode(e.target.value);
  };

  const handleJoinQuiz = async () => {
    if(gameCode === '' || gameCode.length < 6)
    {
      toast.warning('Enter a valid game code')
      return;
    }
    setIsLoading(true);

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
      localStorage.setItem('ug_game_code',gameCode);
        toast.success("Joined successfully");
      navigate('/user/quiz/waiting-room');
    } catch (error) {
      // Handle errors
      console.error('Error joining quiz:', error);
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.logoContainer}>
          <Link to="/"><img src={logo} alt='Logo' className={styles.logo} /></Link>
        </div>
        </nav>
      <section className={styles.sectionContainer} >
        {spans}
        <div className={styles.signinContainer}>
          <div className={styles.signinContent}>
            <h2>Join Quiz Game</h2>
            <div className={styles.form}>
              <div className={styles.inputBox}>
                <input type="number" required onChange={handleInputChange}/>
                <i>Enter Game Code</i>
              </div>
              <div className={styles.inputBox}>
                <input type="button" value={isLoading ? 'Joining...' : 'Join Quiz'} onClick={handleJoinQuiz}/>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JoinQuizPage;
