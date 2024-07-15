import React, { useContext, useState } from "react";


import GoToProductButton from "./GoToProductButton";

import "./ProductCard.css";
import { Orgcontext } from "../context/ApiContext";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export default function ProductCard({ product, changeInterval, type }) {
    const { orgDetails }= useContext(Orgcontext)
    console.log("product name or type : ",product.type)

    const [RandomImageUpdateCount, setRandomImageUpdateCount] = useState(0);
    const [SequentialImageUpdateCount, setSequentialImageUpdateCount] = useState(0);

    function RandomImageCarousel({ imageList, name }) {
        let source = imageList[getRandomInt(imageList.length)];
        return <img className="landing-random-image" src={source} alt={`${name} - ${RandomImageUpdateCount}`} />;
    }

    function SequentialImageCarousel({ imageList, name }) {

        let source = imageList[SequentialImageUpdateCount % imageList.length];
        return <img className="landing-random-image" src={source} alt={`${name} - ${SequentialImageUpdateCount}`} />;
    }

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="flex flex-col h-full items-center justify-center my-2 py-2 rounded-[20px] bg-gradient-to-br from-[#FFFFFF] to-[#FFFEF2] mx-3 pb-5">
                <div className="w-4/5 flex flex-col h-full items-center">
                    <div className="flex justify-center h-full">
                        <SequentialImageCarousel
                            imageList={product.imageList}
                            name={product.name}
                        />
                    </div>


                    <div className="flex flex-col justify-center items-center w-full rounded-[20px] bg-white px-2 mx-5 mt-auto">
                        <div style={{fontFamily : `${orgDetails[0].font}`}} className={`tracking-wide text-gray-900 font-bold my-3`}>
                            {product.name}
                        </div>

                        <div style={{fontFamily : `${orgDetails[0].font}`}} className={`text-bold tracking-wide text-xl text-black font-extrabold`}>
                            ${product.price.toFixed(2)}
                        </div>

                        <div className="flex justify-center items-center place-self-center pt-2 w-full">
                            <GoToProductButton text="Design Now" link={"/product"} className={`text-white rounded-[20px] px-5`} type={product.type} color={product.color} />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};