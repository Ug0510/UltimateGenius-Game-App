// ErrorPopup.js

import React from 'react';
import styles from './ErrorPopup.module.css';

const ErrorPopup = ({ message, onClose }) => {
  const handleClickOutside = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };
  return (
    <div className={styles.overlay} onClick={handleClickOutside}>
      <div className={styles.popup}>
        <span className={styles.closeButton} onClick={onClose}>&times;</span>
        <p className={styles.errorMessage}>{message}</p>
      </div>
    </div>
  );
};

export default ErrorPopup;
