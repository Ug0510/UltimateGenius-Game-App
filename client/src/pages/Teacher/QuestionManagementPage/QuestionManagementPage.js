import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './QuestionManagementPage.module.css';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

const QuestionManagementPage = () => {
  const [questions, setQuestions] = useState([]);
  const [fetchedQuestions, setFetchedQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [isSelectMultipleClicked, setIsSelectMultipleClicked] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isSelectAllClicked, setIsSelectAllClicked] = useState(false);
  const navigate = useNavigate();

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem('ultimate_genius0510_token');
      const response = await axios.get('http://localhost:8000/api/teacher/get-questions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFetchedQuestions(response.data);
      setQuestions(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  // Function to handle adding a new question
  const handleAddQuestion = async () => {
    navigate('/teacher/question/add');
  };

  // Function to toggle selection of a question
  const toggleQuestionSelection = (questionId) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter((id) => id !== questionId));
    } else {
      setSelectedQuestions([...selectedQuestions, questionId]);
    }
  };

  // Function to handle deleting multiple questions
  const handleDeleteMultiple = () => {
    // Implement logic to delete multiple questions based on selectedQuestions array
    console.log('Deleting multiple questions:', selectedQuestions);
  };

  // Function to handle creating a question bank using selected questions
  const handleCreateQuestionBank = () => {
    // Implement logic to create question bank using selectedQuestions array
    console.log('Creating question bank using selected questions:', selectedQuestions);
  };

  // Function to handle canceling selection
  const handleCancelSelection = () => {
    setSelectedQuestions([]); // Clear selectedQuestions array
    setIsSelectMultipleClicked(false); // Reset select multiple state
  };

  //Function to Select all the checkbox
  const handleSelectAll = () => {

    if (!isSelectAllClicked) {
      const allQuestionIds = questions.map((question) => question._id);
      setSelectedQuestions(allQuestionIds);
    }
    else {
      setSelectedQuestions([]);
    }

    setIsSelectAllClicked(!isSelectAllClicked);
  }
  // Function to handle search
  const handleSearch = (event) => {
    const searchText = event.target.value.toLowerCase();
    setSearchText(searchText);

    // Filter fetchedQuestions based on the search text
    const filteredQuestions = fetchedQuestions.filter((question) =>
      question.content.toLowerCase().includes(searchText)
    );

    // Update the questions state with the filtered results
    setQuestions(filteredQuestions);

    // Update selectedQuestions if isSelectAllClicked is true
    if (isSelectAllClicked) {
      const filteredQuestionIds = filteredQuestions.map((question) => question._id);
      setSelectedQuestions(filteredQuestionIds);
    }


  };


  useEffect(() => {
    // Fetch questions when the component mounts
    fetchQuestions();
  }, []);

  return (
    <>
      <h1 style={{ textAlign: 'center', margin: '1.5rem' }}>Question Management Page</h1>
      <div className={styles.optionsBox}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search Questions"
            value={searchText}
            onChange={handleSearch}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}><FaSearch /></span>
          {searchText && (
            <button className={styles.clearButton} onClick={() => { setSearchText(''); setQuestions(fetchQuestions); }}>
              &#x2715;
            </button>
          )}
        </div>
        <div>
          <button onClick={handleAddQuestion} className={styles.mButton}>Add Question</button>
          <button onClick={() => {
            setIsSelectMultipleClicked(!isSelectMultipleClicked);
            if (isSelectMultipleClicked) {
              handleCancelSelection();
            }
          }} className={styles.mButton}>
            {isSelectMultipleClicked ? 'Cancel Selection' : 'Select Multiple'}
          </button>
        </div>
      </div>
      <div className={styles.optionsBox + " " + styles.justifyCenter} >
        {isSelectMultipleClicked && (
          <>
            <button onClick={handleDeleteMultiple} className={styles.mButton}>Delete Multiple</button>
            <button onClick={handleCreateQuestionBank} className={styles.mButton}>Create Question Bank using Selected</button>
            <button onClick={handleSelectAll} className={styles.mButton}>{
              isSelectAllClicked ? 'UnSelect All' : 'Select All'
            }</button>
          </>
        )}
      </div>


      <div className={styles.questionsContainer}>
        {/* List of existing questions */}
        <ul className={styles.questionList}>
          {questions && questions.length > 0 ? (
            questions
              .map((question) => (
                <li key={question._id} className={styles.questionItem} style={{ color: 'black' }}>
                  <div>{isSelectMultipleClicked && (
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(question._id)}
                      onChange={() => toggleQuestionSelection(question._id)}
                      className={styles.listCheckbox}
                    />
                  )}
                    <span className={styles.questionContent}>{question.content}</span></div>
                  <span>
                    <FaEdit className={styles.iconButton} style={{ fontSize: '1.2rem', marginRight: '10px' }} />
                    <MdDeleteForever className={styles.iconButton} />
                  </span>
                </li>
              ))
          ) : (
            <p style={{ color: 'black' }}>No Questions are available to show. <br /> Click above button to add new questions...</p>
          )}
        </ul>
      </div>
    </>
  );
};

export default QuestionManagementPage;
