import React from 'react';

interface AnimatedButtonProps {
  text: string;
  onClick: () => void;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ text, onClick }) => {
  const buttonStyle = {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '1.2rem',
    color: 'white',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3',
    transform: 'scale(1.05)',
  };

  return (
    <button
      style={buttonStyle}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, buttonHoverStyle);
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, buttonStyle);
      }}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default AnimatedButton;