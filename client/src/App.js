import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage/Homepage';
import LoginPage from './pages/User/LoginPage';
import RegisterPage from './pages/User/RegisterPage';
import { checkIsLoggedIn } from './utils/authUtils';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        checkIsLoggedIn(setIsLoggedIn);
    }, []);

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        isLoggedIn ? (
                            <Homepage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                        ) : (
                            <Navigate to="/user/login" />
                        )
                    }
                />
                <Route
                    path="/user/login"
                    element={
                        isLoggedIn ? (
                            <Navigate to="/" />
                        ) : (
                            <LoginPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                        )
                    }
                />
                <Route path="/user/register" element={<RegisterPage />} />
            </Routes>
        </Router>
    );
};

export default App;
