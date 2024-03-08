import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChooseGame.module.css';
import { GoHomeFill } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import { Link } from 'react-router-dom';
import logo from '../../../assets/images/logo/logo.png';
import quizGameImg from '../../../assets/images/post/post_25.png';
import { GoArrowRight } from "react-icons/go";

const ChooseGame = ({ isLoggedIn, userData }) => {
  // Check if user is logged in and is a teacher
  const isTeacher = isLoggedIn && userData && userData.userType === 'teacher';
  console.log(isTeacher);
  const navigate = useNavigate();

  
    useEffect(() => {
     if (!isTeacher) {
       navigate('/');
     }
   
    },[isLoggedIn]);


  // Handle click on Quiz Game card
  const handleQuizGameClick = () => {
    // Redirect to quiz game creation page for teachers
    navigate('/teacher/quizgame');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.logoContainer}>
        <img src={logo} className={styles.logo} />
      </div>
      <div className={styles.backBtn}>
        <Link to="/"><GoHomeFill className={styles.navIcon} style={{ marginTop: '10px;' }} /></Link>
        <GoChevronRight className={styles.navIcon + ' ' + styles.noHover} />
        <div className={styles.navIcon}>Choose Game</div>
        <div className={styles.blackOverlay}></div>
        <div className={styles.blackOverlay}></div>
      </div>
      <div className={styles.container}>
        <h1>Games</h1>
        <div className={styles.gameCardContainer}>

          {/* Card for Quiz Game  */}
          <div className={styles.card}>
            <div className={styles.imgStatusContainer}>
              <div className={styles.imgContainer}>
                <img src={quizGameImg} alt='Quiz Game image' />
              </div>
              <div className={styles.gameStatus + " " + styles.dotIcon}>
                Active
              </div>
            </div>
            <div className={styles.flexBar}>
              <h3 >Quiz Game</h3>
              <button className={styles.goButton} onClick={handleQuizGameClick}>
                <GoArrowRight />
              </button>
            </div>
          </div>

          {/* Card for Words Maker */}
          <div className={styles.card}>
          <div className={styles.imgStatusContainer}>
              <div className={styles.imgContainer}>
                <img src={quizGameImg} alt='Quiz Game image' />
              </div>
              <div className={styles.gameStatus + " " + styles.dotIcon}>
                Upcoming
              </div>
            </div>
            <div className={styles.flexBar}>
              <h3 >Words Maker</h3>
              <button className={styles.goButton} >
                <GoArrowRight />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ChooseGame;
