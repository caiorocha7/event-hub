import React from 'react';

const Button = ({ children, onClick, type = "button", className = "", ...props }) => (
  <button type={type} onClick={onClick} className={`btn-primary ${className}`} {...props}>
    {children}
  </button>
);

export default Button;
