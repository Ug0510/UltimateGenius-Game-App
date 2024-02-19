import React from 'react';
import {Link} from 'react-router-dom'

const LoginPage = () => {
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
                                <form action="#">
                                    <div className="project-info-form form-login">
                                        <h6 className="title">Login</h6>
                                        <h6 className="title show-mobie"><Link to='/user/register'>Register</Link></h6>
                                        <h6 className="title link"><Link to='/user/register'>Register</Link></h6>
                                        <p>Enter your credentials to access your account</p>
                                        <div className="form-inner">
                                            <fieldset>
                                                <label>Email address *</label>
                                                <input type="email" placeholder="Your email" required />
                                            </fieldset>
                                            <fieldset>
                                                <label>Password *</label>
                                                <input type="password" placeholder="Your password" required />
                                            </fieldset>
                                        </div>
                                        <a href="forget-password.html" className="fogot-pass">Forgot password?</a>
                                    </div>
                                    <div className="wrap-btn">
                                        <button type="submit" className="tf-button style2">
                                            Login
                                        </button>
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

export default LoginPage;
