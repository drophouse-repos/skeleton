import React from 'react';
import Confetti from 'react-confetti';
import './ThankYouPage.css';
import ClassButton from '../components/ClassButton';


const ThankYouPage = () => {
  return (
    <div className="thank-you-container">
      <Confetti />
      <div className="message-box">
        <h1>Thank You!</h1>
        <p>Your order has been placed successfully.
           We will send you an email shortly with your order confirmation</p>
           <div className='h-4'></div>
           <ClassButton text="Home" className="text-white border-2 border-white rounded-lg px-4 text-xl" link="/"></ClassButton>
      </div>

    </div>
  );
};

export default ThankYouPage;
