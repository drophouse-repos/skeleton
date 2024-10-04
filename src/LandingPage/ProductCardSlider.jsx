import React from "react";
import Slider from "react-slick";
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import ProductCard from "./ProductCard";
import "./ProductCardSlider.css";

export default function ProductCardSlider({ products, ImageChangeInterval }) {
  function NextArrow(props) {
    const { className, onClick } = props;
    return (
      <div className={`${className}`} onClick={onClick}>
        <RightCircleOutlined />
      </div>
    );
  }

  function PrevArrow(props) {
    const { className, onClick } = props;
    return (
      <div className={`${className}`} onClick={onClick}>
        <LeftCircleOutlined />
      </div>
    );
  }

  function Paging() {
    return <div className="bg-gray-300 w-4 h-2"></div>;
  }

  const productLength = products.length;
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: productLength >= 4 ? 4 : productLength,
    slidesToScroll: 1,
    swipeToSlide: true, // Added to allow swiping to the next slide more easily
    touchThreshold: 10, // Reduced to make the swipe more sensitive
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    customPaging: Paging,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: productLength >= 3 ? 3 : productLength,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          swipeToSlide: true,
          touchThreshold: 10,
        },
      },
    ],
  };

  return (
    <Slider {...settings} id="landing-product-slider" className="product-card-slider">
      {products.map((product, index) => (
        <ProductCard key={index} product={product} changeInterval={ImageChangeInterval} />
      ))}
    </Slider>
  );
}
