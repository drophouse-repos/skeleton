import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './../assets/logo_footer_t.png';
import './Header.css';
import Home from './../assets/home.png'
import Info from './../assets/info.png'

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpand = () => {
      setIsExpanded(!isExpanded);
    };
    const goBack = () => {
        navigate('/');
    };
    const openPDF = (pdfName) => {
      const pdfPath = `/${pdfName}.pdf`;
      window.open(pdfPath, '_blank');
  };

  if (location.pathname === '/') {
    return null; // Do not render the Header
}

    const renderInfoBoxes = () => {
        if (isExpanded) {
          return (
            <div className="info-boxes">
              <div className="step-container">
                <div className="textbox">Step 1</div>
                <div className="step-description">Go to the prompt textbox and either input your desired prompt or utilize the shuffle button for suggestions. Click the "Generate" button to create your unique design. For guidance on crafting an effective prompt, select the "how to write a prompt" button below.</div>
                <div className="textbox">Step 2</div>
                <div className="step-description">Choose your preferred color, size, and apparel item. To learn more about available sizes and apparel options, click the "Product information or Size information" button.</div>
                <div className="textbox">Step 3</div>
                <div className="step-description">Proceed by clicking the "Reserve" button.</div>
              </div>
              <div className="info-box" onClick={() => openPDF('ApparelInfo')}>Product Information</div>
              <div className="info-box" onClick={() => openPDF('ApparelSize')}>Size Information</div>
              <div className="info-box" onClick={() => openPDF('PromptGuide')}>How to write a prompt</div>
                </div>
          );
        }
    };
    return (
        <div className={`header ${isExpanded ? 'expanded' : ''}`}>
            <img  src={Home}  alt='home'  className={location.pathname === '/' ? 'home' : 'home nothome'}  onClick={goBack} />
            <img src={Logo} alt='drophouse logo' className='logo'   />
            <img src={Info} alt="info" className={isExpanded ? 'info' : 'notinfo'} onClick={toggleExpand} />
            {renderInfoBoxes()}
        </div>
    );
};
export default Header;