import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './QuizCustomizationForm.module.css';
import { useNavigate } from 'react-router-dom';

const QuizCustomizationForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    timeLimit: 30,
    numberOfQuestions: 15,
    showCorrectAnswers: false,
    passingScorePercentage: 45,
    sendQuizOutputToStudents: false,
    getQuizResultOnMail: false,
    randomizedQuestionPool: false,
    randomizedAnswerChoices: false,
  });
  const [questionBanks, setQuestionBanks] = useState([]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: val,
    }));
  };

  useEffect(() => {
    const fetchQuestionBanks = async () => {
      try {
        const token = localStorage.getItem('ultimate_genius0510_token');
        const response = await axios.get('http://localhost:8000/api/teacher/question-banks', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setQuestionBanks(response.data);
      } catch (error) {
        console.error('Error fetching question banks:', error);
      }
    };

    fetchQuestionBanks();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('ultimate_genius0510_token');
      const response = await axios.post('http://localhost:8000/api/teacher/generate-quiz', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      localStorage.setItem('ug_game_id',response.data._id);
      localStorage.setItem('ug_game_code',response.data.gameCode);
      console.log(response.data);
      navigate('/teacher/quiz/waiting-room');
      
    } catch (error) {
      console.error('Error generating quiz:', error);
    }
  }
  

  return (
    <form className={styles['form-container']} onSubmit={handleSubmit}>
      <div>
        <label>Title<span>*</span>:</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div>
        <label>Category<span>*</span>:</label>
        <input type="text" name="category" value={formData.category} onChange={handleChange} required />
      </div>
      <div>
        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} />
      </div>
      <div>
        <label>Question Bank ID<span>*</span>:</label>
        <select name="quizBankId" value={formData.quizBankId} onChange={handleChange} required>
          <option value="">Select Question Bank</option>
          {questionBanks && questionBanks.map((questionBank) => (
            <option key={questionBank._id} value={questionBank._id}>{questionBank.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Time Limit (in minutes):</label>
        <input type="number" name="timeLimit" value={formData.timeLimit} onChange={handleChange} />
      </div>
      <div>
        <label>Number of Questions:</label>
        <input
          type="number"
          name="numberOfQuestions"
          value={formData.numberOfQuestions}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Show Correct Answers:</label>
        <input
          type="checkbox"
          name="showCorrectAnswers"
          checked={formData.showCorrectAnswers}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Passing Score Percentage:</label>
        <input
          type="number"
          name="passingScorePercentage"
          value={formData.passingScorePercentage}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Send Quiz Output to Students:</label>
        <input
          type="checkbox"
          name="sendQuizOutputToStudents"
          checked={formData.sendQuizOutputToStudents}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Get Quiz Result on Mail:</label>
        <input
          type="checkbox"
          name="getQuizResultOnMail"
          checked={formData.getQuizResultOnMail}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Randomized Question Pool:</label>
        <input
          type="checkbox"
          name="randomizedQuestionPool"
          checked={formData.randomizedQuestionPool}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Randomized Answer Choices:</label>
        <input
          type="checkbox"
          name="randomizedAnswerChoices"
          checked={formData.randomizedAnswerChoices}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Generate Quiz</button>
    </form>
  );
  
  
};

export default QuizCustomizationForm;
