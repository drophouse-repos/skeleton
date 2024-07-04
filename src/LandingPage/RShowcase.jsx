import { useEffect, useState } from "react";
import { motion, useAnimate, AnimatePresence } from "framer-motion"
import LazyLoad from 'react-lazyload';
import { set } from "mnemonist";
import e from "cors";

const preload_image = require(`../${process.env.REACT_APP_COLLEGE_LOGO_PATH_PRELOADIMAGE}`);
export default function RShowcase({imageList, changeInterval, RMask}) {
    const [currentImage1, setCurrentImage1] = useState(0);
    const [currentImage2, setCurrentImage2] = useState(1);
    const [image1, imageAnimate1] = useAnimate()
    const [image2, imageAnimate2] = useAnimate()

    let autoUpdateCounter = 0;

    useEffect(() => {

        setCurrentImage1((autoUpdateCounter) % imageList.length);
        autoUpdateCounter += 1;
        setCurrentImage2((autoUpdateCounter) % imageList.length);
        autoUpdateCounter += 1;
        const intervalInstance = setInterval(() => {

            if(autoUpdateCounter % 2 === 0){
                imageAnimate1(image1.current, {
                    opacity: [1, 0],
                    transition: {
                        ease: "easeInOut",
                        duration: changeInterval / 1000, 
                        times: [0, 0.8]
                    },
                })
                imageAnimate2(image2.current, {
                    opacity: [0, 1],
                    transition: {
                        ease: "easeInOut",
                        duration: changeInterval / 1000, 
                        times: [0, 0.2]
                    },
                })

                setCurrentImage2((autoUpdateCounter) % imageList.length);
                autoUpdateCounter += 1;

            } else {
                imageAnimate1(image1.current, {
                    opacity: [0, 1],
                    transition: {
                        ease: "easeInOut",
                        duration: changeInterval / 1000, 
                        times: [0, 0.2]
                    },
                })
                imageAnimate2(image2.current, {
                    opacity: [1, 0],
                    transition: {
                        ease: "easeInOut",
                        duration: changeInterval / 1000, 
                        times: [0, 0.8]
                    },
                })

                setCurrentImage1((autoUpdateCounter) % imageList.length);
                autoUpdateCounter += 1;
            }

        }, changeInterval || 5000);

        return () => clearInterval(intervalInstance);
    }, []);


    return (
        <div className="relative w-[50%]">
            <img
                src={RMask}
                alt="mask"
                style={{
                    position: "absolute",
                    left: "auto",
                    right: "auto",
                    transform: "scale(1.01)",
                    zIndex: 2,
                }}
            />
            
            <img
                ref={image1}
                src={imageList[currentImage1]}
                alt="generated image"
                style={{ 
                    position: "absolute", 
                    left: "auto",
                    right: "auto",
                    zIndex: 1
                }}
            />

            <img
                ref={image2}
                src={imageList[currentImage2]}
                alt="generated image"
                style={{ 
                    position: "absolute",
                    left: "auto",
                    right: "auto",
                    zIndex: 1
                }}
            />

            <img
                src={preload_image}
                alt="Placeholder"
                style={{ zIndex: 0, opacity: 0.75}}
            />

        </div>
    );
}
