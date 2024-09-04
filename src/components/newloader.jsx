import React, { useEffect, useState } from "react";
import logo from ".././assets/logo_footer_t.png"; // Replace with the path to your logo
import "./newLoadingPage.css"; // Import the CSS file
import BouncingDotsLoader from "./loadingdots";

const LoadingPage = () => {
  const prompts = [
    "A scenic mountain landscape featuring a sleek F1 car racing through the winding roads",
    "An artistic computer circuit pattern designed in Rose-Hulman red color",
    "Create a futuristic tree house suspended among the branches",
    "Towering snow-capped mountains with rugged peaks, surrounded by a serene landscape of alpine trees and a winding river below against a colorful sunset sky",
    "An elegant old vintage music score on off white paper, delicately handwritten with intricate vines and pink flowers"
  ];

  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [fadeState, setFadeState] = useState("fade-in");
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState("fade-out");
      setTimeout(() => {
        setCurrentPrompt((prevPrompt) => (prevPrompt + 1) % prompts.length);
        setFadeState("fade-in");
      }, 800); // Delay to match the transition duration
    }, 4000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-container">
      <img src={logo} alt="Logo" className="loading-logo" />
      <h1 className="design-ideas" style={{fontSize: '30px',fontFamily:'ARSENAL',marginBottom:'25px',position:'fixed',top:'25%'}}>Design Ideas</h1>
      <div className={`loading-prompt ${fadeState}`} style={{fontFamily: `ARSENAL`,maxWidth:'80vw',marginBottom:'100px'}}>{prompts[currentPrompt]}</div>
      <BouncingDotsLoader />
    </div>
  );
};

export default LoadingPage;
