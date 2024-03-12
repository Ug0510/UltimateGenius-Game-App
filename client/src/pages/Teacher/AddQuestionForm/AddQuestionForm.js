import React, { useState } from 'react';
import axios from 'axios';
import styles from './AddQuestionForm.module.css';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/images/logo/logo.png';
import { GoHomeFill } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import { Link } from 'react-router-dom';

const AddQuestionForm = () => {
    const [questionText, setQuestionText] = useState('');
    const [questionType, setQuestionType] = useState('');
    const [category, setCategory] = useState('');
    const [difficultyLevel, setDifficultyLevel] = useState('easy');
    const [choices, setChoices] = useState([]);
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleQuestionTypeChange = (e) => {
        setQuestionType(e.target.value);
        setChoices(['']);
        setCorrectAnswers([]);
    };

    const handleChoiceChange = (index, value) => {
        const updatedChoices = [...choices];
        updatedChoices[index] = value;
        setChoices(updatedChoices);
    };

    const handleAddChoice = () => {
        if(choices.length < 6)
        {
            setChoices([...choices, '']);
        }
        else{
            // Show warning , more than 6 options not allowed
        }
    };

    const handleRemoveChoice = (index) => {
        const updatedChoices = [...choices];
        updatedChoices.splice(index, 1);
        setChoices(updatedChoices);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let questionData;
            if (questionType === 'multiple_choice') {
                questionData = {
                    content: questionText,
                    category,
                    difficultyLevel,
                    options: choices,
                    correctAnswers,
                };
            } else if (questionType === 'true_false') {
                questionData = {
                    content: questionText,
                    category,
                    difficultyLevel,
                    options: ['true', 'false'],
                    correctAnswers,
                };
            }

            const token = localStorage.getItem('ultimate_genius0510_token');
            const response = await axios.post('http://localhost:8000/api/teacher/create-questions', questionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('Question added successfully:', response.data);
            window.alert('Question Added');
            navigate('/teacher/question/manage');
        } catch (error) {
            console.error('Error adding question:', error);
            setError('Error adding question. Please try again.');
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
        <div className={styles.navIcon + " " + styles.text}>Add Question</div>
        <div className={styles.blackOverlay}></div>
        <div className={styles.blackOverlay}></div>
      </div>
        <div className={styles.AddQuestionFormContainer}>
    <h2 className={styles.heading}>Add Question Form</h2>
    <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
            <label>Question Text:</label>
            <input
                type="text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                required
            />
        </div>

        <div className={styles.formGroup}>
            <label>Category:</label>
            <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            />
        </div>

        <div className={styles.formGroup}>
            <label>Difficulty Level:</label>
            <select value={difficultyLevel} onChange={(e) => setDifficultyLevel(e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>
        </div>

        <div className={styles.formGroup}>
            <label>Question Type:</label>
            <select value={questionType} onChange={handleQuestionTypeChange} required>
                <option value="">Select Question Type</option>
                <option value="multiple_choice">Multiple Choice</option>
                <option value="true_false">True/False</option>
            </select>
        </div>

        {questionType === 'multiple_choice' && (
            <div className={styles.choicesContainer}>
                <label className={styles.label}>Choices:</label>
                {choices.map((choice, index) => (
                    <div key={index} className={styles.flexBox }>
                        <input
                            type="text"
                            value={choice}
                            className={styles.inputText}
                            onChange={(e) => handleChoiceChange(index, e.target.value)}
                            required
                        />
                        {index > 1 && (
                            <button type="button" onClick={() => handleRemoveChoice(index)} className={styles.mButton} style={{marginLeft:'10px'}}>
                                Remove
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={handleAddChoice} className={styles.mButton + ' ' + styles.second} >Add Choice</button>
            </div>
        )}

        {questionType === 'multiple_choice' && (
            <div className={styles.correctAnswersContainer}>
                <label className={styles.label} style={{marginBottom:'1rem'}}>Select all correct answer/answers:</label>
                {choices.length > 0 && choices.map((choice, index) => (
                    <div key={index} className={styles.answerSelection}>
                        <input
                            type="checkbox"
                            className={styles.listCheckbox}
                            checked={correctAnswers.includes(choice)}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                setCorrectAnswers((prevAnswers) => {
                                    if (checked) {
                                        return [...prevAnswers, choice];
                                    } else {
                                        return prevAnswers.filter((answer) => answer !== choice);
                                    }
                                });
                            }}
                        />
                        <span>{choice}</span>
                    </div>
                ))}
            </div>
        )}

        {questionType === 'true_false' && (
            <div className={styles.choicesContainer}>
                <label className={styles.label} style={{marginBottom:'1rem'}}>Select correct answer:</label>
                <br/>
                <label className={styles.label}>
                    <input
                        type="radio"
                        className={styles.listCheckbox}
                        name="trueFalseOption"
                        value="true"
                        checked={correctAnswers.includes('true')}
                        onChange={() => setCorrectAnswers(['true'])}
                    />
                    True
                </label>
                <br/><br/>
                <label className={styles.label}>
                    <input
                        type="radio"
                        className={styles.listCheckbox}
                        name="trueFalseOption"
                        value="false"
                        checked={correctAnswers.includes('false')}
                        onChange={() => setCorrectAnswers(['false'])}
                    />
                    False
                </label>
            </div>
        )}

        <button type="submit" className={styles.submitButton}>Add Question</button>
    </form>
    {error && <p className={styles.error}>{error}</p>}
</div>
</>
    );
};

export default AddQuestionForm;
