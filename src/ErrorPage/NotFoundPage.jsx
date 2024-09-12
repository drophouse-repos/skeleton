import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router';
import logo from ".././assets/404-error.svg";
import "./NotFoundPage.css";

const LoadingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="notfoundpage-loading-container">
      <img src={logo} alt="404 - Page Not found" className="notfoundpage-image" />
      <h1 style={{
        fontSize: '22px',
        fontFamily: 'ARSENAL',
        fontSize: 'clamp(22px, 4vw, 32px)'
      }}>
        Page you are requesting is not found
      </h1>

      <button
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        style={{
          padding: '10px 22px',
          fontSize: 'clamp(12px, 2vw, 16px)'
        }}
        onClick={() => navigate('/')}>
        Go Home
      </button>
    </div>
  );
};

export default LoadingPage;