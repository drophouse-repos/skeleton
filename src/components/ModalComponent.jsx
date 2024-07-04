import React, { useContext, useState } from 'react';
import { Orgcontext } from '../context/ApiContext';

const ModalComponent = ({ aiSuggestions, onClose, onSelectExample }) => {
  const { orgDetails }  = useContext(Orgcontext)

  // Function to handle the selection of a prompt
  const handleClickPrompt = (promptText) => {
    onSelectExample(promptText, promptIndex); // This will close the modal and set the prompt text
  };

  const [promptIndex, setPromptIndex] = useState(0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4 z-50 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full overflow-y-auto max-h-[80vh]">
        <div className="x-full relative mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 cursor-default" style={{fontFamily : `${orgDetails[0].font}`}}>Select one of the options</h2>
          <span className="absolute w-6 h-6 text-black material-symbols-outlined align-middle cursor-pointer top-[-10px] right-[-10px]" onClick={onClose}>close</span>
        </div>
        <ul className="list-none space-y-2 mb-3 text-sm md:text-base">
        {aiSuggestions.Prompts.map((prompt, index) => {
          const textToShow = prompt[`Prompt${index + 1}`];
          let textLabel = null;
          let marginBottomClass = "mb-1";
          if (index === 0)
            textLabel = "Your Description";
          else if(index === 1) {
            textLabel = "AI Suggested";
            // Adjusted class for reduced margin-bottom for "AI Suggested" label
            marginBottomClass = "mb-0"; // This will remove the margin bottom completely
          }
          return (
            <div key={index}>
              {textLabel && <p className={`text-left ${marginBottomClass} font-semibold text-md`} style={{fontFamily : `${orgDetails[0].font}`}}>{textLabel}</p>}
              <li className={`cursor-pointer border border-teal-500 rounded p-2 flex flex-col hover:bg-teal-50 ${index === promptIndex ? "bg-teal-50" : ""}`}>
                <p className={`hover:text-teal-600 ${index === promptIndex ? "text-black" : "text-gray-500"} text-lg font-[400]`} onClick={() => setPromptIndex(index)}
                  style={{fontFamily : `${orgDetails[0].font}`}}
                >
                  {textToShow}
                </p>
              </li>
            </div>
          );
        })}
        </ul>
        <button onClick={() => {
          handleClickPrompt(aiSuggestions.Prompts[promptIndex][`Prompt${promptIndex + 1}`])
        }} className="py-2 px-4 bg-teal-500 hover:bg-teal-600 rounded text-white w-full font-bold text-lg"
        style={{fontFamily : `${orgDetails[0].font}`}}>
          Apply
        </button>
      </div>
    </div>
  );
};

export default ModalComponent;
