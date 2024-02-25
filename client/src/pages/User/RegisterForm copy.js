import React, { useState } from 'react';
import axios from 'axios';
import styles from './RegisterFormcopy.module.css';
import PopupMessage from '../../components/Popup/PopupMessage';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    userName: '',
    userGender: '',
    userType: '',
    email: '',
    password: '',
    confirmPassword: '',
    gameName: '',
    avatar: ''
  });

  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const closePopup = () => {
    setShowPopup(false);
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/register', formData);
      console.log('User registered successfully:', response.data);
      setFormData({
        userName: '',
        userGender: '',
        userType: '',
        email: '',
        password: '',
        gameName: '',
        avatar: ''
      });
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formBody}>
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
              </div></div>
            <div className='col-lg-6'><div className={styles.formGroup}>
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
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="confirmpassword" className={styles.label}>Confirm Password:</label>
                <input
                  type="password"
                  id="c-password"
                  name="confirm-password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="avatar" className={styles.label}>Avatar:</label>
                <input
                  type="text"
                  id="avatar"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div></div>
          </div>


          <button type="submit" className={styles.button}>Register</button>
          {showPopup && <PopupMessage message={popupMessage} onClose={closePopup} />}
        </form>

      </div>
     
    </div>
  );
};

export default RegisterForm;
