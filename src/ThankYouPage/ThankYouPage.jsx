import React, { useState, useContext } from 'react';
import Confetti from 'react-confetti';
import './ThankYouPage.css';
import ClassButton from '../components/ClassButton';
import ClassInput from '../components/ClassInput';
import { useUser } from "../context/UserContext";
import { fetchSendEmail } from '../utils/fetch';
import { useNavigate } from 'react-router-dom';
import { MessageBannerContext } from "../context/MessageBannerContext";
import MessageBanner from '../components/MessageBanner';


const ThankYouPage = () => {
  const [feedback, setFeedback] = useState('');
  const [experience, setExperience] = useState('');
  const [rating, setRating] = useState('');
  const { user } = useUser();
  const navigate = useNavigate();
  const {
    showMessageBanner,
    setShowMessageBanner,
    messageBannerText,
    setMessageBannerText,
    bannerKey,
    setBannerKey
  } = useContext(MessageBannerContext);

  const sendFeedback = (e) => {
    e.preventDefault();
    const request = {
      email: user.email,
      name: user.firstName,
      message: "Feedback :  " + feedback + ", Experience :  " + experience + ", Rating :  " +  rating
    };

    console.log(request);
    fetchSendEmail(request, navigate)
        .then(succeeded => {
            if (!succeeded.success) {
                if (succeeded.navigated)
                  return
                setMessageBannerText(succeeded.message);
                setShowMessageBanner(true);
                setBannerKey(prevKey => prevKey + 1);
                return;
              }else{
                setMessageBannerText("Thank you for your Feedback !!!");
                setShowMessageBanner(true);
                setBannerKey(prevKey => prevKey + 1);
                setTimeout(() => {
                    window.location.href = "/";
                }, 1000);
                return;
              }
          })
  };

  return (
    <div className="thank-you-container">
      {showMessageBanner && <MessageBanner message={messageBannerText} keyTrigger={bannerKey} />}
      <Confetti />
      <div className="message-box">
      <span className='thank-you-close-btn' onClick={() => navigate('/')}>X</span>
        <h1>Thank You!</h1>
        <p>Your order has been placed successfully. We will send you an email shortly with your order confirmation.</p>
        <div className="h-4"></div>
        <form onSubmit={sendFeedback} className="feedback-form">
          <label htmlFor="experience">How was your experience with Drophouse?</label>
          <ClassInput id="experience" placeholder="Describe your experience" onChange={setExperience} />

          <label htmlFor="rating">How would you rate the Drophouse site?</label>
          <ClassInput id="rating" placeholder="Rate from 1 to 5" onChange={setRating} />

          <label htmlFor="feedback">Additional Feedback</label>
          <ClassInput id="feedback" placeholder="Enter your Feedback" onChange={setFeedback} />

          <div className="button-group">
            <ClassButton text="Submit" className="feedback-btn" type="submit" />
            {/* <ClassButton text="Go Back" className="home-btn text-white border-2 border-white rounded-lg px-4 text-x" link="/" /> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ThankYouPage;
