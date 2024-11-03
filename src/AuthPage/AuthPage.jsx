import { useNavigate } from 'react-router-dom';
import { GoogleIcon, DropHouseLogo } from '../components/Icons';
import Divider from '../components/Divider';
import "./AuthPage.css";
import React, { useContext, useEffect, useState } from 'react';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from 'firebase/auth';
import './AuthPage.css';
import app from './../firebase-config';
import { splitName } from '../utils';
import { postAuthData } from '../utils/fetch';
import { useUser } from "../context/UserContext";
import { Orgcontext } from '../context/ApiContext';
import { FaCopy } from 'react-icons/fa';
// Add the isInAppBrowser function
const isInAppBrowser = () => {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  return /instagram|snapchat|linkedin|fbav|fban|facebook|line/i.test(ua);
};

const AuthPage = () => {
  const { orgDetails, galleryPage } = useContext(Orgcontext)
  const auth = getAuth(app);
  const navigate = useNavigate();
  const { user, setUser, clearGuestSessionStorage } = useUser();
  const [email, setEmail] = useState('');
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [copied, setCopied] = useState(false);

  // New state to track if in-app browser is detected
  const [inAppBrowser, setInAppBrowser] = useState(false);

  useEffect(() => {
    setInAppBrowser(isInAppBrowser());
  }, []);

  useEffect(() => {
    if(user.isLoggedIn && process.env.REACT_APP_AUTHTYPE_SAML === 'true')
      navigate(galleryPage ? '/product/gallery' : '/product')
  }, [user])

  useEffect(() => {
    if (inAppBrowser) {
      // Skip authentication logic if in an in-app browser
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user && justLoggedIn) {
        const { displayName, email, phoneNumber } = user;       
        let firstName = '';
        let lastName = '';
        if (!displayName) {
          firstName = email.split('@')[0];
        } else {
          const names = splitName(displayName); 
          firstName = names.firstName;
          lastName = names.lastName;
        }
        setUser({ isLoggedIn: true, firstName, email, phoneNumber, isGuest: false });
        clearGuestSessionStorage();

        user.getIdToken(true).then(() => {
          postAuthData({email, firstName, lastName, phoneNumber, navigate})
            .then(() => {
                setAuthError('');
                window.location.href = galleryPage ? '/product/gallery' : '/product'
            })
            .catch(error => {
                console.error("Log in failed", error);
                setAuthError('Failed to update user authentication data. Please try again.');
                signOut();
            });
        });
      } 
    });
    
    return () => unsubscribe();
  }, [justLoggedIn, inAppBrowser]); // Include inAppBrowser in dependencies

  const signInWithGoogle = async () => {
    if (inAppBrowser) {
      return;
    }

    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setJustLoggedIn(true);
    } catch (error) {
      console.error('Error during Google Sign In:', error);
    }
  };

  const sendMagicLink = async (email) => {
    if (inAppBrowser) {
      return;
    }

    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/auth`,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setShowMessage(true); 
      setResendTimer(30); 
      const interval = setInterval(() => {
        setResendTimer((prevTimer) => {
          if (prevTimer === 1) clearInterval(interval);
          return prevTimer - 1;
        });
      }, 1000);
        alert('Check your email for the link to sign in');
    } catch (error) {
      console.error('Error sending magic link:', error);
    }
  };

  const resendMagicLink = () => {
    if (email && resendTimer === 0) 
      sendMagicLink(email); 
  };

  useEffect(() => {
    if (inAppBrowser) {
      // Skip email link sign-in if in an in-app browser
      return;
    }

    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }
      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
          window.localStorage.removeItem('emailForSignIn');
          setJustLoggedIn(true);
        })
        .catch((error) => {
          console.error('Error during email link sign-in:', error);
        });
    }
  }, [inAppBrowser]); // Include inAppBrowser in dependencies

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleMagicLinkSignIn = () => {
    sendMagicLink(email);
  };

  if (inAppBrowser) {
    const currentLink = window.location.href;
  
    const copyLink = () => {
      navigator.clipboard.writeText(currentLink)
        .then(() => {
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    };
    return (
      <div className="bg-white max-w-[400px] mx-auto px-4 py-8 font-arsenal mt-16">
        <div className="text-center">
          <h1 className="mb-8 text-2xl text-black font-bold">Open in Browser</h1>
          <p className="mb-8">
            We know it's frustrating, but we have some pretty cool stuff to show you, and it won't work here.
          </p>
          <div className="mb-4">
            <p>
              Tap the <strong>three dots</strong> <span>•••</span> at the top right corner and select{' '}
              <strong>Open in Browser</strong>.
            </p>
          </div>
          <Divider content="Or"></Divider>
                <div className="mt-8">
                <p>Copy the link below and paste it into your browser:</p>
                <div className="mt-2 flex items-center">
                  <input
                    type="text"
                    readOnly
                    value={currentLink}
                    className="border p-2 flex-1 text-gray-500"
                  />
                  <button
                    onClick={copyLink}
                    className="ml-2 p-2"
                    aria-label="Copy Link"
                  >
                    <FaCopy size={24} />
                  </button>
                </div>
                {copied && (
                  <p className="text-green-500 mt-2">Link copied to clipboard!</p>
                )}
              </div>
        </div>
      </div>
    );
  }

  if (user.isLoggedIn) {
    return (
      <div className="bg-white w-[80%] max-w-[400px] h-[85vh] w-10/12 grid content-center">
        <div className='flex justify-center h-[20vh]'>
          <img className='h-[60px] md:h-[100px] mx-auto' src={DropHouseLogo} alt="Drop House Logo" onClick={() => navigate('/')}/>
        </div>
        <div className='text-center h-fit'>
          <h1 className='authWelcomeTitle mb-[2rem] text-[32px] text-black font-bold'>You're logged in</h1>
          <p>Welcome, {user.firstName || "User"}!</p>
          <button className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' onClick={signOut}>
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  if (process.env.REACT_APP_AUTHTYPE_SAML === 'true') {
    return (
      <div className="bg-white w-[80%] max-w-[400px] h-[85vh] w-10/12 grid content-center">
        <div className='h-[20vh]'>
          <img className='h-[60px] md:h-[100px] mx-auto' src={DropHouseLogo} alt="drop house logo" onClick={() => navigate('/')}/>
        </div>
        <div className='h-fit'>
          <h1 className='mb-[2rem] text-[32px] text-black font-bold'>Sign In to Design Now</h1>
          <button 
            style={{fontFamily : `${orgDetails.font}`, backgroundColor: `${orgDetails.theme_color}`}}
            className= "mx-auto text-zinc-100 font-extrabold py-2 px-4 text-xl rounded-xl"
            onClick={() => window.location.href = 'https://server.drophouse.ai/saml/login'}>
            <span>Sign In</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-[80%] max-w-[400px] h-[85vh] w-10/12 grid content-center">
      <div className='h-[20vh]'>
        <img className='h-[60px] md:h-[100px] mx-auto' src={DropHouseLogo} alt="drop house logo" onClick={() => navigate('/')}/>
      </div>
      <div className='h-fit'>
        <h1 className='mb-[2rem] text-[32px] text-black font-bold'>Sign In to Design Now</h1>
        <button className='loginBtn' onClick={signInWithGoogle}>
          <img className="loginBtnIcon" src={GoogleIcon} alt="google icon" />
          <span>Continue with Google</span>
        </button>
        {authError && <div className="bg-red-100 text-red-500 p-4 rounded border border-red-400">{authError}</div>}
        <Divider content="Or"></Divider>
        <input 
          className='loginInput mt-4' 
          type="email" 
          placeholder='Email Address' 
          value={email} 
          onChange={handleEmailChange}
        />
        {!showMessage && (
          <button className='emailBtn' onClick={handleMagicLinkSignIn}>
            <span>Continue</span>
          </button>
        )}
        {showMessage && (
          <div className="text-center p-4 mb-4 bg-blue-100 border border-blue-200 rounded m-[1em]">
            <p>Check your email for the sign-in link!</p>
            {resendTimer > 0 ? (
              <p>You can resend the email in {resendTimer} seconds.</p>
            ) : (
              <button
                className="emailBtn"
                onClick={resendMagicLink}
              >
                Resend Email
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;