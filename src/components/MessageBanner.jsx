import React, { useState, useEffect } from 'react';

const MessageBanner = ({ message, keyTrigger }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
      }, 1500); 

      return () => clearTimeout(timer); 
    }
  }, [message, keyTrigger]);

  if (!show) return null;

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-black text-white text-center p-4 rounded-lg shadow-md w-3/4 md:w-1/2 lg:w-1/3 z-50">
      <button onClick={() => setShow(false)} className="float-right bg-transparent text-white text-lg font-semibold hover:text-gray-400">
        ×
      </button>
      <p className="font-medium">{message}</p>
    </div>
  );
};

export default MessageBanner;
