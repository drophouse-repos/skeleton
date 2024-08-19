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
    <>
      {errorSource == 'fetchGetImage' ? 
      <div className="error-container" style={{width:'100%'}}>
        <img className='error-Img' src={errorImg} style={{maxHeight: '300px'}}/>
        <p className='error-message' style={{fontFamily: 'fantasy',fontSize : '40px',color:'#603813'}}>Sorry, it's not you it's us!</p>
        <p>We’re experiencing an internal server error</p>
        <button style={{backgroundColor: '#603813'}} onClick={() => window.location.href='/product'}>Try Again!</button>
      </div>
      :
      <div className="error-container">
        <h1>Oops!</h1>
        {errorMessage && <p>Error: {errorMessage}<p></p> Source: {errorSource}</p>}
        <p>We're sorry, but something went wrong. Please contact support@drophouse.art</p>
        <button onClick={() => window.location.href='/'}>Go Home</button>
      </div>
      }
    </>
  );
}

export default ErrorPage;
