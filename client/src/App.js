import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage/Homepage';
import LoginPage from './pages/User/Login/LoginForm';
import RegisterPage from './pages/User/Register';
import checkIsLoggedIn from './utils/checkIsLoggedIn';
import RegisterForm from './pages/User/Login/RegisterForm';
import ChooseGame from './pages/Teacher/ChooseGame/ChooseGame';
import QuizCustomizationForm from './pages/Teacher/QuizCustomizationForm/QuizCustomizationForm';
import TeacherWaitingRoomPage from './pages/Teacher/WaitingRoomPage/WaitingRoomPage';
import JoinQuizPage from './pages/Student/JoinQuizPage/JoinQuizPage';
import StudentWaitingRoomPage from './pages/Student/WaitingRoomPage/WaitingRoomPage';
import QuestionManagementPage from './pages/Teacher/QuestionManagementPage/QuestionManagementPage';
import AddQuestionForm from './pages/Teacher/AddQuestionForm/AddQuestionForm';
import QuizGame from './pages/Teacher/QuizGame/QuizGame';
import AddQuestionBankForm from './pages/Teacher/AddQuestionBankForm/AddQuestionBankForm';
import QuestionBankManagementPage from './pages/Teacher/QuestionBankManagementPage/QuestionBankManagementPage';
import QuizPlay from './pages/Student/QuizPlay/QuizPlay';
import ScoreboardPage from './pages/User/ScoreboardPage/ScoreboardPage';
import fetchUserData from './utils/fetchUserData';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [userData, setUserData] = useState(null);

    const addUserData = (data) => {
        setUserData(data);
    }

    const login = (LoggedIn = true) => {
        setIsLoggedIn(LoggedIn);
        if(LoggedIn == false)
        {
            localStorage.setItem('ultimate_genius0510_token',null);
        }
      };
      

    useEffect(() => {

        checkIsLoggedIn(login);
        fetchUserData(login,addUserData);      

        
    }, [isLoggedIn]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage isLoggedIn={isLoggedIn} login={login} userData={userData} addUserData={addUserData}/>}/>
                <Route path="/user/login" element={<LoginPage isLoggedIn={isLoggedIn} login={login} addUserData={addUserData}/>}/>
                <Route path="/user/register" element={<RegisterForm />}/>
                <Route path="/teacher/game-choice" element={<ChooseGame isLoggedIn={isLoggedIn} userData={userData}/>}/>
                <Route path="/teacher/quizgame" element={<QuizGame isLoggedIn={isLoggedIn} userData={userData}/>}/>
                <Route path="/teacher/quiz/create" element={<QuizCustomizationForm/>}/>
                <Route path="/teacher/quiz/waiting-room" element={<TeacherWaitingRoomPage/>}/>
                <Route path="/student/quiz/join" element={<JoinQuizPage/>} />
                <Route path="/student/quiz/waiting-room" element={<StudentWaitingRoomPage/>}/>
                <Route path="/teacher/question/manage" element={<QuestionManagementPage/>}/>
                <Route path="/teacher/question/add" element={<AddQuestionForm/>}/>
                <Route path="/teacher/question-banks/manage" element={<QuestionBankManagementPage/>}/>
                <Route path="/teacher/question-banks/add" element={<AddQuestionBankForm/>}/>
                <Route path="/student/quiz/play/:quizId" element={<QuizPlay/>}/>
                <Route path="/user/quiz/scoreboard" element={<ScoreboardPage/>}/>
            </Routes>
        </Router>
    );
};

export default App;
