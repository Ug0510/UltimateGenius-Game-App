import React from 'react';
import styles from './PopupMessage.module.css';

const PopupMessage = ({ message, onClose }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
};

export default PopupMessage;
