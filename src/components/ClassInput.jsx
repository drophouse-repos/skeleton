import React from "react";

const ClassInput = ({ ref, className, onChange, placeholder, value }) => {

    const defaultClassName = "border-2 border-neutral-300 w-full h-10 p-2 focus:outline-none focus:border-primary-500";
    return (
        <input ref={ref} className={className ? className : defaultClassName} onChange={
            (e) => {
                onChange(e.target.value);
            }
        } placeholder={placeholder} value={value}/>
    );
};

export default ClassInput;
