import React from 'react';
import LoginPage from './pages/User/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from './pages/User/Homepage';
import RegisterPage from './pages/User/Register';
import './assets/css/style.css'

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
