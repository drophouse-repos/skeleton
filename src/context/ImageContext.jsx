import React, { createContext, useState, useEffect } from 'react';
import { loadState } from '../utils';

export const ImageContext = createContext();

export const getCurrentImageState = () => {
  return loadState('imageState', { isGenerating: false, generatedImage: { photo: null, altText: null, img_id: null }}, 'imageState');
};

export const ImageProvider = ({ children }) => {
    const [isGenerating, setIsGenerating] = useState(loadState('isGenerating', false, 'imageState'));
    const [generatedImage, setGeneratedImage] = useState(loadState('generatedImage', { photo: null, altText: null, img_id: null }, 'imageState'));
    const [isLiked, setIsLiked] = useState(loadState('isLiked', false, 'imageState'));
    const [editedImage, setEditedImage] = useState(loadState('editedImage', null, 'imageState'));
    const [thumbnailsrc, setThumbnailsrc] = useState(loadState('thumbnailsrc', null, 'imageState'));
    const [isImageToCart, setImageToCart] = useState(loadState('isImageToCart', false, 'imageState'));

    useEffect(() => {
      const state = { isGenerating, generatedImage, isLiked, editedImage, thumbnail: thumbnailsrc, isImageToCart};
      sessionStorage.setItem('imageState', JSON.stringify(state));
    }, [isGenerating, generatedImage, isLiked, editedImage, thumbnailsrc, isImageToCart]);
    
    useEffect(() => {
      setIsGenerating(false); 
    }, []);

    const contextValue = {
      isGenerating,
      setIsGenerating,
      generatedImage,
      setGeneratedImage,
      isLiked, 
      setIsLiked,
      editedImage,
      setEditedImage,
      thumbnailsrc,
      setThumbnailsrc,
      isImageToCart,
      setImageToCart
    };

    return (
      <ImageContext.Provider value={contextValue}>
        {children}
      </ImageContext.Provider>
    );
};
