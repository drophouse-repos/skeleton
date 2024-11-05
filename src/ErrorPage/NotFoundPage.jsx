import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router';
import logo from ".././assets/404-error.svg";
import "./NotFoundPage.css";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="notfoundpage-loading-container">
      <img src={logo} alt="404 - Page Not found" className="notfoundpage-image" />
      <h1 style={{
        fontSize: '22px',
        fontFamily: 'ARSENAL',
        fontSize: 'clamp(22px, 4vw, 32px)'
      }}>
        404 - It's okay, don't panic. What do we do when we're lost?
      </h1>
      <button
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        style={{
          padding: '10px 22px',
          fontSize: 'clamp(12px, 2vw, 16px)'
        }}
        onClick={() => navigate('/')}>
        Slowly head back home
      </button>
    </div>
  );
};


export default NotFoundPage;