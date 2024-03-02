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

    return (
        <div className={styles.container}>
            <h1>Add Question Bank</h1>
            <button onClick={handleCreateQuestionBank} className={styles.button}>Create a Question Bank</button>
            <ul>
                {questionBanks && questionBanks.length > 0? (questionBanks.map(questionBank => (
                    <li key={questionBank._id}>
                        <Link to={`/question-banks/${questionBank._id}`} className={styles.link}>{questionBank.name}</Link>
                    </li>
                ))): <p>No QuestionBank Exists..</p>}
            </ul>
            {error && <p className={styles.error}>Error: {error}</p>}
        </div>
    );
};

export default QuestionBankManagementPage;