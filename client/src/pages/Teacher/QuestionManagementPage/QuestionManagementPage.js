import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './QuestionManagementPage.module.css';
import { useNavigate } from 'react-router-dom';

const QuestionManagementPage = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [isSelectMultipleClicked, setIsSelectMultipleClicked] = useState(false);
  const navigate = useNavigate();

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem('ultimate_genius0510_token');
      const response = await axios.get('http://localhost:8000/api/teacher/get-questions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuestions(response.data); //response data is an array of questions
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

  const handleSelectMultiple = () => {
    setIsSelectMultipleClicked(!isSelectMultipleClicked);
    if(isSelectMultipleClicked === true)
    {
      handleCancelSelection();
    }
  }

  useEffect(() => {
    // Fetch questions when the component mounts
    fetchQuestions();
  }, []);

  return (
    <>
      <h1 style={{textAlign:'center', margin:'1.5rem'}}>Question Management Page</h1>
      <div className={styles.optionsBox}>
        <button onClick={handleAddQuestion} className={styles.mButton}>Add Question</button>
        <button onClick={handleSelectMultiple} className={styles.mButton}>
          {isSelectMultipleClicked ? 'Cancel Selection' : 'Select Multiple'}
        </button>
        {selectedQuestions.length > 0 && (
          <>
            <button onClick={handleDeleteMultiple} className={styles.mButton}>Delete Multiple</button>
            <button onClick={handleCreateQuestionBank} className={styles.mButton}>Create Question Bank using Selected</button>
          </>
        )}
      </div>
      <div className={styles.container}>
        {/* List of existing questions */}
        <ul className={styles.questionList}>
          {questions && questions.length > 0 ? (
            questions.map((question, index) => (
              <li key={question._id} className={styles.questionItem} style={{color:'black'}}>
                {isSelectMultipleClicked && (
                  <input
                    type="checkbox"
                    checked={selectedQuestions.includes(question._id)}
                    onChange={() => toggleQuestionSelection(question._id)}
                  />
                )}
                {question.content}
              </li>
            ))
          ) : (
            <p style={{color:'black'}}>No Questions are available to show. <br/> Click above button to add new questions...</p>
          )}
        </ul>
      </div>
    </>
  );
};

export default QuestionManagementPage;
