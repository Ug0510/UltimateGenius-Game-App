import React, {useState, useEffect} from 'react';
import LoginPage from './pages/User/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from './pages/Homepage/Homepage';
import RegisterPage from './pages/User/Register';
import fetchUserData from './utils/fetchUserData';
import checkIsLoggedIn from './utils/checkIsLoggedIn';

const App = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {

        checkIsLoggedIn({setIsLoggedIn});
        
      }, [isLoggedIn]);


    return (
        <Router>
            <Routes>
            <Route path="/" element={<Homepage isLoggedIn={isLoggedIn}  setIsLoggedIn={setIsLoggedIn}/>} />
            <Route path="/user/login" element={<LoginPage isLoggedIn={isLoggedIn}  setIsLoggedIn={setIsLoggedIn}/>} />
            <Route path="/user/register" element={<RegisterPage/>} />
            </Routes>
        </Router>
            );
}

export default App;
