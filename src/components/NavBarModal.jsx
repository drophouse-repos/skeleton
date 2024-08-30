import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Orgcontext } from "../context/ApiContext";

const NavBarModal = ({ onClose, user, handleSignOut }) => {
  const { orgDetails } = useContext(Orgcontext)
  const navigate = useNavigate();

  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      id="modal-overlay"
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div
        onClick={handleModalClick}
        className="absolute top-14 right-4 p-6 bg-gray-200 rounded-lg shadow-lg max-w-sm w-full z-50 overflow-y-auto" // Changed max-w-md to max-w-sm for a thinner modal
      >
         <div className="absolute top-0 right-0 p-4 cursor-pointer" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-purple-800 flex items-center justify-center text-white text-2xl font-medium"
          style={{fontFamily : `${orgDetails.font}`}}> 
            {user.firstName ? user.firstName.charAt(0) : '?'}
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <h2 className="text-md md:text-lg text-gray-900 flex-1 text-center" style={{fontFamily : `${orgDetails.font}`}}>
            Hi, {user.firstName}!
          </h2>
        </div>
        
        <h4 className="text-sm text-gray-900 mb-6 mt-2 text-center" style={{fontFamily : `${orgDetails.font}`}}>
          {user.email}
        </h4>
        
        
        <div className="flex space-x-4 mb-1 justify-center">
          <button
            onClick={() => {
                navigate("/user")
                onClose()
            }}
            className="py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded text-white text-lg font-bold"
            style={{fontFamily : `${orgDetails.font}`, backgroundColor: `${orgDetails.theme_color}`}}
          >
            View Details
          </button>
  
          <button
            onClick={()=> {
                handleSignOut()
                navigate("/")
                onClose()
            }}
            className="py-2 px-4 border border-black text-black hover:bg-gray-100 rounded bg-transparent text-lg"
            style={{fontFamily : `${orgDetails.font}`}}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBarModal;
