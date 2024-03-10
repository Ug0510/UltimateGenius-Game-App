import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from './QuestionBankManagementPage.module.css';

const QuestionBankManagementPage = () => {
    const [questionBanks, setQuestionBanks] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuestionBanks();
    }, []);

    const fetchQuestionBanks = async () => {
        try {
            const token = localStorage.getItem('ultimate_genius0510_token');
            const response = await axios.get('http://localhost:8000/api/teacher/question-banks', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setQuestionBanks(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching question banks:', error);
            setError('Error fetching question banks');
        }
    };

    const handleCreateQuestionBank = async () => {
        navigate('/teacher/question-banks/add');
    };

    const handleDeleteQuestionBank = async (questionBankId) => {
        try {
            const token = localStorage.getItem('ultimate_genius0510_token');
            const response = await axios.delete(`http://localhost:8000/api/teacher/question-banks/${questionBankId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                console.log('Question bank deleted successfully');
                fetchQuestionBanks(); // Refresh question banks after deletion
            } else {
                console.error('Error deleting question bank:', response.data.error);
            }
        } catch (error) {
            console.error('Error deleting question bank:', error);
        }
    };

    return (
        <div>

            <h1 style={{ textAlign: 'center', margin: '1.5rem' }}>Question Bank Management</h1>

            <div className={styles.questionBankContainer}>
                <button onClick={handleCreateQuestionBank} className={styles.button}>Create a Question Bank</button>
                <ul>
                    {questionBanks && questionBanks.length > 0 ? (
                        questionBanks.map(questionBank => (
                            <li key={questionBank._id} className={styles.questionBankItem}>
                                <Link to={`/question-banks/${questionBank._id}`} className={styles.link}>{questionBank.name}</Link>
                                <span>
                                    <button className={styles.modifyButton}> Modify</button>
                                    <button onClick={() => handleDeleteQuestionBank(questionBank._id)} className={styles.deleteButton}>Delete</button>
                                </span>
                            </li>
                        ))
                    ) : (
                        <p>No Question Banks Exist.</p>
                    )}
                </ul>
                {error && <p className={styles.error}>Error: {error}</p>}
            </div>
        </div>
    );
};

export default QuestionBankManagementPage;
