import React, { useState } from 'react';
import axios from 'axios';
import styles from './LoginForm.module.css';
import PopupMessage from '../../../components/Popup/PopupMessage';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/images/logo/logo.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    userName: '',
    userGender: '',
    userType: '',
    email: '',
    password: '',
    confirmPassword: '',
    gameName: '',
    avatar: 'http://localhost:8000/assets/avatar/avatar1.png'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('avatar1');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAvatarClick = (avatar) => {
    let avatarImageUrl = '';
  
    if (avatar === 'avatar1')
      avatarImageUrl = 'http://localhost:8000/assets/avatar/avatar1.png';
    else if (avatar === 'avatar2')
      avatarImageUrl = 'http://localhost:8000/assets/avatar/avatar2.png';
    else if (avatar === 'avatar3')
      avatarImageUrl = 'http://localhost:8000/assets/avatar/avatar3.png';
  
    setSelectedAvatar(avatar);
    
    // Use functional update to ensure avatarImageUrl is up-to-date
    
      setFormData(prevState => ({
        ...prevState,
        avatar: avatarImageUrl
      }));
  };
  
  const handleFileChange = async (e) => {
    const uploadedAvatar = e.target.files[0];
  
    try {
      setSelectedAvatar('avatar4');
      const formData = new FormData();
      formData.append('avatar', uploadedAvatar);
  
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      setFormData(prevState => ({
        ...prevState,
        avatar: response.data.imagePath
      }));

    } catch (error) {
      console.error('Error uploading avatar:', error);
      setPopupMessage('Error uploading avatar');
      setShowPopup(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!/^[a-zA-Z\s]+$/.test(formData.userName)) {
      setPopupMessage('Username should only contain letters and whitespace');
      setShowPopup(true);
      return;
    }

    const requiredFields = ['userName', 'userType', 'userGender', 'email', 'password'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setPopupMessage(`Missing required field: ${field}`);
        setShowPopup(true);
        return;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setPopupMessage('Invalid email address');
      setShowPopup(true);
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(formData.password)) {
      setPopupMessage('Password should be alphanumeric');
      setShowPopup(true);
      return;
    }

    if (formData.password.length < 8 || formData.password.length > 20) {
      setPopupMessage('Password must be between 8 and 20 characters');
      setShowPopup(true);
      return;
    }

    if (formData.userName.length > 20 || formData.email.length > 50 || formData.gameName.length > 20) {
      setPopupMessage('UserName and GameName should not exceed 20 characters');
      setShowPopup(true);
      return;
    }

    try {
      // Check if gameName and email already exist
      const existingUserCheck = await axios.get(`http://localhost:8000/api/user/check/${formData.gameName}/${formData.email}`);
      if (existingUserCheck.data.exists) {
        setPopupMessage('User with this game name or email already exists');
        setShowPopup(true);
        return;
      }

      // Proceed with registration if validations pass
      const response = await axios.post('http://localhost:8000/api/user/register', formData);
      console.log('User registered successfully:', response.data);

      // Redirect to login page
      navigate('/user/login');
    } catch (error) {
      console.error('Error registering user:', error);
      setPopupMessage('Error registering user');
      setShowPopup(true);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div >
        <img src={logo} alt='logo' className={styles.logo + " " + styles.upper} />
      </div>
      <div className={styles.formBody + ' ' + styles.form2}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.formHead}>Registration Form</h2>
          <div className='row'>
            <div className='col-lg-6'>
              <div className={styles.formGroup}>
                <label htmlFor="userName" className={styles.label}>User Name:</label>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="gameName" className={styles.label}>Game Name:</label>
                <input
                  type="text"
                  id="gameName"
                  name="gameName"
                  value={formData.gameName}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>User Gender:</label>
                <div className={styles.radioGroup}>
                  <input
                    type="radio"
                    id="male"
                    name="userGender"
                    value="male"
                    onChange={handleInputChange}
                    required
                    className={styles.inputRadio}
                  />
                  <label htmlFor="male" className={styles.labelRadio}>Male</label>
                </div>

                <div className={styles.radioGroup}>
                  <input
                    type="radio"
                    id="female"
                    name="userGender"
                    value="female"
                    onChange={handleInputChange}
                    required
                    className={styles.inputRadio}
                  />
                  <label htmlFor="female" className={styles.labelRadio}>Female</label>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>User Type:</label>
                <div className={styles.radioGroup}>
                  <input
                    type="radio"
                    id="teacher"
                    name="userType"
                    value="teacher"
                    onChange={handleInputChange}
                    required
                    className={styles.inputRadio}
                  />
                  <label htmlFor="teacher" className={styles.labelRadio}>Teacher</label>
                </div>
                <div className={styles.radioGroup}>
                  <input
                    type="radio"
                    id="student"
                   
                    name="userType"
                    value="student"
                    onChange={handleInputChange}
                    required
                    className={styles.inputRadio}
                  />
                  <label htmlFor="student" className={styles.labelRadio}>Student</label>
                </div>
              </div>
            </div>
            <div className='col-lg-6'>
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
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                  />
                  <div className={styles.eyeIcon} onClick={togglePasswordVisibility}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="confirmpassword" className={styles.label}>Confirm Password:</label>
                <input
                  type="text"
                  id="c-password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                />
              </div>

              {/* Avatar selection */}
              <div className={styles.formGroup}>
                <label htmlFor="avatar" className={styles.label}>Choose your Avatar:</label>
                <div className='row' >
                  <div className={'col-3 ' + styles.avatarIcon + (selectedAvatar === 'avatar1' ? ' ' + styles.selected : '')} onClick={() => handleAvatarClick('avatar1')}>
                    <img src='http://localhost:8000/assets/avatar/avatar1.png' alt="Avatar 1" />
                  </div>
                  <div className={'col-3 ' + styles.avatarIcon + (selectedAvatar === 'avatar2' ? ' ' + styles.selected : '')} onClick={() => handleAvatarClick('avatar2')}>
                    <img src='http://localhost:8000/assets/avatar/avatar2.png' alt="Avatar 2" />
                  </div>
                  <div className={'col-3 ' + styles.avatarIcon + (selectedAvatar === 'avatar3' ? ' ' + styles.selected : '')} onClick={() => handleAvatarClick('avatar3')}>
                    <img src='http://localhost:8000/assets/avatar/avatar3.png' alt="Avatar 3" />
                  </div>
                  {/* Upload button */}
                  <div className={'col-3 ' + styles.avatarIcon + (selectedAvatar === 'avatar4' ? ' ' + styles.selected : '')} >
                    <input type="file" id="avatar" name="avatar" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                    <label htmlFor="avatar" className={styles.uploadButton}>
                      {selectedAvatar === 'avatar4' ?
                        <p className={styles.uploadText}>Uploaded</p> :
                        <>
                          <div className={styles.uploadIconContainer}>
                            <div className={styles.uploadIcon}></div>
                            <div className={styles.uploadIcon}></div>
                          </div>
                          <p className={styles.uploadText}>Upload</p>
                        </>
                      }
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button type="submit" className={styles.button}>Register</button>
          <br />
          <div style={{ textAlign: 'center' }}>
            Already have an account? <Link to="/user/login" style={{ color: '#60d600' }}>Click here</Link>
          </div>
          {showPopup && <PopupMessage message={popupMessage} onClose={closePopup} />}
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
