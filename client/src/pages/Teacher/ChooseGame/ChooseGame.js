import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChooseGame.module.css';
import { GoHomeFill } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import { Link } from 'react-router-dom';
import logo from '../../../assets/images/logo/logo.png';
import quizGameBanner from '../../../assets/images/quiz-game-banner.png';
import wordMakerBanner from '../../../assets/images/word-maker-banner.png';
import { GoArrowRight } from "react-icons/go";
import style from '../../../assets/css/common.module.css';

const ChooseGame = ({ isLoggedIn, userData }) => {
  // Check if user is logged in and is a teacher
  const isTeacher = isLoggedIn && userData && userData.userType === 'teacher';
  console.log(userData);
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
        <Link to="/"><GoHomeFill className={styles.navIcon + ' ' + styles.Hover} /></Link>
        <GoChevronRight className={styles.navIcon } />
        <div className={styles.navIcon + " " + styles.text}>Choose Game</div>
        <div className={styles.blackOverlay}></div>
        <div className={styles.blackOverlay}></div>
      </div>
      <div className={styles.container}>
        <h1>Games</h1>
        <div className={styles.gameCardContainer}>

          {/* Card for Quiz Game  */}
          <div className={styles.card + " " + style.cursorPointer} onClick={handleQuizGameClick}>
            <div className={styles.imgStatusContainer}>
              <div className={styles.imgContainer}>
                <img src={quizGameBanner} alt='Quiz Game image' />
              </div>
              <div className={styles.gameStatus + " " + styles.dotIcon}>
                Active
              </div>
            </div>
            <div className={styles.flexBar}>
              <h3 >Quiz Game</h3>
              <button className={styles.goButton} >
                <GoArrowRight />
              </button>
            </div>
          </div>

          {/* Card for Words Maker */}
          <div className={styles.card + " " +style.cursorNotAllowed}>
          <div className={styles.imgStatusContainer}>
              <div className={styles.imgContainer}>
                <img src={wordMakerBanner} alt='Quiz Game image' />
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
