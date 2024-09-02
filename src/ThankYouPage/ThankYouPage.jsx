import React, { useState } from 'react';
import Confetti from 'react-confetti';
import './ThankYouPage.css';
import ClassButton from '../components/ClassButton';
import ClassInput from '../components/ClassInput';
import { useUser } from "../context/UserContext";
import { fetchSendEmail } from '../utils/fetch';


const ThankYouPage = () => {
  const [feedback, setFeedback] = useState();
  const { user } = useUser();
  const sendFeedback = (e) => {
    e.preventDefault()
    const request={
        "email": user.email,
        "name": user.firstName,
        "message": feedback
    }

    console.log(request)
    // fetchSendEmail(request, navigate)
    // .then(succeeded => {
    //     if (!succeeded.success) {
    //         if (succeeded.navigated)
    //           return
    //         setMessageBannerText(succeeded.message);
    //         setShowMessageBanner(true);
    //         setBannerKey(prevKey => prevKey + 1);
    //         return;
    //       }else{
    //         setMessageBannerText("Thank you for contacting us!");
    //         setShowMessageBanner(true);
    //         setBannerKey(prevKey => prevKey + 1);
    //         setTimeout(() => {
    //             window.location.href = "/";
    //         }, 1000);
    //         return;
    //       }
    //   })
  }
  return (
    <div className="thank-you-container">
      {/* <Confetti /> */}
      <div className="message-box">
        <h1>Thank You!</h1>
        <p>Your order has been placed successfully.
           We will send you an email shortly with your order confirmation</p>
           <div className='h-4'></div>
           <ClassButton text="Home" className="text-white border-2 border-white rounded-lg px-4 text-xl" link="/"></ClassButton>
           <form onSubmit={sendFeedback}>
                <label aria-label='Feedback'>Feedback</label>
                <ClassInput placeholder="Enter your Feedback" onChange={setFeedback} />
                <button type='submit'>Send</button>
           </form>
      </div>

    </div>
  );
};

export default ThankYouPage;
