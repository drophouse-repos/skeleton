import React from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";


const InfoButton = ({link, className}) => {
    const navigate = useNavigate();

      return (
        <InfoCircleOutlined
          className={className}
          onClick={() => {navigate(link);}} 
        />
      );
    }
  
export default InfoButton;