import React from 'react';

interface ButtonProps {
  children: string;
  top?: string;
  left?: string;
  pos?: string;
  disabled: boolean;  // Updated prop name to match standard HTML behavior
  onClick?: () => void; // Accepts an optional onClick function
}

const Button: React.FC<ButtonProps> = ({ children, top, left, pos, onClick, disabled }) => {
  return (
    <button
      className={`${pos} text-black font-sourceCodePro text-[2.6786vh] font-extrabold 
      rounded-bl-lg rounded-tl-lg rounded-br-lg rounded-tr-[5vh] 
      hover:text-button hover:shadow-2xl hover:scale-[102%] hover:transition-all
      hover:duration-200 hover:ease-in-out 
      shadow-[inset_0_4px_10px_rgba(0,0,0,0.25),0_5px_15px_rgba(0,0,0,0.3)] bg-white 
      ${disabled ? 'bg-gray-400 cursor-not-allowed' : ''}`} // Apply gray-out style when disabled
  
      style={{ top, left }}
      onClick={onClick} // Attach the click event handler
      disabled={disabled} // This will disable the button if `disabled` is true
    >
      {children}
    </button>
  );
};

export default Button;
