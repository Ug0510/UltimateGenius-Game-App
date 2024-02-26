// WaitingRoomPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './WaitingRoomPage.module.css';

const TeacherWaitingRoomPage = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

      // Redirect or perform any action after starting the quiz
    } catch (error) {
      console.error('Error starting quiz:', error);
    }
  };

  return (
    <div className={styles.waitingRoom}>
      <h2>Waiting Room {localStorage.getItem('ug_game_code')}</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h3>List of Students {localStorage.getItem('ug_game_code')}</h3>
          <ul className={styles.studentList}>
            {students.map((student) => (
              <li key={student._id} className={styles.studentItem}>
                <div className={styles.studentInfo}>
                  <span>{student.gameName}</span>
                  <img className={styles.avatar} src={student.avatar} alt="Avatar" />
                </div>
                <button className={styles.removeButton} onClick={() => removeStudent(student._id)}>Remove</button>
              </li>
            ))}
          </ul>
          <button className={styles.startButton} onClick={startQuiz}>Start Quiz</button>
        </>
      )}
    </div>
  );
};

export default TeacherWaitingRoomPage;
