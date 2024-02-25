import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage/Homepage';
import LoginPage from './pages/User/LoginForm';
import RegisterPage from './pages/User/Register';
import checkIsLoggedIn from './utils/checkIsLoggedIn';
import RegisterForm from './pages/User/RegisterForm';


const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    useEffect(() => {

        checkIsLoggedIn(setIsLoggedIn);
        
    }, [isLoggedIn]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}/>
                <Route path="/user/login" element={<LoginPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}/>
                <Route path="/user/register" element={<RegisterForm />} />
            </Routes>
        </Router>
    );
};

export default App;
