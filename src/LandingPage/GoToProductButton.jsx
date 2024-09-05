import React from "react";
import { useContext } from "react";
import { AppContext } from '../context/AppContext';
import { useNavigate } from "react-router-dom";
import { Orgcontext } from "../context/ApiContext";

const GoToProductButton = ({ text, link, className, type, color }) => {
    const { orgDetails }= useContext(Orgcontext)
    const { apparel, setApparel, setColor } = useContext(AppContext);
    const navigate = useNavigate();

    function handleButtonClick() {
        setColor(color);
        setApparel(type);
        navigate(link);
    }

    return (
        <button style={{fontFamily : `${orgDetails.font}`, backgroundColor : `${orgDetails.theme_color}`}} className={`${(window.innerWidth <= 544) ? `btn-mbl`: ``} font-bolder tracking-wider text-xl ${className}`} onClick={handleButtonClick}>
            {text}
        </button>
    );
};

export default GoToProductButton;
