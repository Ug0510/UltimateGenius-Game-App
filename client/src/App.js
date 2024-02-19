import React from 'react';
import LoginPage from './pages/User/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from './pages/User/Homepage';

const App = () => {
    return (
        <Router>
            <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/User/Login" element={<LoginPage/>} />
            </Routes>
        </Router>
            );
}

export default App;
