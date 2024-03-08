import React, {useEffect, useState} from 'react'; 
import {Link } from 'react-router-dom';
import logo from '../../assets/images/logo/logo.png';
import VanillaTilt from 'vanilla-tilt';

const Header = ({userData, isLoggedIn, login}) => {

    const [isOpen, setIsOpen] = useState(false);

    // Handler to toggle the user popup class
    const toggleProfilePopup = () => {
        setIsOpen(!isOpen);
    };

    const handlelogout = () => {
        setIsOpen(false);
        login(false);
    }


    useEffect(() => {
        VanillaTilt.init(document.querySelector('.tilt2'), {
            max: 15,
            speed: 200,
            glare: true,
            'max-glare': 0.1
        });
    }, []);

    
    return (
    <header className="header-section w-100">
    <div className=" py-3 mx-xxl-20 mx-md-15 mx-3">
        <div className='d-flex align-items-center justify-content-between'>

            <div>
                <a className="navbar-brand d-flex align-items-center " href="index.html">
                    <img className="logo2" src={logo} alt="logo" style={{maxWidth:"220px"}}/>
                </a>
            </div>

            <div className="header-btn-area d-flex align-items-center gap-sm-6 gap-3">
                <div className="header-profile pointer" onClick={toggleProfilePopup}>
                    {isLoggedIn ? (<div className="profile-wrapper d-flex align-items-center gap-3">
                        <div className="img-area overflow-hidden">
                            <img className="w-100" src="assets/img/profile.png" alt="profile" />
                        </div>
                        <span className="user-name d-none d-xxl-block text-nowrap">{userData? userData.userName : 'User' }</span>
                        <i className="ti ti-chevron-down d-none d-xxl-block"></i>
                    </div>) : (
                        <Link to="/user/login" className="btn-half-border position-relative d-inline-block py-2 px-6 bgp-1 rounded-pill popupvideo mfp-iframe">Login</Link>

                    )}
                </div>
            </div>


        </div>
        
    </div>

     {/* user account details popup start */}
     <div className={`user-account-popup p-4  ${isOpen ? 'open' : ''}`}>
                <div className="account-items d-grid gap-1 tilt2" >
                    {/* user account details */}
                    <div className="user-level-area p-3">
                        <div className="user-info d-between">
                            <span className="user-name fs-five">{userData? userData.gameName : 'User'}</span>
                            
                        </div>
                        <div className="user-level">
                            <span className="level-title tcn-6">Level</span>
                            <div className="level-bar my-1">
                                <div className="level-progress" style={{ width: '30%' }}></div>
                            </div>
                        </div>
                    </div>
                    {/* links */}
                    <Link href="profile.html" className="account-item">View Profile</Link>
                    <button className="bttn account-item" onClick={handlelogout}>Logout</button>
                </div>
            </div>
            {/* user account details popup end */}
</header>)
}

export default Header;