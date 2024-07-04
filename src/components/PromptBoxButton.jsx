import React, { forwardRef, useContext } from 'react';
import './PromptBoxButton.css';
import { Orgcontext } from '../context/ApiContext';

const PromptBoxButton = forwardRef(({ text, onClick, className, loading, disabled, onMouseOver }, ref) => {
  const { orgDetails } = useContext(Orgcontext);
  
  return (
    <button
      ref={ref}
      style={{ fontFamily: orgDetails[0].font, width: window.innerWidth <= 544 ? '100%' : '' }}
      className={`bg-teal-500 text-zinc-100 font-extrabold py-2 px-4 rounded-xl whitespace-nowrap ${className}`}
      onClick={onClick}
      disabled={loading || disabled}
      onMouseOver={onMouseOver}
    >
      {loading ? <div className="spinner"></div> : text}
    </button>
  );
});

export default PromptBoxButton;
