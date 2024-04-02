import React, { useState } from 'react';
import axios from 'axios';
import styles from './LoginForm.module.css';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../../assets/images/logo/logo.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isEmailEntered, setIsEmailEntered] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmNewPasswordVisibility = () => {
    setShowConfirmNewPassword(!showConfirmNewPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckUserExists = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/user/check-email', { email: formData.email });
      if (response.data.exists) {
        setIsEmailEntered(true);
        handleSendOtp();
        toast.success('User exists. Please enter the OTP sent to your email.');
      } else {
        toast.error('User does not exist with this email.');
      }
    } catch (error) {
      console.error('Error checking user existence:', error);
      toast.error('Error checking user existence. Please try again later.');
    }
  };

  const handleSendOtp = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/user/send-otp', { email: formData.email, code:'2' });
      if (response.data.resendTime !== undefined) {
        toast.warning(`OTP already sent. Please wait ${response.data.resendTime} minutes before resending.`);
      } else {
        toast.success('OTP sent successfully. Please check your email.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Error sending OTP. Please try again later.');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/user/verify-otp', { email: formData.email, otp: formData.otp });
      if (response.data.verified) {
        setIsOtpVerified(true);
        toast.success('OTP verified successfully. You can now reset your password.');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Error verifying OTP. Please try again later.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEmailEntered) {
      await handleCheckUserExists();
    } else if (!isOtpVerified) {
      await handleVerifyOtp();
    } else {
      // Proceed with updating password
      try {
        if(formData.newPassword !== formData.confirmNewPassword)
        {
          toast.warning('Both Passwords Mismatches!');
          return;
        }
        if (formData.password.length < 8 || formData.password.length > 20) {
          toast.warning('Password must be between 8 and 20 characters');
    
          return;
        }

        if (!/^[a-zA-Z0-9]+$/.test(formData.password)) {
          toast.warning('Password should be alphanumeric');
    
          return;
        }
    
        

        const response = await axios.post('http://localhost:8000/api/user/reset-password', { email: formData.email, newPassword: formData.newPassword });
        if (response.data.success) {
          toast.success('Password reset successful. You can now login with your new password.');
          navigate('/user/login');
        } else {
          toast.error('Error resetting password. Please try again later.');
        }
      } catch (error) {
        console.error('Error resetting password:', error);
        toast.error('Error resetting password. Please try again later.');
      }
    }
  };

  return (
    <div className={styles.formContainer}>
      <div>
        <img src={logo} alt='logo' className={styles.logo} />
      </div>
      <div className={styles.formBody}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.formHead}>Forgot Password</h2>
          {!isEmailEntered && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>Enter your Email:</label>
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
              <button type="button" className={styles.button} onClick={handleCheckUserExists}>Check User</button>
            </>
          )}
          {isEmailEntered && !isOtpVerified && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="otp" className={styles.label}>Enter OTP:</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                />
              </div>
              <button type="button" className={styles.button} onClick={handleSendOtp}>Resend OTP</button>
              <button type="button" className={styles.button} onClick={handleVerifyOtp}>Verify OTP</button>
            </>
          )}
          {isOtpVerified && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="newPassword" className={styles.label}>Enter New Password:</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                  />
                  <div className={styles.eyeIcon} onClick={toggleNewPasswordVisibility}>
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="confirmNewPassword" className={styles.label}>Confirm New Password:</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmNewPassword ? 'text' : 'password'}
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    value={formData.confirmNewPassword}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                  />
                  <div className={styles.eyeIcon} onClick={toggleConfirmNewPasswordVisibility}>
                    {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
              </div>
              <button type="submit" className={styles.button}>Reset Password</button>
            </>
          )}
          <br />
          <div style={{ textAlign: 'center' }}>
            <Link to="/user/login">Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
