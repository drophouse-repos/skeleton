// src/components/ProductCard.js
import React from 'react';
import { AppContext } from '../context/AppContext';
import { Orgcontext } from '../context/ApiContext';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import './ProductCard.css'; // We'll style the card later

const ProductCard = ({ product }) => {
  console.log(product)
  const { greenmask, setGreenmask } = useContext(Orgcontext)
  const { apparel, setApparel, setColor } = useContext(AppContext);
  const navigate = useNavigate();
  const handleclick = (_greenmask, type, link) => {
        setGreenmask(_greenmask)
        setColor("white");
        setApparel(type);
        navigate(link);
  }
    const hasBackImage = product.backImage && product.backImage.trim() !== '';
  return (
    <div className="product-card">
        <div className="image-container" onClick={()=> handleclick(product.greenmask, product.type, '/product')}>
        {/* <img src={product.image} alt={product.name} className="product-images" /> */}
        <img
          src={product.frontImage}
          alt={`${product.name} front`}
          className={`product-images ${hasBackImage ? 'front' : 'no-back'}`}
          style={{width: '325px', height:'375px'}}
        />
        {hasBackImage && (
          <img
            src={product.backImage}
            alt={`${product.name} back`}
            className="product-images back"
            style={{width: '325px', height:'375px'}}
          />
        )}
        {product.size && product.size.length > 0 && product.type && product.type != 'mug' && product.type != 'cap' && (
          <div className="product-sizes">
            <div className='size-box-parent'>
            {product.size.map((size, index) => (
              <div key={index} className="size-box">
                {size}
              </div>
            ))}
            </div>
            {/*<div className='add-btn' onClick={()=> handleclick(product.greenmask, product.type, '/product')}>Select</div>*/}
          </div>
        )}
      </div>
      <div>
        <h2 className="product-name">{product.name}</h2>
        <p className="product-price">${product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
