import React, { useContext } from "react";
import step1 from "../assets/step1.png";
import step1_std from "../assets/step1_std.png"
import step2 from "../assets/Step-2-new.png";
import step2_std from "../assets/step2_std.png"
import step3 from "../assets/Step-3-new.png";
import step3_std from "../assets/step3_std.png"
import { Orgcontext } from "../context/ApiContext";

function StepCard({ title, description, image, index }) {
  const { orgDetails } = useContext(Orgcontext)
  return (
    <div className="flex flex-col justify-center items-center self-center w-full h-full border-2 bg-[#29272f] text-white rounded-[12px] px-2 py-2">
      <div className="flex flex-row w-full justify-start px-2">
        <div className="mr-2 text-[#ffffff] whitespace-nowrap">
          {/* <span>Step </span> */}
          <span style={{fontFamily : `${orgDetails[0].font}`}} className={`text-bold text-lg`}>{index}.</span>
        </div>
        <div style={{fontFamily : `${orgDetails[0].font}`}} className={`text-color text-bold text-lg`}>{title}</div>
      </div>

      <div className="w-full">
        <img src={image} alt={title} />
      </div>

      <div style={{fontFamily : `${orgDetails[0].font}`}} className={`text-bold text-lg`}>{description}</div>
    </div>
  );
}

export default function StepCards({
}) {
  const StepCardList = [
    {
      index: 1,
      title:
        "Describe your drop ",
      description: "",
      image: (window.innerWidth <= 544) ? step1_std : step1,
      marginBottom: 1,
      marginBottomMD: 32,
    },
    {
      index: 2,
      title: "Pick a description",
      description: "",
      image: (window.innerWidth <= 544) ? step2_std : step2,
      marginBottom: 1,
      marginBottomMD: 32,
    },
    {
      index: 3,
      title:
        "Customize your drop",
      description: "",
      image: (window.innerWidth <= 544) ? step3_std : step3,
      marginBottom: 1,
      marginBottomMD: 32,
    },
  ];

  return (
    <>
      {StepCardList.map((step, index) => {
        return (
          <div
            style={{
              position: "sticky",
              top: `${10 + index * 5}%`,
            }}
            key={index}
          >
            <StepCard
              title={step.title}
              description={step.description}
              image={step.image}
              index={step.index}
            />

          </div>
        );
      })}
    </>
  );
}
