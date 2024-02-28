import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './QuestionManagementPage.module.css';

const QuestionManagementPage = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');

  // Function to fetch questions from the backend
  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/teacher/questions');
      setQuestions(response.data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  // Function to handle adding a new question
  const handleAddQuestion = async () => {
    try {
      // Send a request to the backend to add the new question
      await axios.post('http://localhost:8000/api/teacher/add-question', { question: newQuestion });
      // After adding the question, fetch the updated list of questions
      fetchQuestions();
      // Clear the input field
      setNewQuestion('');
    } catch (error) {
      console.error('Error adding question:', error);
    }
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
        {questions.map((question, index) => (
          <li key={index} className={styles.questionItem}>
            {question.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionManagementPage;
