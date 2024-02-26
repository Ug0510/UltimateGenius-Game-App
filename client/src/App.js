import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage/Homepage';
import LoginPage from './pages/User/LoginForm';
import RegisterPage from './pages/User/Register';
import checkIsLoggedIn from './utils/checkIsLoggedIn';
import RegisterForm from './pages/User/RegisterForm';


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

        

        
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage isLoggedIn={isLoggedIn} login={login} userData={userData} addUserData={addUserData}/>}/>
                <Route path="/user/login" element={<LoginPage isLoggedIn={isLoggedIn} login={login} addUserData={addUserData}/>}/>
                <Route path="/user/register" element={<RegisterForm />} />
            </Routes>
        </Router>
    );
};

export default App;
