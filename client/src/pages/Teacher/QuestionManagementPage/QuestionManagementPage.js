import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './QuestionManagementPage.module.css';
import { useNavigate } from 'react-router-dom';

const QuestionManagementPage = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const navigate = useNavigate();

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem('ultimate_genius0510_token');
      const response = await axios.get('http://localhost:8000/api/teacher/get-questions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuestions(response.data); //response data is an array of questions
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  // Function to handle adding a new question
  const handleAddQuestion = async () => {
      navigate('/teacher/question/add');
  };

  useEffect(() => {
    // Fetch questions when the component mounts
    fetchQuestions();
  }, []);

  return (
    <div className={styles.container}>
      {/* Button to add a new question */}
      <button onClick={handleAddQuestion} className={styles.addButton}>Add Question</button>
      {/* List of existing questions */}
      <ul className={styles.questionList}>
        {questions && questions.length > 0? (questions.map((question, index) => (
          <li key={index} className={styles.questionItem}>
            {question.text}
          </li>
        ))): <p style={{color:'black'}}>No Questions are available to show. <br/> Click above button to add new questions...</p>}
      </ul>
    </div>
  );
};

export default QuestionManagementPage;
