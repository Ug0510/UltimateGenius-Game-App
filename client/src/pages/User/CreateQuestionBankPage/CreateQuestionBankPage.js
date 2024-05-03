import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './CreateQuestionBankPage.module.css';
import { useNavigate, Link } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { toast } from 'react-toastify';
import logo from '../../../assets/images/logo/logo.png';
import { GoHomeFill } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import LoadingText from '../../../components/LoadingText/LoadingText';
import loader from '../../../assets/loader.gif';

const CreateQuestionBankPage = () => {
    const [questionQuery, setQuestionQuery] = useState({
        course: '',
        numberOfQuestions: null,
        code: 0,
        specialInstruction: ''
    });
    const [selectedDifficulty, setSelectedDifficulty] = useState('Mix');
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedQuestionId, setselectedQuestionId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showQBForm, setShowQBForm] = useState(false);
    const [questionBankName, setQuestionBankName] = useState('');
    const [questionBankDescription, setQuestionBankDescription] = useState('');



    useEffect(() => {
        let codee = 0;

        if(selectedDifficulty === 'Easy')
            codee = 1;
        else if(selectedDifficulty === 'Medium')
            codee = 2;
        else if(selectedDifficulty === 'Hard')
            codee = 3;

        setQuestionQuery({
            ...questionQuery,
            code:codee
        })
    }, [selectedDifficulty]);


    

    const navigate = useNavigate();

    const handleCourseChange = (e) => {
        setQuestionQuery({
            ...questionQuery,
            course: e.target.value
        });
    }
    const handleQuestionNumberChange = (e) => {
        setQuestionQuery({
            ...questionQuery,
            numberOfQuestions: e.target.value
        });
    }

    const handleInstructionChange = (e) => {
        setQuestionQuery({
            ...questionQuery,
            specialInstruction: e.target.value
        });
    }

    // Function to handle generating questions using AI
  const handleGenerateQuestions = async () => {
    // Call the API to generate questions using AI
    try {
        console.log('here');
        const subject = questionQuery.course;
        if (subject.trim().length === 0) {
            toast.warning('Subject should not be empty.');
            return;
          }
          
          if (subject.trim().length > 40) {
            toast.warning('Subject should be less than or equal to 40 characters long.');
            return;
          }
          
          if (/[^a-zA-Z0-9\s]/.test(subject)) {
            toast.warning('Subject should contain only letters, numbers, and spaces.');
            return;
          }

          if(questionQuery.numberOfQuestions < 1 && questionQuery > 50)
            {
                toast.warning('Number of Questions can only be in range from 1 to 50');
                return;
            }
          
            setIsGenerating(true);
      const token = localStorage.getItem('ultimate_genius0510_token');
      const response = await axios.post(
        'http://localhost:8000/api/user/generate-questions',
        questionQuery,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle response
      console.log('Generated questions:', response.data);
      setIsGenerating(false);
      setQuestions(response.data);


    } catch (error) {
      console.error('Error generating questions:', error);
    }
  };


    const handleQuestionBankNameChange = (event) => {
        setQuestionBankName(event.target.value);
    };

    const handleQuestionBankDescriptionChange = (event) => {
        setQuestionBankDescription(event.target.value);
    };

    const handleCreateQuestionBankConfirm = async () => {
        try {

            // Validation checks
        if (questionBankName.trim() === '') {
            toast.error('Please enter a valid question bank name.');
            return;
        }

        if(questionBankName.length > 40){
            toast.error('Question Bank Name is too long.');
            return;
        }

        if (questions.length === 0) {
            toast.error('Please add at least one question to the question bank.');
            return;
        }

        const questionIds = questions.map((question) => question._id);
        console.log(questionIds);
            // Send API call to create Question Bank
            const token = localStorage.getItem('ultimate_genius0510_token');
            const response = await axios.post(
                'http://localhost:8000/api/teacher/create-qb',
                {
                    name: questionBankName,
                    description: questionBankDescription,
                    questions: questionIds
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
            setQuestions([]);
            toast.success('Question Bank Created Successfully!');
            navigate('/teacher/quizgame/1');
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

    const handleDelete = (id) => {

        setselectedQuestionId(id);
        setShowPopup(true);
    }

    const deleteQuestion = () =>{
        setQuestions( prevQuestions => (
            prevQuestions.filter((question) => question._id != selectedQuestionId )
        ))
        setShowPopup(false);
        toast.success("Question Deleted Successfully!");
    }

    return (
        <>
        <nav className={styles.navbar}>
                <div className={styles.logoContainer}>
                    <img src={logo} alt='Logo' className={styles.logo} />
                </div>
            </nav>
            <div className={styles.backBtn}>
                <Link to="/"><GoHomeFill className={styles.navIcon + ' ' + styles.Hover} /></Link>
                <GoChevronRight className={styles.navIcon} />
                <Link to="/teacher/quizgame/1"><div className={styles.navIcon + " " + styles.text + ' ' + styles.Hover}>Quiz Game</div></Link>
                <GoChevronRight className={styles.navIcon} />
                <div className={styles.navIcon + " " + styles.text}>Create Question Bank</div>
                <div className={styles.blackOverlay}></div>
                <div className={styles.blackOverlay}></div>
            </div>
            <h1 style={{ textAlign: 'center', margin: '3rem' }}>Create Question Bank using Ai</h1>
            <div className={styles.optionsBox }>
                    <div className={styles.inputBox}>
                        <span>Enter Subject/Category</span>
                        <input
                            type="text"
                            placeholder="eg: JS, History, DSA,etc"
                            value={questionQuery.course}
                            onChange={handleCourseChange}
                            className={styles.searchInput}
                        />
                        <i></i>
                    </div>
                    <div className={styles.inputBox + " ms-5"}>
                        <span>Enter number of questions:</span>
                        <input
                            type="number"
                            placeholder="Max 50 allowed"
                            value={questionQuery.numberOfQuestions}
                            onChange={handleQuestionNumberChange}
                            className={styles.searchInput}
                        />
                    </div>
                    {/* Filter by Category */}

                    <div className={styles.inputBox}>
                        <span>Select Difficulty Level:</span>
                        <select
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                            className={styles.searchInput}
                        >
                            <option value="Mix">Mix</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
            </div>
            <div className={styles.optionsBox + " mt-3"} >
            <div className={styles.inputBox + " " + styles.instructions}>
                        <span>Enter anyf special instructions:</span>
                        <input
                            type="text"
                            placeholder="eg. only write questions of this <any-chapter> chapter || only write GATE Exam questions "
                            value={questionQuery.specialInstruction}
                            onChange={handleInstructionChange}
                            className={styles.searchInput}
                        />
                    </div>
                    <button  className={styles.mButton} onClick={handleGenerateQuestions}>Generate Questions</button>
            </div>
            <div className={styles.flexBox + " my-4 mb-5"}>
                <button  className={styles.mButton + " "+ styles.second} onClick={() => setShowQBForm(true)}>Create Question Bank</button>
            </div>


            <div className={styles.questionsContainer}>
                {/* List of existing questions */}
                {
                    isGenerating ? 
                    <div>
                    <img src={loader} style={{mixBlendMode:"difference", margin:"auto", display:'block'}} />
                    <div className={styles.flexBox} style={{marginTop:'-2.2rem'}}> Generating..... </div>
                    </div>
                    :
                    <ul className={styles.questionList}>
              {questions && questions.length > 0 ? (
    questions.map((question) => (
        <li key={question._id} className={styles.questionItem} style={{ color: 'black' }}>
            <div>
                <span className={styles.questionContent}>{question.content}</span>
                <hr/>
                <ul className={styles.optionsList}>
                    {question.options.map((option, index) => (
                        <li key={index} className={styles.optionItem}>
                            <input
                                type="radio"
                                id={`option-${index}`}
                                className={styles.listCheckbox}
                                checked={question.correctAnswers.includes(option)} // Check if option is correct
                                readOnly
                            />
                            <label htmlFor={`option-${index}`}>{option}</label>
                        </li>
                    ))}
                </ul>
            </div>
            <span>
                <FaEdit className={styles.iconButton} style={{ fontSize: '1.2rem', marginRight: '10px' }} target='_blank' onClick={() => { navigate(`/teacher/question/modify/${question._id}`) }} />
                <MdDeleteForever className={styles.iconButton} onClick={() => handleDelete(question._id)} />
            </span>
        </li>
    ))
) : (
    <p style={{ color: 'white' }}>No Questions are available to show. <br /> Fill above fields and click Generate button to create new questions...</p>
)}
      
                </ul>
                }
            </div>

            

            

            {/* Confirmation Window */}
            <div className={`${styles.confirmationWindow} ${showPopup ? styles.active : ''}`}>
                <p>Are you sure you want to delete?</p>
                <div className={styles.flexBox}>
                    <button onClick={deleteQuestion} className={styles.removeButton}>Delete</button>
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

export default CreateQuestionBankPage;
