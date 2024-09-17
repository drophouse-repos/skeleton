import React, { useEffect } from 'react';
import './ErrorPage.css';
import { useLocation } from 'react-router-dom';
import errorImg from '../assets/500-error.png'

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
    <div className="error-container" style={{width:'100%'}}>
      <img className='error-Img' src={errorImg} style={{maxHeight: '300px'}}/>
      <p className='error-message' style={{fontFamily: 'fantasy',fontSize : '40px',color:'#603813'}}>Sorry, it's not you it's us!</p>
      <p>We're experiencing an internal server error</p>
      <button style={{backgroundColor: '#603813'}} onClick={() => window.location.href='/product'}>Try Again!</button>
    </div>
  </>
  );
}

export default ErrorPage;
