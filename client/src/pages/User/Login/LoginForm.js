import React, { useState } from 'react';
import axios from 'axios';
import styles from './LoginForm.module.css';
import PopupMessage from '../../../components/Popup/PopupMessage';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../../assets/images/logo/logo.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';


const LoginForm = ({ isLoggedIn, login }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

const togglePasswordVisibility = () => {
  setShowPassword(!showPassword);
};

  const navigate = useNavigate();



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/user/login', formData);
      console.log('User logged in successfully:', response.data);



      localStorage.setItem('ultimate_genius0510_token', response.data.token);


      toast.success("Logged in successfully!")
      login();

      // Redirect to dashboard or profile page after successful login
      navigate('/');
    } catch (error) {
      console.error('Error logging in user:', error);
      toast.error('Invalid email or password');
    }

  };

  return (
    <div className={styles.formContainer}>
      <div>
        <img src={logo} alt='logo' className={styles.logo} />
      </div>
      <div className={styles.formBody}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.formHead}>Login Form</h2>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password:</label>
            <div style={{position:'relative'}}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className={styles.input}
              style={{marginBottom:'0'}}
            />
            <div className={styles.eyeIcon} onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
            </div>
            <Link to="/user/forget-password" style={{fontSize:'0.8rem',color:'#60d600'}}>Forget Password?</Link>
          </div>
          <button type="submit" className={styles.button}>Login</button>
          <br />
          <div style={{textAlign:'center'}}>
          <Link to="/user/register" >New User? Create a account.</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
