import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AddQuestionBankForm.module.css'; 
import {useNavigate} from 'react-router-dom';
import logo from '../../../assets/images/logo/logo.png';
import { GoHomeFill } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import { Link } from 'react-router-dom';
import {toast} from 'react-toastify';

const AddQuestionBankForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    

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
            toast.error('Error fetching questions');
        }
    };

    const handleCheckboxChange = (questionId) => {
        const newSelectedQuestions = [...selectedQuestions]; 
        const questionIndex = newSelectedQuestions.indexOf(questionId);
      
        if (questionIndex !== -1) {
          newSelectedQuestions.splice(questionIndex, 1); // Remove if already selected
        } else {
          newSelectedQuestions.push(questionId); // Add if not selected
        }
      
        setSelectedQuestions(newSelectedQuestions);
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

            toast.success('Question bank created Successfully!');
            navigate('/teacher/quizgame/1');
        } catch (error) {
            console.error('Error creating question bank:', error);
            toast.error('Error creating question bank');
        }
    };

    return (
        <>
         <nav className={styles.navbar}>
        <div className={styles.logoContainer}>
          <Link to="/"><img src={logo} alt='Logo' className={styles.logo} /></Link>
        </div>
        </nav>
        <div className={styles.backBtn}>
        <Link to="/"><GoHomeFill className={styles.navIcon + ' ' + styles.Hover}  /></Link>
        <GoChevronRight className={styles.navIcon } />
        <Link to="/teacher/quizgame/1"><div className={styles.navIcon + " " + styles.text + ' ' + styles.Hover}>Question Bank Management</div></Link>
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
                    <li key={question._id} className={styles.questionItem} onClick={() => handleCheckboxChange(question._id)}>
                    <span>
                      <input
                        type="checkbox"
                        id={question._id}
                        value={question._id}
                        checked={selectedQuestions.includes(question._id)}
                        className={styles.listCheckbox}
                      />
                      <label >{question.content}</label>
                    </span>
                  </li>
                  
                ))}
                </ul>
            </div>
            <button type="submit" className={styles.mButton}>Create Question Bank</button>
        </form>
    </div>
    </>
    );
};

export default AddQuestionBankForm;
