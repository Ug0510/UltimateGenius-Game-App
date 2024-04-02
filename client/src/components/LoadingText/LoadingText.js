import React, { useState, useEffect } from 'react';
import styles from './LoadingText.module.css';

const LoadingText = ({ fontSize }) => {
  const [text, setText] = useState('');
  const [dots, setDots] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (text.length === 8) {
        setText('');
      } else {
        setText(text + '․');
      }
    }, 300);

    return () => clearInterval(intervalId);
  }, [text]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDots(dots + '.');
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [dots]);

  return (
    <span className={styles.loadingText} style={{ fontSize: fontSize ? fontSize : 'inherit' }}>
      {text}
      {dots.slice(0, 4)}
    </span>
  );
};

export default LoadingText;
