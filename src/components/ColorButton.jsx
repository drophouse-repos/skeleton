import React from "react";

// Correctly destructure the props in the function parameter
const ColorButton = ({ currentIndex, sliderRef }) => {
  const ColorBall = ({ color, highlight, onClick }) => {
    return (
      <div
        style={{
          backgroundColor: color,
          border: "1px solid grey",
          borderRadius: "50%",
          width: highlight ? "25px" : "18px",
          height: highlight ? "25px" : "18px",
        }}
        onClick={onClick}
      ></div>
    );
  };

  return (
    <div className="flex flex-row justify-center items-center space-x-5">
      <ColorBall
        color="white"
        highlight={currentIndex === 0}
        onClick={() => sliderRef.current.slickGoTo(0)}
      />
      <ColorBall
        color="black"
        highlight={currentIndex === 1}
        onClick={() => sliderRef.current.slickGoTo(1)}
      />
      <ColorBall
        color="#7d7d7d"
        highlight={currentIndex === 2}
        onClick={() => sliderRef.current.slickGoTo(2)}
      />
      <ColorBall
        color="#91000f"
        highlight={currentIndex === 3}
        onClick={() => sliderRef.current.slickGoTo(3)}
      />
    </div>
  );
}

export default ColorButton;
