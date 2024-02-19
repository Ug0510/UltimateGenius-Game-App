import React from 'react';
import Header from './components/Header/Header';
import LoginPage from './pages/User/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
    return (
        <Router>
            <Routes>
            <Route path="/" element={<Header />} />
            <Route path="/User/Login" element={<LoginPage/>} />
            </Routes>
        </Router>
            );
}

export default App;
