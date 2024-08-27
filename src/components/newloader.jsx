import React, { useEffect, useState } from "react";
import logo from ".././assets/logo_footer_t.png"; // Replace with the path to your logo
import "./newLoadingPage.css"; // Import the CSS file
import BouncingDotsLoader from "./loadingdots";

const LoadingPage = () => {
  const prompts = [
    "Vibrant hues blend harmoniously in a lively environment,",
    "Design a whimsical tree house nestled in a lush forest,",
    "Create a futuristic tree house suspended among the branches,",
    "A spectrum of vivid shades transforms the surroundings into a vibrant and dynamic space,"
  ];

  const [currentPrompt, setCurrentPrompt] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrompt((prevPrompt) => (prevPrompt + 1) % prompts.length);
    }, 4000); // Change the prompt every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-container">
      <img src={logo} alt="Logo" className="loading-logo" />
      <div className="loading-prompt">"{prompts[currentPrompt]}"</div>
      <BouncingDotsLoader />
    </div>
  );
};

export default LoadingPage;
