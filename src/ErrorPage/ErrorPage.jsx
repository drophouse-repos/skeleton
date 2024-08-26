import React, { useEffect } from 'react';
import './ErrorPage.css'; // Make sure to link the CSS file
import { useLocation } from 'react-router-dom';
import errorImg from '.././assets/500-error.png'

const ErrorPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const errorMessage = queryParams.get('message');
  const errorSource = queryParams.get('source');
  useEffect(() => {
    document.title = 'Error | Drop House';
    sessionStorage.clear();
  }, []);

  return (
    <div className="error-container">
      <h1>Oops!</h1>
      {errorMessage && <p>Error: {errorMessage}<p></p> Source: {errorSource}</p>}
      <p>We're sorry, but something went wrong. Please contact support@drophouse.art</p>
      <button onClick={() => window.location.href='/'}>Go Home</button>
    </div>
  );
}

export default ErrorPage;
