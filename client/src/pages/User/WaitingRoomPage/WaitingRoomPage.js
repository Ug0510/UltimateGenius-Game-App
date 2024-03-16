// WaitingRoomPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './WaitingRoomPage.module.css';
import { useNavigate } from 'react-router-dom';

const WaitingRoomPage = ({userData}) => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    let intervalId; 

    const checkQuizStatus = async () => {
        try {
            // Fetch quiz status from the server
            const token = localStorage.getItem('ultimate_genius0510_token');
            const gameCode = localStorage.getItem('ug_game_id');

            const response = await axios.get(`http://localhost:8000/api/student/check-quiz-if-started/${gameCode}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Check if quiz is started
            if (response.data.isStarted) {
                // Redirect to quiz play page
                navigate(`/student/quiz/play/${localStorage.getItem('ug_game_id')}`); 
            }
        } catch (error) {
            console.error('Error checking quiz status:', error);
        }
    };

    if (userData && userData.userType === 'student') {
        checkQuizStatus(); 
        intervalId = setInterval(checkQuizStatus, 5000); // Set up interval to check every 5 seconds
    }

    return () => clearInterval(intervalId); // Clear the interval when the component unmounts
}, [userData]);



  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('ultimate_genius0510_token');
        console.log(token);
        const gameCode = localStorage.getItem('ug_game_id');
        console.log(gameCode);
  
        const response = await axios.get(`http://localhost:8000/api/teacher/get-students/${gameCode}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setStudents(response.data.students);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
  
    // Execute fetchStudents initially
    fetchStudents();
  
    // Execute fetchStudents every 5 seconds
    const intervalId = setInterval(fetchStudents, 5000);
  
    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures the effect runs only once after the initial render
  

  const removeStudent = async (studentId) => {
    try {
      const token = localStorage.getItem('ultimate_genius0510_token');
      console.log(token);
      const gameCode = localStorage.getItem('ug_game_code');

      await axios.delete(`http://localhost:8000/api/teacher/remove-student/${gameCode}/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update students list after removing the student
      setStudents((prevStudents) => prevStudents.filter((student) => student._id !== studentId));
    } catch (error) {
      console.error('Error removing student:', error);
    }
  };

  const startQuiz = async () => {
    try {
      const token = localStorage.getItem('ultimate_genius0510_token');
      const quizId = localStorage.getItem('ug_game_id');

      await axios.put(`http://localhost:8000/api/teacher/start-quiz/${quizId}`,null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate('/user/quiz/scoreboard');
    } catch (error) {
      console.error('Error starting quiz:', error);


      // if already started redirect to scoreboard
      if(String(error.response.data.message).toLowerCase().includes('already started'))
      {
        navigate('/user/quiz/scoreboard');
      }
    }
  };

  return (
    <div className={styles.waitingRoom}>
      <h1>Quiz Game Waiting Room </h1>
      <h5>Game Code: <span style={{color:'#f6561e'}}>{localStorage.getItem('ug_game_code')}</span></h5>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
         {userData && (userData.userType === 'teacher')?<button className={styles.startButton} onClick={startQuiz}>Start Quiz</button>:<></>}
          <h3 className={styles.listHeading}>List of Students</h3>
          <ul className={styles.studentList}>
            
            {students.map((student) => (
              <li key={student._id} className={styles.studentItem}>
                <div className={styles.studentInfo}>
                  <span>
                  <img className={styles.avatar} src='/assets/img/avatar1.png' alt="Avatar" />
                  <span>{student.gameName}</span>
                  </span>
                  {
                    userData && (userData.userType === 'teacher')? <button className={styles.removeButton} onClick={() => removeStudent(student._id)}>Remove</button>:<></>
                  }
                </div>
               
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default WaitingRoomPage;
