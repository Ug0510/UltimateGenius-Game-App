import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ModifyQuestionBankForm.module.css';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/images/logo/logo.png';
import { GoHomeFill, GoChevronRight } from "react-icons/go";
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ModifyQuestionBankForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [questionsInBank, setQuestionsInBank] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [allQuestions, setAllQuestions] = useState([]);
    const { questionBankId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuestionBank();
        fetchAllQuestions();
    }, []);

    const fetchQuestionBank = async () => {
        try {
            const token = localStorage.getItem('ultimate_genius0510_token');
            const response = await axios.get(`http://localhost:8000/api/teacher/get-question-bank/${questionBankId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const questionBankData = response.data;
            console.log(questionBankData);
            setName(questionBankData.name);
            setDescription(questionBankData.description);
            setQuestionsInBank(questionBankData.questions);
        } catch (error) {
            console.error('Error fetching question bank:', error);
            toast.error('Error fetching question bank');
        }
    };

    const fetchAllQuestions = async () => {
        try {
            const token = localStorage.getItem('ultimate_genius0510_token');
            const response = await axios.get('http://localhost:8000/api/teacher/get-questions', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAllQuestions(response.data);
        } catch (error) {
            console.error('Error fetching all questions:', error);
            toast.error('Error fetching all questions');
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

    const handleRemoveQuestion = (questionId) => {
        const updatedQuestionsInBank = questionsInBank.filter(question => question._id !== questionId);
        setQuestionsInBank(updatedQuestionsInBank);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('ultimate_genius0510_token');
            // Combine questions from question bank and selected questions
            const updatedQuestions = [...questionsInBank, ...selectedQuestions];
            const questionBankData = {
                name,
                description,
                questions: updatedQuestions
            };
            const response = await axios.put(`http://localhost:8000/api/teacher/question-bank/${questionBankId}`, questionBankData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Question bank updated successfully:', response.data);
            toast.success('Question bank updated successfully!');
            navigate('/teacher/quizgame/1');
        } catch (error) {
            console.error('Error updating question bank:', error);
            toast.error('Error updating question bank');
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
                <Link to="/"><GoHomeFill className={styles.navIcon + ' ' + styles.Hover} /></Link>
                <GoChevronRight className={styles.navIcon} />
                <Link to="/teacher/quizgame/1"><div className={styles.navIcon + " " + styles.text + ' ' + styles.Hover}>Question Bank Management</div></Link>
                <GoChevronRight className={styles.navIcon} />
                <div className={styles.navIcon + " " + styles.text}>Modify Question Bank</div>
                <div className={styles.blackOverlay}></div>
                <div className={styles.blackOverlay}></div>
            </div>
            <div className={styles.modifyQuestionBankForm}>
                <h1>Modify Question Bank</h1>
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
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="description">Total Number of Questions in Bank: {questionsInBank.length}</label>
                    </div>
                    <div className={styles.questionList}>
                        <h3>Questions in Question Bank</h3>
                        <ul className={styles.questionListContainer} style={{ maxHeight: '15rem', overflow: 'auto' }}>
                            {questionsInBank.map(question => (
                                <li key={question._id} className={styles.questionItem }>
                                    <span>
                                        {question.content}
                                        
                                    </span>
                                    <button type="button" className={styles.removeButton} onClick={() => handleRemoveQuestion(question._id)} style={{textDecoration:'none'}}>Remove</button>
                                </li>
                            ))}
                            {
                                questionsInBank && questionsInBank.length === 0? <li className={styles.questionItem}> No Questions in Question Bank</li>:<></>
                            }
                        </ul>
                    </div>
                    <div className={styles.questionList}>
                        <h3>Available Questions<span className={styles.instructionText}> &ensp;(Select all questions you want to add in your Question Bank)</span></h3>
                        <ul className={styles.questionListContainer} style={{ maxHeight: '15rem', overflow: 'auto' }}>
                            {allQuestions.filter(question => !questionsInBank.find(q => q._id === question._id)).map(question => (
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
                            {
                                allQuestions && allQuestions.length === 0? <li className={styles.questionItem}> No more questions avialable to add</li>:<></>
                            }
                        </ul>
                    </div>
                    <button type="submit" className={styles.mButton}>Update Question Bank</button>
                </form>
            </div>
        </>
    );
};

export default ModifyQuestionBankForm;
