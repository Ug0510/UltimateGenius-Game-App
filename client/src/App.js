import React from 'react';
import LoginPage from './pages/User/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from './pages/Homepage/Homepage';
import RegisterPage from './pages/User/Register';

const App = () => {
    return (
        <Router>
            <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/user/login" element={<LoginPage/>} />
            <Route path="/user/register" element={<RegisterPage/>} />
            </Routes>
        </Router>
            );
}

export default App;
