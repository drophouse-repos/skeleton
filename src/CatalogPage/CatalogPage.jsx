import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Correct import from 'react-router-dom'
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { fetchFavoriteImages } from '../utils/fetch';
import './CatalogPage.css';

const CatalogPage = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const catalogRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavoriteImages(setImages, navigate);
  }, []);

  const handleMouseDown = () => {
    isDraggingRef.current = true; // Set dragging state to true
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false; // Set dragging state to false
  };

  const handleMouseMove = (e) => {
    if (isDraggingRef.current) { // Only update crop when dragging
      setCrop((prevCrop) => ({
        x: prevCrop.x + e.movementX,
        y: prevCrop.y + e.movementY,
      }));
    }
  };

  // const applyMask = (canvas, mask) => {
  //   console.log("applyMask called")
  //   const ctx = canvas.getContext('2d');

  //   console.log("maskImgSrc", mask.src)
    
  //   // Apply the mask
  //   ctx.globalCompositeOperation = 'destination-in';
  //   ctx.drawImage(mask, 0, 0, canvas.width, canvas.height);

  //   // Reset composite operation
  //   ctx.globalCompositeOperation = 'source-over';

  //   // return canvas.toDataURL();
  // };

  const handleImageClick = (image) => {
    // Create a canvas to apply the mask
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    
    if (!canvasRef.current) {
      canvasRef.current = canvas;
    }
  
    // Load the selected image
    const img = new Image();
    // img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.drawImage(img, 0, 0);  
        // Update the image in the state
        // const updatedImages = images.map((img) =>
        //   img.img_id === image.img_id
        //     ? { ...img, signed_url: maskedImageData }
        //     : img
        // );

        setSelectedImage(image); // Set the selected image
        console.log("selected image: ", selectedImage);
        if (image.crop) { 
          setCrop(image.crop);
        } else {
          setCrop({ x: 0, y: 0 });
        }
      };
      // maskImg.src = "/moody_mask.png";
      // console.log("maskImg.src", maskImg.src)
      img.src = image.signed_url;
      console.log("image.signed_url", image.signed_url);
  };

  const handleSave = () => {
    if (selectedImage) {
      // Update the image with the crop information
      const updatedImages = images.map((img) =>
        img.img_id === selectedImage.img_id
          ? { ...img, crop: crop, signed_url: canvasRef.current.toDataURL() }
          : img
      );
      setImages(updatedImages);
      setSelectedImage(null);
      canvasRef.current = null;
    }
  };  

  const generatePDF = async () => {
    const pdf = new jsPDF();
    const element = catalogRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');

    pdf.addImage(imgData, 'PNG', 0, 0);
    pdf.save('image-catalog.pdf');
  };

  return (
    <div className="container mx-auto p-4 mt-12">
      <h1 className="catalog-title text-3xl font-bold mt-4 mb-8">Image Catalog</h1>
      {/* <button 
        onClick={generatePDF}
        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Generate PDF Catalog
      </button> */}
      <div ref={catalogRef} className="catalog-print grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {images.map((image) => (
          <div key={image.img_id} className="image-container border p-4 rounded-lg shadow-md">
            <div className="relative w-full h-60">
              <img 
                src={image.signed_url} 
                alt={image.prompt}
                className="absolute top-[53%] left-[28%] w-28 h-28 object-cover mb-2 rounded cursor-pointer" 
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
      {/* {selectedImage && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <canvas
              width={500}
              height={500}
              style={{
                backgroundImage: `url(${selectedImage.signed_url})`,
                backgroundPosition: `${crop.x}px ${crop.y}px`
              }}
              onMouseMove={handleMouseMove}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
            />
            <div className="mt-4 flex justify-between">
              <button 
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Save
              </button>
              <button 
                onClick={() => setSelectedImage(null)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default CatalogPage;