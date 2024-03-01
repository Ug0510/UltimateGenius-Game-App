import React, { useEffect, useState } from 'react';
import '../../assets/css/bootstrap.css';
import './Homepage.css';
import fetchUseData from '../../utils/fetchUserData';
import {Link, useNavigate } from 'react-router-dom';
import VanillaTilt from 'vanilla-tilt';
import Header from '../../components/Header/Header';


const Homepage = ({isLoggedIn, login}) => {

    const [userData, setUserData] = useState(null);
    


    const addUserData = (data) => {
        setUserData(data);
    }

    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    

    useEffect(() => {

        if(!isLoggedIn)
        {
            navigate('/user/login');
        }

        fetchUseData(login,addUserData);
        
        console.log(localStorage.getItem('ultimate_genius0510_token'))
        


    }, []);

    useEffect(() => {
        VanillaTilt.init(document.querySelector('.tilt'), {
            max: 25,
            speed: 400,
            glare: true,
            'max-glare': 0.5
        });
    }, []);

    // Handler to toggle the user popup class
    const toggleProfilePopup = () => {
        setIsOpen(!isOpen);
    };



    return (
        <div>
            {/* header section start */}
            <Header userData={userData} isLoggedIn={isLoggedIn} toggleProfilePopup={toggleProfilePopup}/>
            {/* header section end */}

            {/* notification area start */}
            <div className="notification-area p-4" data-lenis-prevent>
                <div className="notification-card d-grid gap-4" data-tilt>
                    {/* notification cards */}
                    {/* Repeat this block for each notification card */}
                    <div>
                        <div className="card-item d-flex align-items-center gap-4">
                            <div className="card-img-area">
                                <img className="w-100 rounded-circle" src="assets/img/avatar1.png" alt="profile" />
                            </div>
                            <div className="card-info">
                                <span className="card-title d-block tcn-1"> Cristofer Dorwart</span>
                                <span className="card-text d-block tcn-1 fs-sm">Winners The Last Game</span>
                            </div>
                        </div>
                    </div>
                    {/* End of notification card block */}
                </div>
            </div>
            {/* notification area end */}

            {/* user account details popup start */}
            <div className={`user-account-popup p-4 ${isOpen ? 'open' : ''}`}>
                <div className="account-items d-grid gap-1" data-tilt>
                    {/* user account details */}
                    <div className="user-level-area p-3">
                        <div className="user-info d-between">
                            <span className="user-name fs-five">David Malan</span>
                            <div className="badge d-flex align-items-center">
                                <i className="ti ti-medal fs-three fs-normal tcp-2"></i>
                                <i className="ti ti-medal fs-three fs-normal tcp-2"></i>
                                <i className="ti ti-medal fs-three fs-normal tcp-2"></i>
                            </div>
                        </div>
                        <div className="user-level">
                            <span className="level-title tcn-6">Level</span>
                            <div className="level-bar my-1">
                                <div className="level-progress" style={{ width: '30%' }}></div>
                            </div>
                        </div>
                    </div>
                    {/* links */}
                    <a href="profile.html" className="account-item">View Profile</a>
                    <a href="chat.html" className="account-item">Message</a>
                    <button className="bttn account-item" onClick={()=> {login(false)}}>Logout</button>
                </div>
            </div>
            {/* user account details popup end */}

            {/* Hero Section start */}
            <section className="hero-section pt-20 pb-120 position-relative">
                <div className="gradient-bg"></div>
                <div className="gradient-bg2"></div>
                <div className="rotate-award">
                    <img className="w-100" src="assets/img/award.png" alt="award" />
                </div>
                <div className="container pt-120 pb-15">
                    <div className="row g-6 justify-content-between">
                        <div className="col-lg-5 col-md-6 col-sm-8">
                            <div className="hero-content">
                                <ul className="d-flex gap-3 fs-2xl fw-semibold heading-font mb-5 list-icon title-anim">
                                    <li>Play</li>
                                    <li>Learn</li>
                                    <li>Enjoy</li>
                                </ul>
                                <h1 className="hero-title display-one tcn-1 cursor-scale growUp mb-10">
                                    ULTIMATE
                                    <span className="d-block tcp-1">GAMER’S</span>
                                    HAVEN
                                </h1>
                                <Link to={userData && userData.userType === 'student'? "/student/quiz/join":"/teacher/game-choice"} className="btn-half-border position-relative d-inline-block py-2 px-6 bgp-1 rounded-pill popupvideo mfp-iframe">Play Now</Link>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-2 col-4 order-md-last order-lg-1">
                            <div className="hero-banner-area">
                                <div className="hero-banner-bg">
                                    <img className="w-100" src="assets/img/bg-1.png" alt="banner" />
                                </div>
                                <div className="hero-banner-img">
                                    <img className="w-100 hero" src="assets/img/boy.png" alt="banner" />
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-5 col-md-6 order-md-1 order-lg-last">
                            <div className="hero-content">
                                <div className="card-area py-lg-8 py-6 px-lg-6 px-3 rounded-5 tilt mb-10" data-tilt>
                                    <h3 className="tcn-1 dot-icon cursor-scale growDown mb-6 title-anim">
                                        Last Winners
                                    </h3>
                                    <div className="hr-line mb-6"></div>
                                    <div className="card-items d-grid gap-5">
                                        {/* Card items */}
                                        <div className="card-item d-flex align-items-center gap-4">
                                            <div className="card-img-area rounded-circle overflow-hidden">
                                                <img className="w-100" src="assets/img/avatar1.png" alt="profile" />
                                            </div>
                                            <div className="card-info">
                                                <h4 className="card-title fw-semibold tcn-1 mb-1 cursor-scale growDown2 title-anim">
                                                    Cristofer Dorwart
                                                </h4>
                                                <p className="card-text tcs-1 fw-medium">+$220</p>
                                            </div>
                                        </div>
                                        <div className="hr-line mb-1"></div>
                                        <div className="card-item d-flex align-items-center gap-4">
                                            <div className="card-img-area rounded-circle overflow-hidden">
                                                <img className="w-100" src="assets/img/avatar2.png" alt="profile" />
                                            </div>
                                            <div className="card-info">
                                                <h4 className="card-title fw-semibold tcn-1 mb-1 cursor-scale growDown2 title-anim">
                                                    Cristofer Dorwart
                                                </h4>
                                                <p className="card-text tcs-1 fw-medium">+$220</p>
                                            </div>
                                        </div>
                                        <div className="hr-line mb-1"></div>
                                        <div className="card-item d-flex align-items-center gap-4">
                                            <div className="card-img-area rounded-circle overflow-hidden">
                                                <img className="w-100" src="assets/img/avatar3.png" alt="profile" />
                                            </div>
                                            <div className="card-info">
                                                <h4 className="card-title fw-semibold tcn-1 mb-1 cursor-scale growDown2 title-anim">
                                                    Cristofer Dorwart
                                                </h4>
                                                <p className="card-text tcs-1 fw-medium">+$220</p>
                                            </div>
                                        </div>
                                        {/* End of card items */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid-lines overflow-hidden">
                    <div className="lines">
                        {/* Lines */}
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                        {/* End of lines */}
                    </div>
                    <div className="lines">
                        {/* Vertical lines */}
                        <div className="line-vertical"></div>
                        <div className="line-vertical"></div>
                        <div className="line-vertical"></div>
                        <div className="line-vertical"></div>
                        <div className="line-vertical"></div>
                        <div className="line-vertical"></div>
                        <div className="line-vertical"></div>
                        <div className="line-vertical"></div>
                        <div className="line-vertical"></div>
                        <div className="line-vertical"></div>
                        {/* End of vertical lines */}
                    </div>
                </div>
            </section>
            {/* Hero Section end */}



            {/* js dependencies */}
            {/* Include script tags for all JavaScript dependencies */}
        </div>
    );
}

export default Homepage;
