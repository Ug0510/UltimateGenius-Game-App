import React, { useState } from 'react';
import styles from './AddQuestionForm.module.css';

const AddQuestionForm = () => {
    const [questionText, setQuestionText] = useState('');
    const [questionType, setQuestionType] = useState('');
    const [choices, setChoices] = useState(['']);
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [error, setError] = useState('');

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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add validation checks here

        // Submit the question data to the server
        const questionData = {
            questionText,
            questionType,
            choices,
            correctAnswers,
        };
        console.log(questionData);
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
                <div>
                    <label>Question Type:</label>
                    <select value={questionType} onChange={handleQuestionTypeChange} required>
                        <option value="">Select Question Type</option>
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="true_false">True/False</option>
                    </select>
                </div>
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
