import React from "react";

const ClassTextArea = ({ className, onChange, placeholder }) => {

    const defaultClassName = "border-2 border-neutral-300 w-full h-24 p-2 focus:outline-none focus:border-primary-500";
    return (
        <textarea className={className ? className : defaultClassName} onChange={
            (e) => {
                onChange(e.target.value);
            }
        } placeholder={placeholder} />
    );
};

export default ClassTextArea;
