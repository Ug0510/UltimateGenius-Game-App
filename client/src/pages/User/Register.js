import React from 'react';
import { useState } from 'react';
import ButtonG from '../../components/Button/ButtonG';


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
    <div className="header-fixed inner-page login-page form-body">
      <div id="wrapper" className=''>
        <section className="page-title">
          <div className="overlay"></div>
        </section>
        <section className="tf-section project-info">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <form onSubmit={handleSubmit}>
                  <div className="project-info-form form-login">
                    <h6 className="title">Register</h6>
                    <h6 className="title show-mobie"><a href="login.html">Login</a></h6>
                    <h6 className="title link"><a href="login.html">Login</a></h6>
                    <p>Welcome to Ultimate Genius, please enter your details</p>
                    <div className="form-inner">
                      <fieldset>
                        <label>
                          Full Name *
                        </label>
                        <input
                          type="text"
                          placeholder="Full Name"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </fieldset>
                      <fieldset>
                        <label>
                          Gaming username (must be unique)*
                        </label>
                        <input
                          type="text"
                          placeholder="Your Game Name"
                          required
                          value={gameName}
                          onChange={(e) => setGameName(e.target.value)}
                        />
                      </fieldset>
                    </div>
                  </div>
                  <div class="project-info-form check-radio">
                    <h6 class="title mb30">Gender</h6>
                    <div class="form-inner">
                      <ul class="list">
                        <li class="list__item">
                          <input type="radio" class="radio-btn" name="gender" id="a-opt" onClick={() => { setGender('male') }} />
                          <label for="a-opt" class="label">Male</label>
                        </li>

                        <li class="list__item">
                          <input type="radio" class="radio-btn" name="gender" id="b-opt" onClick={() => { setGender('female') }} />
                          <label for="b-opt" class="label">Female</label>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div class="project-info-form check-radio">
                    <h6 class="title mb30">User Type</h6>
                    <div class="form-inner">
                      <ul class="list">
                        <li class="list__item">
                          <input type="radio" class="radio-btn" name="user-type" id="uts-opt" onClick={() => { setUserType('student') }} />
                          <label for="uts-opt" class="label">Student</label>
                        </li>

                        <li class="list__item">
                          <input type="radio" class="radio-btn" name="user-type" id="utt-opt" onClick={() => { setUserType('teacher') }} />
                          <label for="utt-opt" class="label">Teacher</label>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="project-info-form">
                    <div className="form-inner">
                      <fieldset>
                        <label>
                          Email address *
                        </label>
                        <input
                          type="email"
                          placeholder="Your email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </fieldset>
                      <fieldset>
                        <label>
                          Password *
                        </label>
                        <input
                          type="password"
                          placeholder="Your password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </fieldset>
                      <fieldset className="mb19">
                        <label>
                          Confirm password *
                        </label>
                        <input
                          type="password"
                          placeholder="Confirm password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </fieldset>
                      <fieldset className="checkbox">
                        <input
                          type="checkbox"
                          id="checkbox"
                          name="checkbox"
                          checked={checked}
                          onChange={(e) => setChecked(e.checked)}
                        />
                        <label for="checkbox" className="icon"></label>
                        <label for="checkbox">
                          I accept the Term of Conditions and Privacy Policy
                        </label>
                      </fieldset>
                    </div>
                  </div>
                  <div className="wrap-btn">
                    <ButtonG type="submit" className="tf-button style2">
                      Register
                    </ButtonG>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RegisterPage;
