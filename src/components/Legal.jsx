import React, { useContext, useState } from 'react';
import './Legal.css';
import { Orgcontext } from '../context/ApiContext';

const Legal = () => {
  const { orgDetails } = useContext(Orgcontext)
  
  const privacyPolicyBtn = () => {
    window.open('./PrivacyPolicy.pdf', '_blank');
  };

  const TermsBtn = () => {
    window.open('./Terms.pdf', '_blank');
  };

  const teamBtn = () => {
    // setIsVisible(!isVisible); // Toggle the visibility of the matrix
    window.open('./driver', '_self');
  };

  const faqBtn = () => {
    window.open('./FAQ.pdf', '_blank');
  };

  return (
    <footer className={`legalbanner mt-[15px] print:hidden`}>
      <div className="general">
        <div className="social-icons flex flex-row justify-center">
          <a className="mr-3" href="mailto:support@drophouse.art"><img src="/contact.svg" alt="Email" /></a>
          <a className="ml-3 mr-3" href="https://www.instagram.com/drophousegenai/" target='_blank'><img src="/instagram.svg" alt="Instagram" /></a>
          <a className="ml-3" href="https://twitter.com/RoseHulman?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor"><img src="/xtwitter.svg" alt="X" /></a>
        </div>
        <div className="legal-links">
          <h4 style={{fontFamily : `${orgDetails.font}`, color : `${orgDetails.theme_color}`}} onClick={privacyPolicyBtn}> PRIVACY </h4>
          <h4 style={{fontFamily : `${orgDetails.font}`, color : `${orgDetails.theme_color}`}} onClick={TermsBtn}> TERMS </h4>
          <h4 style={{fontFamily : `${orgDetails.font}`, color : `${orgDetails.theme_color}`}} onClick={teamBtn}> TEAM </h4> 
          <h4 style={{fontFamily : `${orgDetails.font}`, color : `${orgDetails.theme_color}`}} onClick={faqBtn}> FAQ </h4>
        </div> 
      </div>
    </footer>
  );
};

export default Legal;
