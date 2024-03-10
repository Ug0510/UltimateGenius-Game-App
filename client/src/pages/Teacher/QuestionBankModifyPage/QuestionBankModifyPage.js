import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import styles from './QuestionBankModifyPage.module.css'; // Import your CSS module

const QuestionBankModifyPage = () => {
    const questionBankId = useParams(); // Retrieve question bank ID from URL params
    const [questionBank, setQuestionBank] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuestionBankDetails();
    }, []);

    const fetchQuestionBankDetails = async () => {
        try {
            const token = localStorage.getItem('ultimate_genius0510_token');
            const response = await axios.get(`http://localhost:8000/api/teacher/get-question-bank/${questionBankId.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setQuestionBank(response.data);
        } catch (error) {
            console.error('Error fetching question bank details:', error);
            setError('Error fetching question bank details');
        }
    };

    const handleModifyQuestionBank = async () => {
        try {
            const token = localStorage.getItem('ultimate_genius0510_token');
            const response = await axios.put(`http://localhost:8000/api/teacher/question-banks/${questionBankId}`, questionBank, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Question bank modified successfully:', response.data);
            navigate('/question-banks'); // Redirect to question bank management page after modification
        } catch (error) {
            console.error('Error modifying question bank:', error);
            setError('Error modifying question bank. Please try again.');
        }
    };

    const handleDeleteQuestionBank = async () => {
        try {
            const token = localStorage.getItem('ultimate_genius0510_token');
            const response = await axios.delete(`http://localhost:8000/api/teacher/question-banks/${questionBankId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Question bank deleted successfully:', response.data);
            navigate('/question-banks'); // Redirect to question bank management page after deletion
        } catch (error) {
            console.error('Error deleting question bank:', error);
            setError('Error deleting question bank. Please try again.');
        }
    };

    // Handler to add questions to the question bank
    const handleAddQuestions = async () => {
        try {
            // Implement adding questions logic here
        } catch (error) {
            console.error('Error adding questions to question bank:', error);
            setError('Error adding questions to question bank');
        }
    };

    // Handler to remove questions from the question bank
    const handleRemoveQuestions = async () => {
        try {
            // Implement removing questions logic here
        } catch (error) {
            console.error('Error removing questions from question bank:', error);
            setError('Error removing questions from question bank');
        }
    };

    return (
        <div className={styles.questionBankModifyContainer}>
            {questionBank ? (
                <>
                    <h1>Modify Question Bank</h1>
                    {/* Render input fields with current question bank details for modification */}
                    <div>
                        <label>Question Bank Name:</label>
                        <input
                            type="text"
                            value={questionBank.name}
                            onChange={(e) => setQuestionBank({ ...questionBank, name: e.target.value })}
                        />
                    </div>
                    {/* Add more input fields for other details as needed */}
    
                    {/* Buttons for modification and deletion */}
                    <div>
                        <button onClick={handleModifyQuestionBank}>Modify</button>
                        <button onClick={handleDeleteQuestionBank}>Delete</button>
                    </div>
    
                    {/* Additional features */}
                    <div>
                        {/* Add questions to the question bank */}
                        <button onClick={handleAddQuestions}>Add Questions</button>
                        {/* Remove questions from the question bank */}
                        <button onClick={handleRemoveQuestions}>Remove Questions</button>
                        {/* Other extra features */}
                    </div>
    
                    {/* List of questions in the question bank */}
                    <div>
                        <h2>List of Questions in Question Bank</h2>
                        <ul>
                            {questionBank.questions.map(question => (
                                <li key={question._id}>{question.content}</li>
                            ))}
                        </ul>
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
            {error && <p className={styles.error}>Error: {error}</p>}
        </div>
    );
    
};    

export default QuestionBankModifyPage;
