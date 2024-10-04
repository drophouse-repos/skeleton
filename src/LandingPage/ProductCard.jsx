import React, { useContext, useState } from "react";
import GoToProductButton from "./GoToProductButton";
import "./ProductCard.css";
import { Orgcontext } from "../context/ApiContext";

export default function ProductCard({ product }) {
  const { orgDetails, galleryPage } = useContext(Orgcontext);
  const [isFlipped, setIsFlipped] = useState(false);

  // Check if a back image is available
  const backImageUrl =
    Array.isArray(product.imageList_back) &&
    product.imageList_back[0] &&
    product.imageList_back[0].trim() !== ""
      ? product.imageList_back[0]
      : null;
  const hasBackImage = !!backImageUrl;

  const handleImageClick = () => {
    if (hasBackImage) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleMouseEnter = () => {
    if (hasBackImage) {
      setIsFlipped(true);
    }
  };

  const handleMouseLeave = () => {
    if (hasBackImage) {
      setIsFlipped(false);
    }
  };

  return (
    <div className="product-card">
      <div className="product-card__container">
        <div
          className="product-card__image-wrapper"
          onClick={handleImageClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img
            className="product-card__image"
            src={isFlipped && hasBackImage ? backImageUrl : product.imageList_front[0]}
            alt={product.name}
          />
        </div>

        <div className="product-card__details">
          <h2
            className="product-card__name"
            style={{ fontFamily: orgDetails.font }}
          >
            {product.name}
          </h2>

          <h2
            className="product-card__price"
            style={{ fontFamily: orgDetails.font }}
          >
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
