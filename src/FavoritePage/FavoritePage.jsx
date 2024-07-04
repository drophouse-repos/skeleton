import React, { useState, useEffect, useContext } from 'react';
import "./FavoritePage.css";
import { fetchCartItems, fetchFavoriteImages, fetchPostLike, fetchImageUrl, fetchImageBase64 } from '../utils/fetch'; // Ensure you import fetchDeleteImage
import { useNavigate } from 'react-router-dom'; // Correct import from 'react-router-dom'
import { ImageContext } from '../context/ImageContext';
import { AppContext } from '../context/AppContext';
import { LeftCircleOutlined} from "@ant-design/icons";
import {Loading} from '../components/LoadingComponent/Loading';
import { Orgcontext } from '../context/ApiContext';

const FavoritePage = () => {
  const { orgDetails } = useContext(Orgcontext)
  const [likedProducts, setLikedProducts] = useState([]);
  const { setGeneratedImage, setIsLiked, setEditedImage, setImageToCart} = useContext(ImageContext);
  const { setPrompt } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [cartData, setCartData] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    fetchFavoriteImages(setLikedProducts, navigate).then(()=>{
      setIsLoading(false);
    })
  }, [navigate]);

  let cart_map = {};
  useEffect(() => {
    setIsLoading(true);
    fetchCartItems(navigate).then(items => {
      setIsLoading(false);

      for(var i in items.cart){
        var _imgid = (items.cart[i] && items.cart[i].img_id) ? items.cart[i].img_id.split('_')[0] : i; 
        cart_map[_imgid] = items.cart[i];
      }
      setCartData(cart_map);
    })
  }, [navigate]);

  const handleImageClick = async (signed_url, prompt, img_id, bought) => {
    if (bought) {
      return;
    }
    const url = await fetchImageUrl(img_id, navigate);
    const imageBase64 = await fetchImageBase64(url);
    setGeneratedImage({ photo: imageBase64, altText: prompt, img_id: img_id });
    setEditedImage(imageBase64);
    setPrompt(prompt);
    setIsLiked(true);
    setImageToCart((cartData && cartData[img_id]) ? true : false)
    navigate('/product');
  };

  const handleDeleteImage = async (img_id, prompt, event) => {
    event.stopPropagation(); // Prevent the image click handler from firing
    try {
      setLikedProducts(likedProducts.filter(product => product.img_id !== img_id));
      await fetchPostLike(false, img_id, prompt);
    } catch (error) {
      console.error("Failed to delete image", error);
    }
  };

  return (
    isLoading ? <Loading/> :
    <div className="mt-12 w-full min-h-[80vh] mt-20">
    <div className={`header-container px-20 ${likedProducts.length === 0? 'hidden' : ''}`} >
      <button 
      onClick={() => navigate(-1)}
      className="flex back-button py-1 px-0"
      >
        <LeftCircleOutlined style={{ fontSize: '20px', marginRight: "1em", paddingTop: '3px'}} />
        <div className="text-lg" style={{fontFamily : `${orgDetails[0].font}`}}>Back To Products</div>
      </button>
      <div></div> 
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
      {likedProducts.map((product) => (
        <div key={product.img_id} className="max-w-sm mx-auto">
          <div 
            onClick={() => handleImageClick(product.signed_url, product.prompt, product.img_id, product.bought)} 
            className={`cursor-pointer relative ${product.bought ? 'opacity-50' : ''}`}
          >
            <img 
              src={product.signed_url} 
              alt={product.prompt} 
              loading="lazy" 
              className="w-full h-auto object-cover rounded-lg shadow-md" 
            />
            {product.bought && (
              <div className="absolute top-0 left-0 mt-2 ml-2 text-white bg-green-500 font-bold py-1 px-2 rounded"
               style={{fontFamily : `${orgDetails[0].font}`}}>
                Bought
              </div>
            )}
            <button 
              onClick={(event) => handleDeleteImage(product.img_id, product.prompt, event)}
              className="absolute top-0 right-0 mt-2 mr-2 text-white bg-red-500 hover:bg-red-700 font-bold py-1 px-2 rounded"
              style={{fontFamily : `${orgDetails[0].font}`}}
            >
              Delete
            </button>
          </div>
          <div className="mt-2">
            <p className="text-xl text-center text-gray-700" style={{fontFamily : `${orgDetails[0].font}`}}>{product.prompt}</p>
          </div>
        </div>
      ))}
    </div>
    <div className={`${likedProducts.length === 0? '' : 'hidden'} w-full col-span-6`}>
        <div className='text-lg md:text-2xl mb-2 mt-16' style={{fontFamily : `${orgDetails[0].font}`}}>Empty Favorite Product</div>
        <div className='text-lg md:text-2xl mb-10' style={{fontFamily : `${orgDetails[0].font}`}}>Please go to add your design.</div>
        <button className='bg-sky-600 text-zinc-100 font-extrabold py-2 px-4 rounded-full w-[10rem] mb-10 text-lg' onClick={(e) =>  navigate('/product')} 
        style={{fontFamily : `${orgDetails[0].font}`, backgroundColor: `${orgDetails[0].theme_color}`}}>Design Now</button>
    </div>
  </div>
  );
};

export default FavoritePage;
