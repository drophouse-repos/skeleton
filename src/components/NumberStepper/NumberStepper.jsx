import React from "react"
import "./NumberStepper.css"

function NumberStepper({num, setNum, className}){
    return (
        <div className={`input-group input-number-group ${className}`}>
            <div className="input-group-button">
            <span className="input-number-decrement" onClick={()=>setNum(num == 0 ? 0 : num-1)}>-</span>
            </div>
            <input className="input-number" type="number" value={num.toString()} min="0" max="1000" onChange={()=>{}}/>
            <div className="input-group-button">
            <span className="input-number-increment" onClick={()=>setNum(num+1)}>+</span>
            </div>
        </div>
    )
};

export default NumberStepper;
