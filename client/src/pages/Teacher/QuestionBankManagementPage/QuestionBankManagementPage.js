import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa'; // Import icons
import styles from './QuestionBankManagementPage.module.css';

const QuestionBankManagementPage = () => {
    const [questionBanks, setQuestionBanks] = useState([]);
    const [error, setError] = useState('');
    const [searchText, setSearchText] = useState('');
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
                fetchQuestionBanks(); // Refresh question banks after deletion
            } else {
                console.error('Error deleting question bank:', response.data.error);
            }
        } catch (error) {
            console.error('Error deleting question bank:', error);
        }
    };

    // Function to handle search input change
    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    // Clear search text
    const clearSearchText = () => {
        setSearchText('');
    };

    // Filter question banks based on search text
    const filteredQuestionBanks = questionBanks.filter((questionBank) =>
        questionBank.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div>
            <h1 style={{ textAlign: 'center', margin: '1.5rem' }}>Question Bank Management</h1>

            <div className={styles.optionsBox}>
                {/* Search input with search icon */}
                <div style={{ position: 'relative' }} className={styles.searchBox}>
                    <input
                        type="text"
                        placeholder="Search Question Banks"
                        value={searchText}
                        onChange={handleSearchChange}
                        className={styles.searchInput}
                    />
                    <FaSearch className={styles.searchIcon} />
                    {searchText && <FaTimes className={styles.clearButton} onClick={clearSearchText} />}
                </div>

                <button onClick={handleCreateQuestionBank} className={styles.button}>Create a Question Bank</button>
            </div>

            <div className={styles.questionBankContainer}>
                <ul>
                    {filteredQuestionBanks.length > 0 ? (
                        filteredQuestionBanks.map(questionBank => (
                            <li key={questionBank._id} className={styles.questionBankItem}>
                                <Link to={`/teacher/question-banks/${questionBank._id}`} className={styles.link}>{questionBank.name}</Link>
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
