import React, { useContext, useState, useEffect } from "react";
import GoToProductButton from "./GoToProductButton";
import "./ProductCard.css";
import { Orgcontext } from "../context/ApiContext";
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
    const { orgDetails, galleryPage } = useContext(Orgcontext);
    const [isMobile, setIsMobile] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const navigate = useNavigate();

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

    const handleImageClick = () => {
        if (isMobile) {
            if (!isFlipped) {
                setIsFlipped(true);
            } else {
                // Navigate to the product page
                const link = galleryPage ? "/product/gallery" : "/product";
                navigate(link);
            }
        } else {
            // On desktop, navigate to the product page
            const link = galleryPage ? "/product/gallery" : "/product";
            navigate(link);
        }
    };

    return (
        <div className="product-card">
            <div className="product-card__container">
                <div className="product-card__image-wrapper" onClick={handleImageClick}>
                    <div className={`product-card__image-container ${isFlipped ? "flipped" : ""}`}>
                        <img
                            className="product-card__image"
                            src={product.imageList_front[0]}
                            alt={`${product.name}`}
                        />
                        <img
                            className="product-card__image product-card__image--back"
                            src={product.imageList_back[0] || product.imageList_front[0]}
                            alt={`${product.name}`}
                        />
                    </div>
                </div>

                <div className="product-card__details">
                    <h2 className="product-card__name" style={{ fontFamily: orgDetails.font }}>
                        {product.name}
                    </h2>

                    <h2 className="product-card__price" style={{ fontFamily: orgDetails.font }}>
                        ${product.price.toFixed(2)}
                    </h2>

                    <div className="product-card__button-container">
                        <GoToProductButton
                            text="Design Now"
                            link={galleryPage ? "/product/gallery" : "/product"}
                            className="product-card__button"
                            type={product.type}
                            color={product.color}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
