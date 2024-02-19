import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import PeakPk from '../../assets/images/peakpx.jpg';

const Homepage = () => {
    return (
        <div className='wrapper' style={{ height: '100vh', overflow: 'hidden', backgroundColor: '#09121D' }}>
            <Header />
            <div className="th-hero-wrapper hero-1" id="hero" style={{backgroundImage:`url(${PeakPk})`, backgroundSize:'cover'}}>
                <div className="container">
                    <div className="hero-style1 text-center">
                        <span className="sub-title custom-anim-top wow animated" data-wow-duration="1.2s" data-wow-delay="0.1s"># World Class Education & Gaming Site</span>
                        <h1 className="hero-title">
                            <span className="title1 custom-anim-top wow animated" data-wow-duration="1.1s" data-wow-delay="0.3s" data-bg-src="assets/img/hero/hero-title-bg-shape1.svg">SHAPING THE FUTURE OF</span>
                            <span className="title2 custom-anim-top wow animated" data-wow-duration="1.1s" data-wow-delay="0.4s">Education</span>
                        </h1>
                        <div className="btn-group custom-anim-top wow animated" data-wow-duration="1.2s" data-wow-delay="0.7s">
                            <a href="about.html" className="th-btn">EXPLORE MORE <i className="fa-solid fa-arrow-right ms-2"></i></a>
                            <a href="tournament.html" className="th-btn style2">BROWSE GAMES <i className="fa-solid fa-arrow-right ms-2"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Homepage;