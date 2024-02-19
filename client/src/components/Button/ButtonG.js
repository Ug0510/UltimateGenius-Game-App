import React from 'react';
import './ButtonG.css'; // Import the CSS module

const ButtonG = ({ children, type = 'submit', className = '' }) => {
  return (
      <button type={type} className={`tf-button style2 ${className}`}>
        {children}
      </button>
  );
};

export default ButtonG;
