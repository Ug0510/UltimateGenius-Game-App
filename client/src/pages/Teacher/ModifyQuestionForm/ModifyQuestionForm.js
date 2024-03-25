import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ModifyQuestionForm.module.css';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/images/logo/logo.png';
import { GoHomeFill } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ModifyQuestionForm = () => {
    const [question, setQuestion] = useState({
        questionText: '',
        questionType: '',
        category: '',
        difficultyLevel: 'medium',
        choices: [],
        correctAnswers: []
    });
    const navigate = useNavigate();
    const { questionId } = useParams();
    useEffect(() => {
        fetchQuestion();
    }, [questionId]);

    const fetchQuestion = async () => {
        try {
            const token = localStorage.getItem('ultimate_genius0510_token');
            const response = await axios.get(`http://localhost:8000/api/teacher/questions/${questionId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            let type = 'multiple_choice';
            if(response.data.correctAnswers[0].toLowerCase() === 'true' || response.data.correctAnswers[0].toLowerCase() === 'false')
            {
                type = 'true_false';
            }
            setQuestion({
                ...response.data,
                questionType:type,
                questionText: response.data.content,
                choices: response.data.options,
            });
            console.log(response.data);

            
            
        } catch (error) {
            console.error('Error fetching question:', error);
            toast.error('Error fetching question. Please try again.');
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Implement logic to update question
            // Make a PUT request to update the question
            const token = localStorage.getItem('ultimate_genius0510_token');

            const sendingQuestion = {
                ...question,
                content:question.questionText,
                options:question.choices
            }
            console.log(sendingQuestion)
            await axios.put(`http://localhost:8000/api/teacher/${questionId}`, sendingQuestion, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Question updated successfully');
            toast.success('Question updated successfully')
            navigate('/teacher/quizgame/0');
        } catch (error) {
            console.error('Error updating question:', error);
            toast.error('Error updating question. Please try again.');
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
                <Link to="/"><GoHomeFill className={styles.navIcon + ' ' + styles.Hover} /></Link>
                <GoChevronRight className={styles.navIcon} />
                <Link to="/teacher/quizgame/0"><div className={styles.navIcon + " " + styles.text + ' ' + styles.Hover}>Question Management</div></Link>
                <GoChevronRight className={styles.navIcon} />
                <div className={styles.navIcon + " " + styles.text}>Modify Question</div>
                <div className={styles.blackOverlay}></div>
                <div className={styles.blackOverlay}></div>
            </div>
            <div className={styles.AddQuestionFormContainer}>
                <h2 className={styles.heading}>Modify Question Form</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Question Text:</label>
                        <input
                            type="text"
                            value={question.questionText}
                            onChange={(e) => setQuestion({ ...question, questionText: e.target.value })}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Category:</label>
                        <input
                            type="text"
                            value={question.category}
                            onChange={(e) => setQuestion({ ...question, category: e.target.value })}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Difficulty Level:</label>
                        <select value={question.difficultyLevel} onChange={(e) => setQuestion({ ...question, difficultyLevel: e.target.value })}>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Question Type:</label>
                        <select value={question.questionType} onChange={(e) => setQuestion({ ...question, questionType: e.target.value })} required>
                            <option value="">Select Question Type</option>
                            <option value="multiple_choice">Multiple Choice</option>
                            <option value="true_false">True/False</option>
                        </select>
                    </div>

                    {/* Additional fields based on questionType */}
                    {question.questionType === 'multiple_choice' && (
                        <>
                            {/* Choices */}
                            <div className={styles.choicesContainer}>
                                <label className={styles.label}>Choices:</label>
                                {question.choices.map((choice, index) => (
                                    <div key={index} className={styles.flexBox}>
                                        <input
                                            type="text"
                                            value={choice}
                                            className={styles.inputText}
                                            onChange={(e) => setQuestion({ ...question, choices: question.choices.map((c, i) => i === index ? e.target.value : c) })}
                                            required
                                        />
                                        {index > 1 && (
                                            <button type="button" onClick={() => setQuestion({ ...question, choices: question.choices.filter((c, i) => i !== index) })} className={styles.mButton} style={{ marginLeft: '10px' }}>
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={() => setQuestion({ ...question, choices: [...question.choices, ''] })} className={styles.mButton + ' ' + styles.second} >Add Choice</button>
                            </div>

                            {/* Correct Answers */}
                            <div className={styles.correctAnswersContainer}>
                                <label className={styles.label} style={{ marginBottom: '1rem' }}>Select all correct answer/answers:</label>
                                {question.choices.map((choice, index) => (
                                    <div key={index} className={styles.answerSelection}>
                                        <input
                                            type="checkbox"
                                            className={styles.listCheckbox}
                                            checked={question.correctAnswers.includes(choice)}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setQuestion({
                                                    ...question,
                                                    correctAnswers: checked ? [...question.correctAnswers, choice] : question.correctAnswers.filter(answer => answer !== choice)
                                                });
                                            }}
                                        />
                                        <span>{choice}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {question.questionType === 'true_false' && (
                        <>
                            {/* Choices */}
                            <div className={styles.choicesContainer}>
                                <label className={styles.label} style={{ marginBottom: '1rem' }}>Select correct answer:</label>
                                <br />
                                <label className={styles.label}>
                                    <input

                                        type="radio"
                                        className={styles.listCheckbox}
                                        name="trueFalseOption"
                                        value="true"
                                        checked={question.correctAnswers.includes('True')}
                                        onChange={() => setQuestion({ ...question, correctAnswers: ['true'] })}
                                    />
                                    True
                                </label>
                                <br /><br />
                                <label className={styles.label}>
                                    <input
                                        type="radio"
                                        className={styles.listCheckbox}
                                        name="trueFalseOption"
                                        value="false"
                                        checked={question.correctAnswers.includes('False')}
                                        onChange={() => setQuestion({ ...question, correctAnswers: ['false'] })}
                                    />
                                    False
                                </label>
                            </div>
                        </>
                    )}

                    <button type="submit" className={styles.submitButton}>Update Question</button>
                </form>
            </div>
        </>
    );
};

export default ModifyQuestionForm;
