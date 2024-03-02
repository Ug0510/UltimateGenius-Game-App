import React, { useState } from 'react';
import axios from 'axios';
import styles from './AddQuestionForm.module.css';
import { useNavigate } from 'react-router-dom';


const AddQuestionForm = () => {
    const [questionText, setQuestionText] = useState('');
    const [questionType, setQuestionType] = useState('');
    const [category, setCategory] = useState('');
    const [difficultyLevel, setDifficultyLevel] = useState('easy');
    const [choices, setChoices] = useState(['']);
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
        setChoices([...choices, '']);
    };

    const handleRemoveChoice = (index) => {
        const updatedChoices = [...choices];
        updatedChoices.splice(index, 1);
        setChoices(updatedChoices);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Construct question data object
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

            // Make POST request to add question
            const token = localStorage.getItem('ultimate_genius0510_token');
            const response = await axios.post('http://localhost:8000/api/teacher/create-questions', questionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Handle success response
            console.log('Question added successfully:', response.data);
            window.alert('Question Added');
            navigate('/teacher/question/manage');
        } catch (error) {
            // Handle error
            console.error('Error adding question:', error);
            setError('Error adding question. Please try again.');
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Add Question</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Question Text:</label>
                    <input
                        type="text"
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        required
                    />
                </div>
                {/* Category (optional) */}
                
                    <div>
                        <label>Category:</label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </div>
                
                {/* Difficulty Level */}
                
                    <div>
                        <label>Difficulty Level:</label>
                        <select value={difficultyLevel} onChange={(e) => setDifficultyLevel(e.target.value)}>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>


                <div>
                    <label>Question Type:</label>
                    <select value={questionType} onChange={handleQuestionTypeChange} required>
                        <option value="">Select Question Type</option>
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="true_false">True/False</option>
                    </select>
                </div>
                
                {/* Choices */}
                {questionType === 'multiple_choice' && (
                    <div>
                        <label>Choices:</label>
                        {choices.map((choice, index) => (
                            <div key={index}>
                                <input
                                    type="text"
                                    value={choice}
                                    onChange={(e) => handleChoiceChange(index, e.target.value)}
                                    required
                                />
                                {index > 1 && (
                                    <button type="button" onClick={() => handleRemoveChoice(index)}>
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={handleAddChoice}>Add Choice</button>
                    </div>
                )}
                {/* Correct Answers */}
                {questionType === 'multiple_choice' && (
                    <div>
                        <label>Correct Answers:</label>
                        {choices.map((choice, index) => (
                            <div key={index}>
                                <input
                                    type="checkbox"
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
                {/* True/False Options */}
                {questionType === 'true_false' && (
                    <div>
                        <label>
                            <input
                                type="radio"
                                name="trueFalseOption"
                                value="true"
                                checked={correctAnswers.includes('true')}
                                onChange={() => setCorrectAnswers(['true'])}
                            />
                            True
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="trueFalseOption"
                                value="false"
                                checked={correctAnswers.includes('false')}
                                onChange={() => setCorrectAnswers(['false'])}
                            />
                            False
                        </label>
                    </div>
                )}

                <button type="submit">Submit</button>
            </form>
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
};

export default AddQuestionForm;
