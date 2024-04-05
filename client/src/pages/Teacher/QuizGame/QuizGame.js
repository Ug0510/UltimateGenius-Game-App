import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styles from './QuizGame.module.css';
import logo from '../../../assets/images/logo/logo.png'
import QuestionManagementPage from '../QuestionManagementPage/QuestionManagementPage';
import QuestionBankManagementPage from '../QuestionBankManagementPage/QuestionBankManagementPage';
import QuizCustomizationPage from '../QuizCustomizationForm/QuizCustomizationForm';


const QuizGame = ({ isLoggedIn, userData }) => {
  // Check if user is logged in and is a teacher
  const navigate = useNavigate();
  const { pageIndex } = useParams();
  const [activeIndex, setActiveIndex] = useState(pageIndex? Number(pageIndex) : 2);
  const [currentPage, setCurrentPage] = useState(null);

  useEffect(() => {

    if(!isLoggedIn)
    {
      navigate('/');
    }
    if(userData)
    {
      if(userData.userType.trim() !== 'teacher')
      {
        navigate('/');
        
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    switch (activeIndex) {
      case 0:
        setCurrentPage(<QuestionManagementPage />);
        break;
      case 1:
        setCurrentPage(<QuestionBankManagementPage />);
        break;
      case 2:
        setCurrentPage(<QuizCustomizationPage />);
        break;
      default:
        setCurrentPage(null);
    }
  }, [activeIndex]);




  const handleItemClick = (index) => {
    setActiveIndex(index);
  };



  return (
    <div className={styles.wrapper}>

      <nav className={styles.navbar}>
        <div className={styles.logoContainer}>
          <Link to="/"><img src={logo} alt='Logo' className={styles.logo} /></Link>
        </div>

        <div className={styles.headList}>
          <ul>
            <li className={activeIndex === 0 ? styles.active : ''} onClick={() => handleItemClick(0)}>
              Manage Questions
            </li>
            <li className={activeIndex === 1 ? styles.active : ''} onClick={() => handleItemClick(1)}>
              Manage Question Banks
            </li>
            <li className={activeIndex === 2 ? styles.active : ''} onClick={() => handleItemClick(2)}>
              Create Quiz
            </li>
          </ul>
        </div>
      </nav>

      {currentPage}

    </div>
  );
};

export default QuizGame;
