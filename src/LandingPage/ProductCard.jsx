import React, { useContext, useState, useEffect } from "react";
import GoToProductButton from "./GoToProductButton";
import "./ProductCard.css";
import { Orgcontext } from "../context/ApiContext";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export default function ProductCard({ product, changeInterval, type }) {
    const { orgDetails } = useContext(Orgcontext);

    const [isMobile, setIsMobile] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    const [SequentialImageUpdateCount, setSequentialImageUpdateCount] = useState(0);

    // Detect if the user is on a mobile device
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768); // Example breakpoint for mobile
        };

        // Check on initial render
        checkIfMobile();

        // Update when window is resized
        window.addEventListener("resize", checkIfMobile);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener("resize", checkIfMobile);
        };
    }, []);

    // Toggle flip for mobile devices on click
    const toggleFlip = () => {
        if (isMobile) {
            setIsFlipped(!isFlipped);
        }
    };

    function SequentialImageCarousel({ imageList_front, imageList_back, name }) {
        let source_front = imageList_front[SequentialImageUpdateCount % imageList_front.length];
        let source_back = imageList_back[SequentialImageUpdateCount % imageList_back.length];

        return (
            <div
                className={`image-container-main flex w-full`}
                onClick={toggleFlip}
            >
                <div className={`image-container ${isFlipped ? "flipped" : ""}`}>
                    <img
                        className="landing-random-image"
                        src={source_front}
                        alt={`${name} - ${SequentialImageUpdateCount}`}
                    />
                    <img
                        className="back-img"
                        src={source_back ? source_back : source_front}
                        alt={`${name} - ${SequentialImageUpdateCount}`}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center card-product-slider h-full">
            <div className="flex flex-col w-11/12 h-full items-center justify-center my-2 py-2 rounded-[10px] bg-white rounder-md mx-3 pb-0">
                <div className="w-full flex flex-col h-full items-center">
                    <div className="flex justify-center h-full w-full">
                        <SequentialImageCarousel
                            imageList_front={product.imageList_front}
                            imageList_back={product.imageList_back}
                            name={product.name}
                        />
                    </div>

                    <div className="flex flex-col text-left bg-white justify-center items-center w-full rounded-t-none rounded-md pt-0 pb-0 py-2.5 m-0 mt-auto">
                        <h2
                            style={{
                                fontFamily: `${orgDetails.font}`,
                                display: "flex",
                                width: "100%",
                                justifyContent: "center",
                                paddingLeft: "6px",
                            }}
                            className={`tracking-wide text-gray-600 font-bold m-0`}
                        >
                            {product.name}
                        </h2>

                        <h2
                            style={{
                                fontFamily: `${orgDetails.font}`,
                                display: "flex",
                                width: "100%",
                                justifyContent: "center",
                                paddingLeft: "6px",
                            }}
                            className={`text-bold text-left tracking-wide text-xl text-black font-extrabold`}
                        >
                            ${product.price.toFixed(2)}
                        </h2>

                        <div className="flex justify-left items-center place-self-center pb-0 pt-2 w-full">
                            <GoToProductButton
                                text="Design Now"
                                link={"/product"}
                                className={`rounded-t-none buy-btn-slider text-white w-full rounded-[5px] px-16 py-2.5`}
                                type={product.type}
                                color={product.color}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
