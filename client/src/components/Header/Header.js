import React from 'react';
import { Link } from 'react-router-dom';
import ButtonG from '../Button/ButtonG';
import Logo from '../../assets/images/logo/logo.png'

const Header = () => {
    return (
        <header className="th-header header-layout1">
            <div className="header-top">
                <div className="container">
                    <div className="row justify-content-center justify-content-lg-between align-items-center gy-2">
                        <div className="col-auto d-none d-lg-block">
                            <p className="header-notice"></p>
                            <div className="header-links">
                                <ul>
                                    <li>
                                        <div className="header-notice">Welcome to our <Link to="/">Ultimate Genius</Link> Education team
                                        </div>
                                    </li>
                                    <li>
                                        <div className="dropdown-link">
                                            <i className="fa fa-globe"></i> English
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-auto">
                            <div className="header-links">
                                <ul>
                                    <li><Link to="https://www.facebook.com/">Facebook</Link></li>
                                    <li><Link to="https://www.twitter.com/">Twitter</Link></li>
                                    <li><Link to="https://www.pinterest.com/">Pinterest</Link></li>
                                    <li><Link to="https://www.instagram.com/">Instagram</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="sticky-wrapper">
                <div className="menu-area">
                    <div className="container">
                        <div className="row align-items-center justify-content-between py-3">
                            <div className="col-auto">
                                <div className="header-logo">
                                    <Link to="/">
                                        <span data-mask-src="assets/img/logo.svg" className="logo-mask"></span>
                                        <img src={Logo} style={{maxWidth:'200px'}} alt="Ultimate Genius" />
                                    </Link>
                                </div>
                            </div>
                            <div className="col-auto d-none d-xl-block">
                                {/* <div className="header-button">
                                    <div className="d-xxl-block d-none">
                                        <Link to="/User/Login" className="th-btn">
                                            <i className="fa-brands fa-twitch me-1"></i> Login/Register
                                        </Link>
                                    </div>
                                </div> */}
                                <Link to='/user/login'>
                                    <ButtonG type='button'>Login/Register</ButtonG>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="logo-bg"></div>
                </div>
            </div>
        </header>
    );
};

export default Header;
