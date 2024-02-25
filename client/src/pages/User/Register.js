import React from 'react';
import { useState } from 'react';
import '../../assets/css/style.css';
import bg1 from '../../assets/bg-1.png'
import Logo from '../../assets/images/logo.png'


const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [gameName, setGameName] = useState('');
  const [gender, setGender] = useState('');
  const [userType, setUserType] = useState('');
  const [avatar, setAvatar] = useState('base');
  const [checked, setChecked] = useState(false);


  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here, e.g., validate input, make API calls
    console.log('Form submitted:', { email, password, confirmPassword, checked });
  };
  return (
    <>
      <header className='header-section w-100'>
        <div>
          <a className="navbar-brand d-flex align-items-center gap-4" href="index.html">
            <img className="w-25 py-5 img-fluid" src={Logo} alt="logo" />
          </a>
        </div>
      </header>
      <div className="header-fixed inner-page login-page form-body">
        <div id="wrapper" className=''>
          <div className="gradient-bg"></div>
          <div className="gradient-bg2"></div>

          <section className="sign-in-section pb-120 pt-120 mt-sm-15 mt-0">
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-lg-6">
        <div className="form-area">
          <h1 className="tcn-1 text-center cursor-scale growUp mb-10">SIGN UP</h1>
          <form action="#" className="sign-in-form">
            <div className="single-input mb-6">
              <input type="text" placeholder="Enter your Name" />
            </div>
            <div className="single-input mb-6">
              <input type="text" placeholder="Enter your Gamename" />
            </div>
            <div className="single-input mb-6">
              <input type="email" placeholder="Enter your email" />
            </div>
            <div className="single-input mb-6">
              <input type="password" placeholder="Enter your password" />
            </div>
            <div className="single-input mb-6">
              <label>User Gender:</label><br />
              <input type="radio" id="male" name="gender" value="male" />
              <label htmlFor="male">Male</label>
              <input type="radio" id="female" name="gender" value="female" />
              <label htmlFor="female">Female</label>
            </div>
            <div className="single-input mb-6">
              <label>User Type:</label><br />
              <input type="radio" id="teacher" name="userType" value="teacher" />
              <label htmlFor="teacher">Teacher</label>
              <input type="radio" id="student" name="userType" value="student" />
              <label htmlFor="student">Student</label>
            </div>
            <div className="single-input mb-6">
              <label htmlFor="avatar">Choose an avatar:</label><br />
              <input type="file" id="avatar" name="avatar" accept="image/*" />
            </div>
            <div className="text-center">
              <button className="bttn py-3 px-6 rounded bgp-1">Sign Up</button>
            </div>
          </form>
          <p className="tcn-4 text-center mt-lg-10 mt-6">Already have an account? <a href="signin.html" className="text-decoration-underline tcp-1">Sign In</a></p>
        </div>
      </div>
    </div>
  </div>
</section>

        </div>
      </div>
    </>

  );
};

export default RegisterPage;
