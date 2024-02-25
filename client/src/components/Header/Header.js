import React from 'react'; 
import {Link } from 'react-router-dom';

const Header = ({userData, isLoggedIn, toggleProfilePopup}) => {
    return (
    <header className="header-section w-100">
    <div className="py-sm-6 py-3 mx-xxl-20 mx-md-15 mx-3">
        <div className='d-flex align-items-center justify-content-between'>

            <div>
                <a className="navbar-brand d-flex align-items-center gap-4" href="index.html">
                    <img className="w-100 logo2" src="assets/logo.png" alt="logo" />
                </a>
            </div>

            <div className="header-btn-area d-flex align-items-center gap-sm-6 gap-3">
                <button className="ntf-btn box-style fs-2xl">
                    <i className="ti ti-bell-filled"></i>
                </button>
                <div className="header-profile pointer" onClick={toggleProfilePopup}>
                    {isLoggedIn ? (<div className="profile-wrapper d-flex align-items-center gap-3">
                        <div className="img-area overflow-hidden">
                            <Link to="/user/register"><img className="w-100" src="assets/img/profile.png" alt="profile" /></Link>
                        </div>
                        <span className="user-name d-none d-xxl-block text-nowrap">David Malan</span>
                        <i className="ti ti-chevron-down d-none d-xxl-block"></i>
                    </div>) : (
                        <Link to="/user/register" className="btn-half-border position-relative d-inline-block py-2 px-6 bgp-1 rounded-pill popupvideo mfp-iframe">Login</Link>

                    )}
                </div>
            </div>


        </div>
        
    </div>
</header>)
}

export default Header;