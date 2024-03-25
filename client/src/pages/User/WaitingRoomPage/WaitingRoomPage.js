import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './WaitingRoomPage.module.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const WaitingRoomPage = ({ userData }) => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removedStudentIds, setRemovedStudentIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let intervalId;

    const checkQuizStatus = async () => {
      try {
        const token = localStorage.getItem('ultimate_genius0510_token');
        const gameCode = localStorage.getItem('ug_game_id');

        const response = await axios.get(`http://localhost:8000/api/student/check-quiz-if-started/${gameCode}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.isStarted) {
          navigate(`/student/quiz/play/${localStorage.getItem('ug_game_id')}`);
        }
      } catch (error) {
        console.error('Error checking quiz status:', error);
      }
    };

    if (userData && userData.userType === 'student') {
      checkQuizStatus();
      intervalId = setInterval(checkQuizStatus, 3000);
    }

    return () => clearInterval(intervalId);
  }, [userData]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('ultimate_genius0510_token');
        const gameCode = localStorage.getItem('ug_game_id');
  
        const response = await axios.get(`http://localhost:8000/api/teacher/get-students/${gameCode}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setStudents((prevStudents) => {
          // Find removed students by comparing IDs
          const removedStudents = prevStudents.filter((prevStudent) => !response.data.students.some((newStudent) => newStudent._id === prevStudent._id));
          
          // Show toast for removed students
          removedStudents.forEach((student) => {
            if(student._id === userData._id)
            {
              toast.error('You have been removed from quiz');
              navigate('/');
            }
            else
            {
              toast.info(`${student.gameName} has been removed from the quiz`);
            }
          });
  
          return response.data.students; 
        });
  
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
  
    fetchStudents();
  
    const intervalId = setInterval(fetchStudents, 3000);
  
    return () => clearInterval(intervalId);
  }, []);
  

  const removeStudent = async (studentId, studentName) => {
    try {
      const token = localStorage.getItem('ultimate_genius0510_token');
      const gameCode = localStorage.getItem('ug_game_code');

      await axios.delete(`http://localhost:8000/api/teacher/remove-student/${gameCode}/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.error(`Removing ${(studentId === userData._id ? "You" : studentName)} from quiz`);

      setStudents((prevStudents) => prevStudents.filter((student) => student._id !== studentId));
    } catch (error) {
      console.error('Error removing student:', error);
    }
  };

  const startQuiz = async () => {
    try {
      const token = localStorage.getItem('ultimate_genius0510_token');
      const quizId = localStorage.getItem('ug_game_id');

      await axios.put(`http://localhost:8000/api/teacher/start-quiz/${quizId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate('/user/quiz/scoreboard');
    } catch (error) {
      console.error('Error starting quiz:', error);

      if (String(error.response.data.message).toLowerCase().includes('already started')) {
        navigate('/user/quiz/scoreboard');
      }
    }
  };

  return (
    <div className={styles.waitingRoom}>
      <h1>Quiz Game Waiting Room </h1>
      <h5>Game Code: <span style={{ color: '#f6561e' }}>{localStorage.getItem('ug_game_code')}</span></h5>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {userData && userData.userType === 'teacher' && <button className={styles.startButton} onClick={startQuiz}>Start Quiz</button>}
          <h3 className={styles.listHeading}>List of Students</h3>
          <ul className={styles.studentList}>
            {students.map((student) => (
              <li key={student._id} className={styles.studentItem}>
                <div className={styles.studentInfo}>
                  <span>
                    <img className={styles.avatar} src={student.avatar} alt="Avatar" />
                    <span>{student.gameName} {userData && student && student._id === userData._id ? '(You)' : ''}</span>
                  </span>
                  {userData && userData.userType === 'teacher' && <button className={styles.removeButton} onClick={() => removeStudent(student._id, student.gameName)}>Remove</button>}
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
