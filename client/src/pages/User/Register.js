import React from 'react';
import { useState } from 'react';
import ButtonG from '../../components/Button/ButtonG';


const RegisterPage = () => {
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
              <div className="project-info-form form-login style2">
                <h6 className="title">Register</h6>
                <h6 className="title show-mobie"><a href="login.html">Login</a></h6>
                <h6 className="title link"><a href="login.html">Login</a></h6>
                <p>Welcome to Risebot, please enter your details</p>
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
