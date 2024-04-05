import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import styles from './QuestionBankManagementPage.module.css';
import { toast } from 'react-toastify';

const QuestionBankManagementPage = () => {
    const [questionBanks, setQuestionBanks] = useState([]);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [selectedQB , setSelectedQB] = useState(null);

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
            toast.error('Error fetching question banks');
        }
    };

    const handleCreateQuestionBank = async () => {
        navigate('/teacher/question-banks/add');
    };

    const handleDeleteQuestionBank = async () => {
        try {
            const questionBankId = selectedQB;
            const token = localStorage.getItem('ultimate_genius0510_token');
            const response = await axios.delete(`http://localhost:8000/api/teacher/question-banks/${questionBankId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                fetchQuestionBanks();
                setShowPopup(false);
                toast.success('Question Bank deleted Successfully')
            } else {
                toast.error('Error deleting question bank');
                console.error('Error deleting question bank',response.error);
            }
        } catch (error) {
            console.error('Error deleting question bank',error);
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
                <div className={styles.flexBox}>
                <button onClick={() => {navigate('/user/generate-qb') }} className={styles.button + " me-3"}>Create QB using Ai</button>
                <button onClick={handleCreateQuestionBank} className={styles.button}>Create a Question Bank</button>
                </div>
            </div>

            <div className={styles.questionBankContainer}>
                <ul>
                    {filteredQuestionBanks.length > 0 ? (
                        filteredQuestionBanks.map(questionBank => (
                            <li key={questionBank._id} className={styles.questionBankItem}>
                                {questionBank.name}
                                <span>
                                    <Link to={`/teacher/question-banks/${questionBank._id}`} className={styles.link}><button className={styles.modifyButton}> Modify</button></Link>
                                    <button onClick={() => {setSelectedQB(questionBank._id); setShowPopup(true)}} className={styles.deleteButton}>Delete</button>
                                </span>
                            </li>
                        ))
                    ) : (
                        <p>No Question Banks Exist.</p>
                    )}
                </ul>
            </div>
            {/* Confirmation Window */}
            <div className={`${styles.confirmationWindow} ${showPopup ? styles.active : ''}`}>
                <p>Are you sure you want to delete?</p>
                <div className={styles.flexBox}>
                    <button onClick={handleDeleteQuestionBank} className={styles.removeButton}>Delete</button>
                    <button onClick={() => setShowPopup(false)} className={styles.mButton}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default QuestionBankManagementPage;
