import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFavoriteImages } from '../utils/fetch';
import './CatalogPage.css';

const CatalogPage = () => {
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavoriteImages(setImages, navigate);
  }, []);

  return (
    <div className="container mx-auto p-4 mt-12">
      <h1 className="catalog-title text-3xl font-bold mt-4 mb-8">Image Catalog</h1>
      <div className="catalog-print grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {images.map((image) => (
          <div key={image.img_id} className="image-container border p-4 rounded-lg shadow-md">
            <div className="relative w-full h-60">
              <img 
                src={image.signed_url} 
                alt={image.prompt}
                className="absolute top-[45.5%] left-[24.5%] w-32 h-32 object-cover mb-2 rounded cursor-pointer" 
                onClick={() => handleImageClick(image)}
              />
              <img
                src="/moody_mask.png"
                className="absolute inset-0 z-10 w-full h-full object-cover bg-transparent pointer-events-none"
              />
            </div>
            <p className="text-sm mt-2">{image.prompt}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogPage;