import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './QuestionManagementPage.module.css';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { toast } from 'react-toastify';

const QuestionManagementPage = () => {
  const [questions, setQuestions] = useState([]);
  const [fetchedQuestions, setFetchedQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [isSelectMultipleClicked, setIsSelectMultipleClicked] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isSelectAllClicked, setIsSelectAllClicked] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showQBForm , setShowQBForm] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [questionBankName, setQuestionBankName] = useState('');
  const [questionBankDescription, setQuestionBankDescription] = useState('');

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

      // Extract categories from questions and remove duplicates
      const allCategories = response.data.reduce((acc, cur) => {
        if (cur.category && !acc.includes(cur.category)) {
          return [...acc, cur.category];
        }
        return acc;
      }, []);
      setCategories(allCategories);
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

  const handleDeleteMultiple = async () => {

    if(selectedQuestions.length === 0)
      {
        toast.error('No Question is selected');
        setShowPopup(false);
        return;
      }
    try {
      // Make a POST request to delete questions
      const token = localStorage.getItem('ultimate_genius0510_token');
      const response = await axios.post(
        'http://localhost:8000/api/teacher/delete-questions',
        { questionIds: selectedQuestions },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the deletion was successful
      if (response.status === 200) {
        console.log(response.data.message);
        setShowPopup(false);
        setSelectedQuestions([]);
        toast.success('Deleted Successfully');
        fetchQuestions();
      } else {
        console.error('Error deleting multiple questions:', response.data.error);
      }
    } catch (error) {
      console.error('Error deleting multiple questions:', error);
    }
  };

  const handleQuestionBankNameChange = (event) => {
    setQuestionBankName(event.target.value);
  };

  const handleQuestionBankDescriptionChange = (event) => {
    setQuestionBankDescription(event.target.value);
  };

  // Function to handle creating a question bank using selected questions
  const handleCreateQuestionBank = () => {
    if(selectedQuestions.length === 0)
    {
      toast.error('No question selected');
      return;
    }
    setShowQBForm(true);
  };

  const handleCreateQuestionBankConfirm = async () => {
    try {
      // Send API call to create Question Bank
      const token = localStorage.getItem('ultimate_genius0510_token');
      const response = await axios.post(
        'http://localhost:8000/api/teacher/create-qb',
        {
          name: questionBankName,
          description: questionBankDescription,
          questions: selectedQuestions
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle response
      console.log('Question Bank created successfully:', response.data);

      // Close the popup and clear selected questions
      handleClosePopup();
      setSelectedQuestions([]);
      toast.success('Question Bank Created Successfully!');
    } catch (error) {
      console.error('Error creating Question Bank:', error);
    }
  };

  const handleClosePopup = () => {
    // Reset the input fields and hide the popup
    setQuestionBankName('');
    setQuestionBankDescription('');
    setShowQBForm(false);
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
    } else {
      setSelectedQuestions([]);
    }

    setIsSelectAllClicked(!isSelectAllClicked);
  };

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

  // Function to handle filtering by category
  const handleFilterByCategory = (category) => {
    setSelectedCategory(category);

    if (category === '') {
      setQuestions(fetchQuestions);
    } else {
      setSelectedCategory(category);
      const filteredQuestions = fetchedQuestions.filter((question) =>
        question.category === category
      );
      setQuestions(filteredQuestions);
      // Update selectedQuestions if isSelectAllClicked is true
      if (isSelectAllClicked) {
        const filteredQuestionIds = filteredQuestions.map((question) => question._id);
        setSelectedQuestions(filteredQuestionIds);
      }
    }
  };

  // Function to handle sorting
  const handleSortBy = (sortBy) => {
    setSortBy(sortBy);
    let sortedQuestions = [...questions];
    if (sortBy === 'newestFirst') {
      sortedQuestions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldestFirst') {
      sortedQuestions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    setQuestions(sortedQuestions);
  };

  useEffect(() => {
    // Fetch questions when the component mounts
    fetchQuestions();
  }, []); 

  return (
    <>
      <h1 style={{ textAlign: 'center', margin: '1.5rem' }}>Question Management Page</h1>
      <div className={styles.optionsBox}>
        <div className={styles.flexBox}>
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
          {/* Filter by Category */}
          <div className={styles.filterBox}>
            <span>Filter by Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => handleFilterByCategory(e.target.value)}
              className={styles.categoryFilter}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          {/* Sort By */}
          <div className={styles.filterBox}>
            <span>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSortBy(e.target.value)}
              className={styles.categoryFilter}
            >
              <option value="oldestFirst">Default(Oldest First)</option>
              <option value="newestFirst">Newest First</option>
            </select>
          </div>
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
            <button onClick={() => setShowPopup(true)} className={styles.mButton}>Delete Multiple</button>
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
                <>
                <li key={question._id} className={styles.questionItem} style={{ color: 'black' }} onClick={() => toggleQuestionSelection(question._id)}>
                  <div>{isSelectMultipleClicked && (
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(question._id)}
                      onChange={() => toggleQuestionSelection(question._id)}
                      className={styles.listCheckbox}
                    />
                  )}
                    <span className={styles.questionContent}>{question.content}</span></div>
                  <span style={{textWrap:'nowrap', marginLeft:'2rem'}}>
                    <FaEdit className={styles.iconButton} style={{ fontSize: '1.2rem', marginRight: '10px' }} onClick={() => {navigate(`/teacher/question/modify/${question._id}`)}}/>
                    <MdDeleteForever className={styles.iconButton} onClick={() => { setSelectedQuestions([`${question._id}`]); setShowPopup(true); }} />
                  </span>
                  
                </li>
                {/* <hr style={{color:'red', border:'1px solid red', margin:'0'}}/> */}
                </>
              ))
          ) : (
            <p style={{ color: 'white' }}>No Questions are available to show. <br /> Click above button to add new questions...</p>
          )}
        </ul>
      </div>

      {/* Confirmation Window */}
      <div className={`${styles.confirmationWindow} ${showPopup ? styles.active : ''}`}>
        <p>Are you sure you want to delete?</p>
        <div className={styles.flexBox} >
          <button onClick={handleDeleteMultiple} className={styles.removeButton}>Delete</button>
          <button onClick={() => setShowPopup(false)} className={styles.mButton}>Cancel</button>
        </div>
      </div>

      {/* Question Bank Creation Popup Window  */}
      <div className={`${styles.confirmationWindow} ${showQBForm ? styles.active : ''}`}>
        <p>Enter Question Bank Details:</p>
        <input
          type="text"
          placeholder="Question Bank Name"
          value={questionBankName}
          onChange={handleQuestionBankNameChange}
          className={styles.inputField} 
          required
        />
        <textarea
          placeholder="Question Bank Description"
          value={questionBankDescription}
          onChange={handleQuestionBankDescriptionChange}
          className={styles.inputField} // Apply inputField class for styling
        ></textarea>
        <div className={styles.flexBox}>
          <button onClick={handleClosePopup} className={styles.removeButton}>Cancel</button> {/* Apply removeButton class for styling */}
          <button onClick={handleCreateQuestionBankConfirm} className={styles.mButton}>Create</button> {/* Apply mButton class for styling */}
        </div>
      </div>


    </>
  );
};

export default QuestionManagementPage;
