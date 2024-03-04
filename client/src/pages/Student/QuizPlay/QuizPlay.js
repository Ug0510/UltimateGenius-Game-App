import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from './QuizPlay.module.css';

const QuizPlay = () => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const { quizId } = useParams();

   // Initialize selectedAnswers array with empty arrays for each question
   useEffect(() => {
    if (quiz) {
      setSelectedAnswers(Array.from({ length: quiz.questions.length }, () => []));
    }
  }, [quiz]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('ultimate_genius0510_token');
        const response = await axios.get(`http://localhost:8000/api/student/quiz/play/${quizId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuiz(response.data);
        setTimeRemaining(response.data.timeLimit);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };

    fetchQuiz();
  }, [quizId]);

  // Handler for radio buttons
const handleRadioSelect = (questionIndex, optionText) => {
  setSelectedAnswers({
    ...selectedAnswers,
    [questionIndex]: optionText,
  });
};

// Handler for checkboxes
const handleCheckboxSelect = (questionIndex, optionText) => {
  // Initialize selected answers array if not already defined
  const newSelectedAnswers = selectedAnswers[questionIndex] ? [...selectedAnswers[questionIndex]] : [];

  // Toggle the selection status of the option
  const optionSelected = newSelectedAnswers.includes(optionText);
  if (optionSelected) {
    // If the option is already selected, remove it
    newSelectedAnswers.splice(newSelectedAnswers.indexOf(optionText), 1);
  } else {
    // If the option is not selected, add it to the selected options
    newSelectedAnswers.push(optionText);
  }

  // Update the selectedAnswers state
  setSelectedAnswers({
    ...selectedAnswers,
    [questionIndex]: newSelectedAnswers,
  });
};



  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleSubmitQuiz = async () => {
    try {
      const token = localStorage.getItem('ultimate_genius0510_token');
      let totalScore = 0;
const submitData = {
  quizId: localStorage.getItem('ug_game_id'),
  answers: questions.map((question, index) => {
    const selectedOptions = selectedAnswers[index] || [];
    const correctOptions = question.correctAnswers;
    let isCorrect;

    if (typeof(selectedOptions) === 'string') {
      // If both arrays have only one element, compare directly
      isCorrect = selectedOptions == correctOptions[0];
    } else {
      // If arrays have multiple elements, compare sorted arrays
      isCorrect = JSON.stringify(selectedOptions.sort()) === JSON.stringify(correctOptions.sort());
    }

    const score = isCorrect ? 1 : 0;
    totalScore += score;

    return {
      questionContent: question.content,
      selectedOptions: selectedOptions,
      correctOptions: correctOptions,
      score: score
    };
  }),
  scoreObtained: totalScore,
  totalScore:questions.length
};


  
      // Make API call to submit quiz answers
      // await axios.post('http://localhost:8000/api/submit-quiz', submitData, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
  
      console.log('Quiz submitted successfully:', submitData);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };
  

  if (!quiz) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const { questions } = quiz;
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className={styles.container}>
      <div className={styles.quizBox}>
        <h1 className={styles.title}>{quiz.title}</h1>
        <div className={styles.questionContainer}>
          <h2 className={styles.question}>{currentQuestion.content}</h2>
          <div className={styles.options}>
            {currentQuestion.options.map((option, index) => (
              <div key={index} className={styles.option}>
                {currentQuestion.type === 'true_false' || currentQuestion.correctAnswers.length == 1 ? (
                  <input
                    type="radio"
                    id={`option-${index}`}
                    checked={selectedAnswers[currentQuestionIndex] === option}
                    onChange={() => handleRadioSelect(currentQuestionIndex, option)}
                  />
                ) : (
                  <input
                    type="checkbox"
                    id={`option-${index}`}
                    checked={selectedAnswers[currentQuestionIndex]?.includes(option)}
                    onChange={() => handleCheckboxSelect(currentQuestionIndex, option)}
                  />
                )}
                <label htmlFor={`option-${index}`}>{option}</label>
              </div>
            ))}

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
          <span className={styles.progress}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <button
            className={styles.navButton}
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            Next
          </button>
        </div>
        <div className={styles.submitContainer}>
          <button className={styles.submitButton} onClick={handleSubmitQuiz}>
            Submit Quiz
          </button>
        </div>
        {timeRemaining !== null && (
          <div className={styles.timer}>
            Time Remaining: {timeRemaining} seconds
          </div>
        )}
      </div>
      <div className={styles.navigationBox}>
        <h3 className={styles.navigationTitle}>Question Navigation</h3>
        <div className={styles.questionNavigation}>
          {questions.map((_, index) => (
            <div
              key={index}
              className={`${styles.questionNumber} ${selectedAnswers[index] !== undefined ? styles.attempted : styles.unattempted}`}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizPlay;
