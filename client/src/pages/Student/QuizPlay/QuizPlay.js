import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from './QuizPlay.module.css';
import bg from '../../../assets/images/orangeSpace.jpg';
import logo from '../../../assets/images/logo/logo.png';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';

const QuizPlay = () => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const { quizId } = useParams();
  const gameId = localStorage.getItem('ug_game_id');
  const initialTime = localStorage.getItem(`timer${gameId}`) ? JSON.parse(localStorage.getItem(`timer${gameId}`)) : null;
  const [time, setTime] = useState(initialTime);  

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      if(time == null)
        return;
      if (time.minutes === 0 && time.seconds === 0) {
        clearInterval(timer);
        handleSubmitQuiz();
      } else {
        setTime(prevTime => {
          if (prevTime.seconds === 0) {
            return {
              minutes: prevTime.minutes - 1,
              seconds: 59
            };
          } else {
            return {
              minutes: prevTime.minutes,
              seconds: prevTime.seconds - 1
            };
          }
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  useEffect(() => {
    localStorage.setItem(`timer${gameId}`, JSON.stringify(time));
  }, [time]);

  useEffect(() => {
    if (quiz) {
      setSelectedAnswers(
        Object.fromEntries(
          Array.from({ length: quiz.questions.length }, (_, index) => [index, []])
        )
      );
    }
  }, [quiz]);


  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('ultimate_genius0510_token');
        const storedQuizData = localStorage.getItem('quizData'); // Check if quizData exists in localStorage
  
        if (storedQuizData) {
          // If quizData exists in localStorage, use it instead of fetching from the API
          setQuiz(JSON.parse(storedQuizData));
        } else {
          const response = await axios.get(`http://localhost:8000/api/student/quiz/play/${quizId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          setQuiz(response.data);
  
          // Store quizData in localStorage
          localStorage.setItem('quizData', JSON.stringify(response.data));
  
          if (localStorage.getItem(`timer${gameId}`) === 'null' || localStorage.getItem(`timer${gameId}`) === null) {
            setTime({ minutes: response.data.timeLimit, seconds: 0 });
          }
        }
      } catch (error) {
        toast.error('Error fetching quiz. Please try again later.');
        console.error('Error fetching quiz:', error);
      }
    };
  
    fetchQuiz();
  }, [quizId]);
  

  const handleRadioSelect = (questionIndex, optionText) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionText,
    });
    setTimeout(() => {
      console.log(selectedAnswers);
    }, 100);
  };

  const handleCheckboxSelect = (questionIndex, optionText) => {
    const newSelectedAnswers = selectedAnswers[questionIndex] ? [...selectedAnswers[questionIndex]] : [];
    const optionSelected = newSelectedAnswers.includes(optionText);
    if (optionSelected) {
      newSelectedAnswers.splice(newSelectedAnswers.indexOf(optionText), 1);
    } else {
      newSelectedAnswers.push(optionText);
    }
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: newSelectedAnswers,
    });

    setTimeout(() => {
      console.log(selectedAnswers);
    }, 100);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleDivClick = (questionIndex, option) => {
    if (currentQuestion.type === 'true_false' || currentQuestion.correctAnswers.length === 1) {
      handleRadioSelect(questionIndex, option); // Call handleRadioSelect for radio buttons
    } else {
      handleCheckboxSelect(questionIndex, option); // Call handleCheckboxSelect for checkboxes
    }
  };
  
  const handleSubmitQuiz = async () => {
    try {
      let total = 0;
      const token = localStorage.getItem('ultimate_genius0510_token');
      const submitData = {
        quizId: localStorage.getItem('ug_game_id'),
        answers: quiz.questions.map((question, index) => {
          const selectedOptions = selectedAnswers[index] || [];
          const correctOptions = question.correctAnswers;
          let isCorrect;
          if (typeof (selectedOptions) == 'string') {
            isCorrect = selectedOptions === correctOptions[0];
          }
          else {
            isCorrect = JSON.stringify(selectedOptions.sort()) === JSON.stringify(correctOptions.sort());
          }
          const score = isCorrect ? 1 : 0;
          total = total + score;
          return {
            questionContent: question.content,
            selectedOptions: selectedOptions,
            correctOptions: correctOptions,
            score: score
          };
        }),
        scoreObtained: total,
        totalScore: quiz.questions.length
      };

      await axios.post('http://localhost:8000/api/student/quiz/submit', submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast("🦄 Quiz submitted successfully");
      localStorage.removeItem(`timer${gameId}`);

      navigate('/user/quiz/scoreboard');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
        navigate('/');
      } else {
        toast.error('Error submitting quiz. Please try again later.');
        console.error('Error submitting quiz:', error);
      }
    }
  };

  


  if (!quiz) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const { questions } = quiz;
  const currentQuestion = questions[currentQuestionIndex];
  
    
  const renderQuestionContent = (content) => {
    if (content.includes('```')) {
      // Split content into parts before and after code block
      const parts = content.split('```');
      return (
        
        <div className={styles.question}>
           Q. {parts[0]} {/* Display text before code block */}
          <pre className={styles.codeBox}>
            <code>{parts[1]}</code> {/* Display code block */}
          </pre>
          {parts[2]} {/* Display text after code block */}
        </div>
      );
    } else {
      return <p className={styles.question}>Q. {content}</p>; // Display regular text
    }
  };

  return (
    <div className={styles.wrapper} style={{ backgroundImage: `url(${bg})` }}>
      <div className={styles.head}>
        <div className={styles.logoContainer}>
          <img src={logo} alt='Logo' className={styles.logo} />
        </div>
        <h1 className={styles.title}><span>{quiz.title}</span></h1>
        {time !== null && (time.minutes || time.seconds) && (
          <div className={styles.timerContainer}>
            <div className={styles.timerTitle}>Time Remaining:</div> 
            <span>
            <span className={styles.timerTime}><span>{(time.minutes > 9)? time.minutes : "0" + time.minutes}&nbsp; : &nbsp;</span> <span className={styles.timerTimeLabel}>Minutes</span> </span>
            
            <span className={styles.timerTime}><span>{(time.seconds > 9 )? time.seconds : "0" + time.seconds}</span> <span className={styles.timerTimeLabel}>Seconds</span></span>
          
            </span>
          </div>
        )}
      </div>
      <div className={styles.main}>
        <div className={styles.quizWrapper}>
          <div className={styles.quizBoxContainer}>
            <div className={styles.quizOverlaybg}></div>
            <div className={styles.quizBox}>
              <div className={styles.questionContainer} >
                <div className={styles.progress}>
                  <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                </div>
                <div className={styles.questionContentScroller}>
                {renderQuestionContent(currentQuestion.content)}
                <div className={styles.options}>
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className={styles.option} onClick={() => handleDivClick(currentQuestionIndex, option)}>
                      {currentQuestion.type === 'true_false' || currentQuestion.correctAnswers.length === 1 ? (
                        <input
                          type="radio"
                          id={`option-${index}`}
                          checked={selectedAnswers[currentQuestionIndex] === option}
                          onChange={() => handleRadioSelect(currentQuestionIndex, option)}
                          className={styles.listCheckbox}
                        />
                      ) : (
                        <input
                          type="checkbox"
                          id={`option-${index}`}
                          checked={selectedAnswers[currentQuestionIndex]?.includes(option)}
                          onChange={() => handleCheckboxSelect(currentQuestionIndex, option)}
                          className={styles.listCheckbox + " " + styles.square}
                        />
                      )}
                      <label htmlFor={`option-${index}`}>{option}</label>
                    </div>
                  ))}
                </div>
                </div>
              </div>
              <div className={styles.navigation}>
                <button
                  className={styles.navButton}
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </button>

                <button
                  className={styles.navButton}
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  Next
                </button>
              </div>


            </div>

          </div>

        </div>
        <div className={styles.navigationBoxWrapper}>
          <div className={styles.navigationBox}>
            <div>
              <h2 className={styles.navigationTitle}>Question Navigation</h2>
              <div className={styles.questionNavigation}>
                {questions && questions.map((_, index) => (
                  <div
                    key={index}
                    className={`${styles.questionNumber} ${currentQuestionIndex === index ? styles.current : (selectedAnswers[index] && selectedAnswers[index].length > 0 ? styles.attempted : styles.unattempted)}`}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >

                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <ul className={styles.navGuideIcons}>
                <li><span className={styles.guideIcon}></span> Unattempted</li>
                <li><span className={styles.guideIcon + " " + styles.c}></span> Current</li>
                <li><span className={styles.guideIcon + " " + styles.a}></span> Attempted</li>
              </ul>
              <div className={styles.submitContainer}>
                <button className={styles.submitButton} onClick={handleSubmitQuiz}>
                  Submit Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default QuizPlay;
