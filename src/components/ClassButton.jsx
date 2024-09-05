import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Orgcontext } from "../context/ApiContext";

const ClassButton = ({ text, link, className, onClick }) => {
    const navigate = useNavigate();
    const {orgDetails} = useContext(Orgcontext)

    function handleButtonClick() {
        if (!onClick) {
            navigate(link);
        } else {
            onClick();
        }
    }

    return (
        <button style={{fontFamily : `${orgDetails.font}`, backgroundColor: `${orgDetails.theme_color}`}} className={className} onClick={handleButtonClick}>
            {text}
        </button>
    );
};

export default ClassButton;
