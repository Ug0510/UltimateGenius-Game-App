import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AddQuestionBankForm.module.css'; 
import {useNavigate} from 'react-router-dom';
import logo from '../../../assets/images/logo/logo.png';
import { GoHomeFill } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import { Link } from 'react-router-dom';

const AddQuestionBankForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const token = localStorage.getItem('ultimate_genius0510_token');
            const response = await axios.get('http://localhost:8000/api/teacher/get-questions', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setQuestions(response.data);
        } catch (error) {
            console.error('Error fetching questions:', error);
            setError('Error fetching questions');
        }
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedQuestions([...selectedQuestions, value]);
        } else {
            setSelectedQuestions(selectedQuestions.filter(id => id !== value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('ultimate_genius0510_token');
            const questionBankData = {
                name,
                description,
                questions: selectedQuestions
            };
            const response = await axios.post('http://localhost:8000/api/teacher/create-qb', questionBankData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Question bank created successfully:', response.data);
            // Reset form fields
            setName('');
            setDescription('');
            setSelectedQuestions([]);

            window.alert('Question bank created Successfully!');
            navigate('/teacher/question-banks/manage');
        } catch (error) {
            console.error('Error creating question bank:', error);
            setError('Error creating question bank');
        }
    };

    return (
        <>
         <nav className={styles.navbar}>
        <div className={styles.logoContainer}>
          <img src={logo} alt='Logo' className={styles.logo} />
        </div>
        </nav>
        <div className={styles.backBtn}>
        <Link to="/"><GoHomeFill className={styles.navIcon + ' ' + styles.Hover}  /></Link>
        <GoChevronRight className={styles.navIcon } />
        <Link to="/teacher/quizgame"><div className={styles.navIcon + " " + styles.text + ' ' + styles.Hover}>Quiz Game</div></Link>
        <GoChevronRight className={styles.navIcon } />
        <div className={styles.navIcon + " " + styles.text}>Create Question Bank</div>
        <div className={styles.blackOverlay}></div>
        <div className={styles.blackOverlay}></div>
      </div>
        <div className={styles.addQuestionBankForm}>
        <h1>Create Question Bank</h1>
        <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="name">Name:*</label>
                <input
                    id="name"
                    className={styles.inputText}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    className={styles.textarea}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div className={styles.questionList}>
                <h3>Available Questions<span className={styles.instructionText}> &ensp;(Select all questions you want to add in your Question Bank)</span></h3>
                <ul className={styles.questionListContainer}>
                {questions.map(question => (
                    <li key={question._id} className={styles.questionItem}>
                        <span>
                        <input
                            type="checkbox"
                            id={question._id}
                            value={question._id}
                            onChange={handleCheckboxChange}
                            checked={selectedQuestions.includes(question._id)}
                            className={styles.listCheckbox}
                        />
                        <label htmlFor={question._id}>{question.content}</label>
                        </span>

                    </li>
                ))}
                </ul>
            </div>
            <button type="submit" className={styles.mButton}>Create Question Bank</button>
        </form>
        {error && <p className={styles.errorMessage}>Error: {error}</p>}
    </div>
    </>
    );
};

export default AddQuestionBankForm;
