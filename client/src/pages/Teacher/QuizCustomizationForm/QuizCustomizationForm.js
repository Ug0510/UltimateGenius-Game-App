import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './QuizCustomizationForm.module.css';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';

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
    console.log(name, '-', val);
    setFormData((prevData) => ({
      ...prevData,
      [name]: val,
    }));
    console.log(formData);
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
        toast.error('Error fetching question banks');
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
      localStorage.setItem('ug_game_id', response.data._id);
      localStorage.setItem('ug_game_code', response.data.gameCode);
      navigate('/user/quiz/waiting-room');
      toast.success('Quiz Created Successfull');

    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error('Error generating quiz');
    }
  }


  return (
    <div className={styles.formContainer}>
      <form className={styles.formBody + ' ' + styles.form2} style={{ marginTop: '1rem' }} onSubmit={handleSubmit}>
        <h1 style={{ marginBottom: '2rem' }}>Quiz Customization Form</h1>
        <div>
          <label className={styles.label}>Title<span>*</span>:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className={styles.input} required />
        </div>
        <div>
          <label className={styles.label}>Category<span>*</span>: <span className={styles.instruction}>(Course/Subject)</span></label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} className={styles.input} placeholder='example: Data Structures' required />
        </div>
        <div>
          <label className={styles.label}>Description: <span className={styles.instruction}>(Optional)</span></label>
          <textarea name="description" value={formData.description} onChange={handleChange} className={styles.input} placeholder='Some Description about this Quiz to guide Students...' />
        </div>
        <div>
          <label className={styles.label}>Question Bank ID<span>*</span>:</label>
          <select name="quizBankId" value={formData.quizBankId} onChange={handleChange} className={styles.input} required>
            <option value="">Select Question Bank</option>
            {questionBanks && questionBanks.map((questionBank) => (
              <option key={questionBank._id} value={questionBank._id}>{questionBank.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={styles.label}>Time Limit (in minutes):</label>
          <input type="number" name="timeLimit" value={formData.timeLimit} onChange={handleChange} className={styles.input} min="1" />
        </div>
        <div>
          <label className={styles.label}>Number of Questions:</label>
          <input
            type="number"
            name="numberOfQuestions"
            value={formData.numberOfQuestions}
            onChange={handleChange}
            className={styles.input}
            min="1"
          />
        </div>
        <div>
          <label className={styles.label}>Passing Percentage</label>
          <input
            type="number"
            name="passingScorePercentage"
            value={formData.passingScorePercentage}
            onChange={handleChange}
            className={styles.input}
            min="0"
            max="100"
          />
        </div>

        <div >
          <input
            type="checkbox"
            name="showCorrectAnswers"
            checked={formData.showCorrectAnswers}
            onChange={handleChange}
            className={styles.listCheckbox}
            id='showCorrectAnswers'
          />
          <label className={styles.labelCheckbox} htmlFor='showCorrectAnswers'>Show Correct Answers to student at the end of Quiz</label>
        </div>

        <div style={{ margin: '20px 0' }}>
          <input
            type="checkbox"
            name="sendQuizOutputToStudents"
            checked={formData.sendQuizOutputToStudents}
            onClick={handleChange}
            className={styles.listCheckbox}
            id='sendQuizOutputToStudents'
          />
          <label className={styles.labelCheckbox} htmlFor='sendQuizOutputToStudents'>Send Quiz Output to Students on mail</label>
        </div>

        <div>
          <input
            type="checkbox"
            name="getQuizResultOnMail"
            checked={formData.getQuizResultOnMail}
            onClick={handleChange}
            className={styles.listCheckbox}
            id='getQuizResultOnMail'
          />
          <label className={styles.labelCheckbox} htmlFor='getQuizResultOnMail'>Get Quiz Result on your mail</label>
        </div>

        <button type="submit" className={styles.button}>Generate Quiz</button>
      </form>
    </div>
  );


};

export default QuizCustomizationForm;
