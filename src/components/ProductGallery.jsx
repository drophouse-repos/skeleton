import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import { useContext, useMemo } from "react";
import { AppContext } from '../context/AppContext';
import { ImageContext } from '../context/ImageContext';
import {   mapColorToIndex } from '../utils';
import ProductGalleryFooter from "./ProductGalleryFooter";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ZoomItem from "../zoomernew/zoom";
import html2canvas from 'html2canvas';
import "./ProductGallery.css"
import { MessageBannerContext } from "../context/MessageBannerContext";
import { HeartOutlined, HeartFilled, EditFilled } from "@ant-design/icons";
import { fetchIsLiked, fetchPostLike } from "../utils/fetch";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { enhanceImageClarity } from '../utils/enhanceImageClarity';
import { Orgcontext } from '../context/ApiContext';
import ZoomIcon from '../assets/zoom.png';
const ProductGallery = forwardRef(({ onChange, setToggled, setToggleActivated, currentIndex, setCurrentIndex, changeFromMug, isZoomEnabled, setIsZoomEnabled }, ref) => {
  if(currentIndex == undefined || currentIndex == null)
    setCurrentIndex(0)
  const { apparel, setApparel, color, setColor, prompt } = useContext(AppContext);
  const [slideIndex, setSlideIndex] = useState(0);
  // const [currentIndex, setCurrentIndex] = useState(mapColorToIndex(apparel, color));
  const { generatedImage, isLiked, setIsLiked, editedImage, setEditedImage } = useContext(ImageContext);
  const editedImageRef = useRef(null);
  const { product, orgDetails, favicon } = useContext(Orgcontext);
  const [productListLoad, setProductListLoad] = useState([]);
  const [productImageList, setProductImageList] = useState([]);
  const [dimTop, setDimTop] = useState();
  const [dimLeft, setDimLeft] = useState();
  const [dimHeight, setDimHeight] = useState();
  const [dimWidth, setDimWidth] = useState();
  const [dimArray, setDimArray] = useState({
    Dim_top: 0,
    Dim_left: 0,
    Dim_height: 0,
    Dim_width: 0
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [imgHeightZoom, setImgHeightZoom] = useState('80')
  useEffect(() => {
    const updateImageHeight = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth <= 768) {
        // Smaller screens (mobile)
        setImgHeightZoom('50');
      } else if (screenWidth <= 1024) {
        // iPad Pro size
        setImgHeightZoom('60');
      } else {
        // Laptop/Desktop
        setImgHeightZoom('80');
      }
    };

    updateImageHeight();
    window.addEventListener('resize', updateImageHeight);
    return () => {
      window.removeEventListener('resize', updateImageHeight);
    };
  }, []);

  const openModal = (image) => {
    setModalImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [zoomerImg, setZoomerImg] = useState();
  // console.log("favicon url : ",favicon)
  useEffect(() => {
    const fetchGeneratedImage = async () => {
      try {
        const photo = await generatedImage.photo;
        setZoomItemSrc(photo); // Assuming 'photo' is the correct property from generatedImage
      } catch (error) {
        console.error('Error fetching generated image:', error);
      }
    };
  
    fetchGeneratedImage();
  }, [generatedImage.photo,editedImage,editedImageRef,isZoomEnabled,]);
 

  useEffect(() => {
    if (product) {
      setProductListLoad(product);
    }
  }, [product]);
  const [indexColor, setIndexColor] = useState([]);

  useEffect(() => {
    const productList = Object.values(productListLoad)
    if(productList.length === 1){
    const productname = productList[0]?.Product_Name || []
    if(productname != apparel){
      setApparel(productname)
    }
  }
  },[productListLoad])

  useEffect(() => {
    if (productListLoad.length > 0 && apparel) {
      const productList = Object.values(productListLoad).filter(item => item.Product_Name === apparel);
  
      if (productList.length > 0) {
        const productListColour = productList[0]?.Product_Colors || [];
        const productImage = Object.values(productListColour).map(item => item.asset);
        const Dimension_height = productList[0].Product_Dimensions_Height;
        const Dimension_width = productList[0].Product_Dimensions_Width;
        const Dimension_top = productList[0].Product_Dimensions_Top;
        const Dimension_left = productList[0].Product_Dimensions_Left;
        setDimTop(Dimension_top);
        setDimLeft(Dimension_left);
        setDimHeight(Dimension_height);
        setDimWidth(Dimension_width);
        const { Product_Dimensions_Height, Product_Dimensions_Width, Product_Dimensions_Top, Product_Dimensions_Left } = productList[0];
        setDimArray({
          Dim_top: Product_Dimensions_Top,
          Dim_left: Product_Dimensions_Left,
          Dim_height: Product_Dimensions_Height,
          Dim_width: Product_Dimensions_Width
        });
        setProductImageList(productImage);
        setZoomerImg(productList[0].Product_Mask);
      } else {
        console.warn("No matching product found for the given apparel:", apparel);
      }
    }
  }, [productListLoad, apparel, currentIndex]);

  useEffect(() => {
    if (productListLoad.length > 0 && apparel) {
      const productList = productListLoad.filter(item => item.Product_Name === apparel);
      if (productList.length > 0) {
        const productListColour = productList[0].Product_Colors || [];
        const productColourName = Object.values(productListColour).map(item => item.name);
        setIndexColor(productColourName);
      } else {
        setIndexColor([]);
      }
    }
  }, [productListLoad, apparel, currentIndex]);


  const [colorNameToIndex, setColorNameToIndex] = useState({});

  useEffect(() => {
    if (productListLoad.length > 0 && apparel) {
      const productList = productListLoad.filter(item => item.Product_Name === apparel);
      const productListColour = productList[0].Product_Colors || {};
      if (typeof productListColour === 'object' && !Array.isArray(productListColour)) {
        const productColourNameToIndex = Object.keys(productListColour).reduce((acc, key, index) => {
          acc[productListColour[key].name] = index;
          return acc;
        }, {});
        setColorNameToIndex(productColourNameToIndex);
      } else {
        console.error("productListColour is not a valid JSON object:", productListColour);
      }
    }
  }, [productListLoad, apparel, currentIndex]);

  const getIndexByName = (color) => {
    return colorNameToIndex[color];
  };

  // console.log("colour name to index : ", getIndexByName("white"))
  
  const productListSlider = useMemo(() => productImageList, [productImageList]);
  // console.log("product list : ", productImageList)
  let sliderRef = useRef(null);
  const toggleZoomBtnRef = useRef(null);
  const addFavBtnRef = useRef(null);
  const [slideToShow, setSlideToShow] = useState(3);
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const [buttonText, setButtonText] = useState('Edit Design');
  // setdesignbtn = {text: 'Edit Design'};
  useEffect(()=> {
    sliderRef.current.slickGoTo(currentIndex);
  },[currentIndex]) 
  
  useEffect(() => {
    setIsActive(!!generatedImage.photo);
  }, [generatedImage.photo]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    fetchPostLike(!isLiked, generatedImage.img_id, prompt)
      .then(succeeded => {
        if (!succeeded.success) {
          setMessageBannerText(succeeded.message);
          setShowMessageBanner(true);
          setBannerKey(prevKey => prevKey + 1);
          if (succeeded.navigated) {
            navigate('/error-page');
          }
        }
        if(succeeded.success)
          isLiked ? setFavNumber(prevKey => prevKey - 1) : setFavNumber(prevKey => prevKey + 1)
      });
  };

  
  useEffect(() => {
    if (generatedImage.img_id == null) {
      setIsLiked(false);
    } else {
      fetchIsLiked(generatedImage.img_id, setIsLiked, navigate);
    }
  }, [generatedImage.img_id, navigate, setIsLiked]);


  useEffect(() => {
    const updateSlidesToShow = () => {
      if (window.innerWidth < 760) {
        setSlideToShow(1);
        return
      } 
      if (productImageList.length <= 2) {
        setSlideToShow(1);
        return
      } 
     if (productImageList.length >= 3) {
        setSlideToShow(3);
        return
      }
    };
    updateSlidesToShow();
  }, [productImageList]);

  console.log("Slides to show : ",slideToShow, "current index : ",currentIndex)
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    className: "center",
    centerMode: true,
    // infinite: apparel !== 'mug',
    infinite: slideToShow !== 1,
    centerPadding: "0px",
    slidesToShow: slideToShow,
    speed: 500,
    draggable: !isZoomEnabled,
    touchMove: !isZoomEnabled,
    afterChange: (index) => handleAfterChange(index),
    beforeChange: (current, next) => setSlideIndex(next),
    initialSlide: currentIndex
  };

  const settings_std = {
    className: "center",
    centerMode: true,
    vertical: productImageList.length === 1,
    infinite: false,
    centerPadding: "0px",
    slidesToShow: slideToShow,
    speed: 500,
    initialSlide: currentIndex
  };
  
  
  const {
    setShowMessageBanner,
    setMessageBannerText,
    setBannerKey
  } = useContext(MessageBannerContext);
  useEffect(()=> {
    setShowMessageBanner(false)
  },[])

  const [tmp_x, setX] = useState();
  const [tmp_y, setY] = useState();
  const [tmp_width, setWidth] = useState();
  const [tmp_height, setHeight] = useState();
  useEffect(()=>{
  function percentageToPixels(percentage, totalPixels) {
    return (percentage / 100) * totalPixels;
  }
  const x =  percentageToPixels(dimArray.Dim_left, 512);
  const y =  percentageToPixels(dimArray.Dim_top, 512);
  const width =  percentageToPixels(dimArray.Dim_width, 512);
  const height =  percentageToPixels(dimArray.Dim_width, 512);
  setX(Math.round(x));
  setY(Math.round(y));
  setWidth(Math.round(width));
  setHeight(Math.round(height));
},[apparel,dimArray])
console.log("x value : ", tmp_x, ", y value : ",tmp_y, ", width : ",tmp_width,", height : ",tmp_height)

  useImperativeHandle(ref, () => {
    return {
      async getSavedImageSrc() {
        return await saveAsImage();
      },
      getToggleZoomBtn() {
        return toggleZoomBtnRef.current;
      },
      getSaveBtn() {
        return addFavBtnRef.current;
      },
      disenableZoomer() {
        return setIsZoomEnabled(false);
      },
      resetEditImagePosition() {
        editedImageRef.current.resetImagePosition();
      },
      galleryGoTo(index) {
        setCurrentIndex(index);
        sliderRef.current.slickGoTo(index);
      },
      async getSelectedPreviewImage(apparel, color, patternSrc){
          const images = productImageList[currentIndex]?.front;
          let index = getIndexByName(color);
          if(index == -1){
            index = 0;
          }
          const clothImg = new Image();
          const patternImg = new Image();
          clothImg.crossOrigin = 'anonymous';
          patternImg.crossOrigin = 'anonymous';
        
          clothImg.src = images;
          patternImg.src = patternSrc;
          const outputCanvas = document.createElement('canvas');
          outputCanvas.width = 512;
          outputCanvas.height = 512;
          const outputCanvasCtx = outputCanvas.getContext('2d');
          patternImg.width = 64;
          patternImg.height = 64;
          try {
            await Promise.all([clothImg, patternImg]);
            outputCanvasCtx.drawImage(patternImg, tmp_x, tmp_y, tmp_width, tmp_height);
            outputCanvasCtx.drawImage(clothImg, 0, 0, outputCanvas.width, outputCanvas.height);
            return outputCanvas.toDataURL("image/png");
          } catch (error) {
            console.error('error', error);
          }
      }
    };
  }, [productImageList, tmp_x, tmp_y, tmp_width, tmp_height]);


  function handleToggleBtnDisable() {
    if (!generatedImage.photo) {
      setShowMessageBanner(true);
      setMessageBannerText("Please generate a design first");
      setBannerKey(prevKey => prevKey + 1);
    }
  }
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 50, y: 50 });
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100; // X position as percentage
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100; // Y position as percentage

    // Limit the translate values to ensure smooth zoom and keep focus near the center
    const x = Math.min(Math.max(xPercent, 10), 60); // Keep the x between 10 and 90 for smoother zoom
    const y = Math.min(Math.max(yPercent, 10), 60); // Same for y, prevents image from moving too far

    setTranslate({ x, y });
  };
  const handleMouseEnter = () => {
    setScale(1.4);
  };
  const handleMouseLeave = () => {
    setScale(1);
    setTranslate({ x: 50, y: 50 });
  };
  
  const closeZoomerwindow = () => {
    // setToggleActivated(false);
    setButtonText(buttonText === 'Edit Design' ? 'Save Design' : 'Edit Design');

    if (isZoomEnabled) {
      setToggleActivated(false);
      // designbtn = {text : 'Save Design'}
      // saveAsImage();
      // setShowMessageBanner(true);
      // setMessageBannerText("Design is not saved");
    } else {
      setToggleActivated(true);
    }
    setIsZoomEnabled(!isZoomEnabled);
  }
  const toggleZoom = () => {
    setButtonText(buttonText === 'Edit Design' ? 'Save Design' : 'Edit Design');
    if (!generatedImage.photo) {
      handleToggleBtnDisable();
      return
    }
    if (isZoomEnabled) {
      setToggleActivated(false);
      // designbtn = {text : 'Save Design'}
      saveAsImage();
      // setShowMessageBanner(true);
      setMessageBannerText("Design Changed!");
    } else {
      setToggleActivated(true);
    }
    setIsZoomEnabled(!isZoomEnabled);
  };

  function handleAfterChange(index) {
    if (apparel == 'mug')
      return;
    setCurrentIndex(index);
    const localColor = indexColor[index]
    setColor(localColor);
    if (localColor !== null) {
      onChange(localColor);
    }
  }

    // upscale image with cloudinary
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const [error, setError] = useState(null);
  
    const handleImageUpload = async (base64Image) => {
      if (base64Image)  { 
      //   const uploadedImageUrl = await uploadToCloudinary(base64Image);
      //   if (uploadedImageUrl)  {
      //     const enhancedImageUrl = enhanceImage(uploadedImageUrl);
      //     setUploadedImageUrl(enhancedImageUrl);
      //     setToggled(enhancedImageUrl);
      //     setEditedImage(enhancedImageUrl);
      //   }
        const enhancedImage = await enhanceImageClarity(base64Image);
        if(enhancedImage){
          setUploadedImageUrl(enhancedImage);
          setToggled(enhancedImage);
          setEditedImage(enhancedImage);
        }
      } else {
        setError('Please enter a valid base64 image URL.');
      }
    };

  
    const enhanceImage = (url) => {
      const enhancedUrl = `${url.replace('/upload/', '/upload/e_gen_restore/')}`;
      return enhancedUrl;
    };
    
  
  async function saveAsImage() {
    const imageRef = editedImageRef.current.getEditedImageRef();
    const transformedCanvas = document.createElement('canvas');
    transformedCanvas.width = 512;
    transformedCanvas.height = 512;
    const ctx = transformedCanvas.getContext('2d');
    const image = new Image();
    let tmp = imageRef.current.innerHTML;
    imageRef.current.innerHTML = '';
    const canvas = await html2canvas(imageRef.current, {
      allowTaint : false,
      useCORS: true,
      scale: 4
    });
    image.src = canvas.toDataURL("image/jpeg");
    await Promise.all([image.decode()]);
    ctx.drawImage(image, 0, 0, transformedCanvas.width, transformedCanvas.height);
    imageRef.current.innerHTML = tmp;
    let imgSrc = transformedCanvas.toDataURL("image/jpeg");
    handleImageUpload(imgSrc);
  }

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFront, setIsFront] = useState(true);
    const handleThumbnailClick = (state) => {
      // setCurrentImageIndex(index);
      setIsFront(state=="front");
    };

    const [zoomItemSrc, setZoomItemSrc] = useState(null);
  // console.log("Current Index : ",currentIndex); 
  console.log((productImageList[currentIndex] &&  productImageList[currentIndex]?.back && productImageList[currentIndex]?.back.startsWith('data:image/')))
  return (
    <div id="product-gallery" className={`sliderContainer overflow-hidden ${!isZoomEnabled ? '' : 'zoomer'}`} ref={ref}>
      <div className={`${isZoomEnabled ? 'hidden' : ''}`}>
      {/* for alumni modal */}
      {productImageList.length <= 2 ? (
        <>
        <Slider
        ref={sliderRef}
        className={`${isZoomEnabled ? 'hidden' : ''}`}
        {...settings_std}>
        {productListSlider.map((image, index) => (         
          // <div key={index} className={`relative grid justify-items-center items-center ${window.innerWidth <= 550 ? ``: `h-[32rem]`} md:h-72 lg:h-96 w-10-single-prod`}>
          //   <img id={index} draggable="false" className={`absolute z-[-1] ${apparel === 'hoodie' ? 'Hoodie' : ''} ${apparel === 'tshirt' ? 'Tshirt' : ''} `} src={editedImage} alt="" 
          //   style={{height:`${(window.innerWidth < 550) ? dimHeight : dimHeight - 2 }%`,width: `${dimWidth}%`,top:`${(window.innerWidth < 550) ? dimTop : dimTop + 1}%`,left:`${dimLeft}%`}}
          //   />
          //   <img draggable="false" src={isFront ? image.front : image.back} alt="" className={`object-contain mx-auto ${window.innerWidth <= 550 ? ``: `h-[32rem]`} md:h-72 lg:h-96 z-30`} />
          // </div>
          <div
            key={index}
            className={`relative grid justify-items-center items-center ${window.innerWidth <= 550 ? `` : `h-[32rem]`} md:h-72 lg:h-96 w-10-single-prod`}
          >
            <img
              id={index} draggable="false"
              className={`absolute z-[-1] ${apparel === 'hoodie' ? 'Hoodie' : ''} ${
                apparel === 'tshirt' ? 'Tshirt' : ''
              }`}
              src={editedImage} alt=""
              style={{
                height: `${window.innerWidth < 550 ? dimHeight : dimHeight - 2}%`,
                width: `${dimWidth}%`,
                top: `${window.innerWidth < 550 ? dimTop : dimTop + 1}%`,
                left: `${dimLeft}%`,
              }}
            />
            <img
              draggable="false" src={isFront ? image.front : image.back} alt=""
              className={`object-contain mx-auto ${window.innerWidth <= 550 ? `` : `h-[32rem]`} md:h-72 lg:h-96 z-30`}
            />
            <img draggable="false" src={isFront ? image.front : image.back} alt="" className={`object-contain mx-auto ${window.innerWidth <= 550 ? ``: `h-[32rem]`} md:h-72 lg:h-96 z-30`} />
            {currentIndex === index &&
            <div 
              className="absolute bottom-2 right-2 z-40 cursor-pointer" 
              onClick={() => openModal(isFront ? image.front : image.back)}>
              <img src={ZoomIcon} alt="Zoom" className="w-6 h-6" />
            </div>}
          </div>

        ))}         
      </Slider>
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50">
        <div className="relative" id="img-id-zoomer" style={{ position: "relative" }}>
          <div class="img-container" 
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  overflow: 'hidden',
                  transform: `scale(${scale}) translate(${translate.x - 50}px, ${translate.y - 50}px)`,
                  transition: 'transform 0.3s ease',
                  position: 'relative',
                  cursor: 'zoom-in',
                }}
                >
              <img draggable="false"
                className={`absolute z-[-1] ${apparel === 'hoodie' ? 'Hoodie' : ''} ${apparel === 'tshirt' ? 'Tshirt' : ''}`} src={editedImage} 
                alt="" style={{height: `${dimHeight}%`,width: `${dimWidth}%`,top: `${dimTop}%`,left: `${dimLeft}%`}}
              />
              <img draggable="false" src={modalImage} alt="" style={{height:`${imgHeightZoom}vh`}}
                className={`object-contain mx-auto ${window.innerWidth <= 550 ? `` : `h-[32rem]`} md:h-72 lg:h-96 z-30`}
              />
          </div>
          <button onClick={closeModal} className="absolute top-2 right-2 text-white bg-red-600 px-3 py-1 rounded-xl" style={{top:'-20px',right:'-20px',position: 'absolute'}}>
              X
          </button>
        </div>
      </div>)}
      </>
      ) : (
        <>
        <Slider
          ref={sliderRef}
          className={`${isZoomEnabled ? 'hidden' : ''}`}
          {...settings}>
          {productListSlider.map((image, index) => (         
            <div key={index} className={`relative grid justify-items-center items-center ${window.innerWidth <= 550 ? ``: `h-[32rem]`} md:h-72 lg:h-96 w-96`} >
              {/* <div style={{ height: '422.2px', width: '422.2px',justifyContent: 'center' }}> */}
              <img id={index} draggable="false" className={`absolute z-[-1] ${apparel === 'hoodie' ? 'Hoodie' : ''} ${apparel === 'tshirt' ? 'Tshirt' : ''} `} src={editedImage} alt="" 
              style={{height:`${(window.innerWidth < 550) ? dimHeight : dimHeight - 3}%`,width: `${dimWidth}%`,top:`${(window.innerWidth < 550) ? dimTop : dimTop + 3}%`,left:`${dimLeft}%`}}
              />
              <img draggable="false" src={isFront ? image.front : image.back} alt="" className={`object-contain mx-auto ${window.innerWidth <= 550 ? ``: `h-[32rem]`} md:h-72 lg:h-96 z-30`} />
            {/* </div> */}
            {currentIndex === index &&
              <div 
                className="absolute bottom-2 right-2 z-40 cursor-pointer" 
                onClick={() => openModal(isFront ? image.front : image.back)}>
                <img src={ZoomIcon} alt="Zoom" className="w-6 h-6" />
              </div>}
            </div>
          ))}         
        </Slider>
        {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50">
        <div className="relative" id="img-id-zoomer" style={{ position: "relative" }}>
          <div class="img-container" 
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  overflow: 'hidden',
                  transform: `scale(${scale}) translate(${translate.x - 50}px, ${translate.y - 50}px)`,
                  transition: 'transform 0.3s ease',
                  position: 'relative',
                  cursor: 'zoom-in',
                }}
                >
              <img draggable="false"
                className={`absolute z-[-1] ${apparel === 'hoodie' ? 'Hoodie' : ''} ${apparel === 'tshirt' ? 'Tshirt' : ''}`} src={editedImage} 
                alt="" style={{height: `${dimHeight}%`,width: `${dimWidth}%`,top: `${dimTop}%`,left: `${dimLeft}%`}}
              />
              <img draggable="false" src={modalImage} alt="" style={{height:`${imgHeightZoom}vh`}}
                className={`object-contain mx-auto ${window.innerWidth <= 550 ? `` : `h-[32rem]`} md:h-72 lg:h-96 z-30`}
              />
          </div>
          <button onClick={closeModal} className="absolute top-2 right-2 text-white bg-red-600 px-3 py-1 rounded-xl" style={{top:'-20px',right:'-20px',position: 'absolute'}}>
              X
          </button>
        </div>
      </div>)}
        </>
      )}
      </div>
      <div className={`row ${isZoomEnabled ? 'hidden' : 'flex'} 
      ${(productImageList[currentIndex] && productImageList[currentIndex]?.back && productImageList[currentIndex]?.back.startsWith('data:image/')) ? ``: `hidden`}
      `} style={{justifyContent: 'center'}}>
        <div className="row flex" style={{width: 'fit-content', justifyContent: 'center' , marginRight: '5px'}}>
            <div
              className={`z-40 thumbnail ${isFront ? 'thumbnail-selected' : ''}`}
              onClick={() => handleThumbnailClick('front')}
            >
              <img
                src={productImageList[currentIndex]?.front}
                alt={`Thumbnail Front`}
              />
            </div>
        </div>
        <div className="row flex" style={{width: 'fit-content',  justifyContent: 'center' }}>
            <div
              className={`z-40 thumbnail ${ !isFront ? 'thumbnail-selected' : ''}`}
              onClick={() => handleThumbnailClick('back')}
            >
              <img
                src={productImageList[currentIndex]?.back}
                alt={`Thumbnail Back`}
              />
            </div>
        </div>
      </div>
      <ZoomItem
        isZoomEnabled={isZoomEnabled}
        imageSrc={zoomItemSrc}
        TshirtImageSrc={productImageList[currentIndex]?.front}
        dimensions={dimArray}
        ZoomerMock={zoomerImg}
        closeAction={closeZoomerwindow}
        ref={editedImageRef} />
      <ProductGalleryFooter apparel={apparel} currentIndex={currentIndex} onFooterClick={(newColorIndex) => setCurrentIndex(newColorIndex)} />
      <div className={`Save-btn-contaiiner ${!isZoomEnabled ? 'hidden' : ''}`}>
        <button  ref={toggleZoomBtnRef} onClick={toggleZoom} 
            style={{fontFamily : `${orgDetails.font}`, backgroundColor: `${orgDetails.theme_color}`}}
            className="mx-auto text-zinc-100 font-extrabold py-2 px-4 text-xl rounded-xl  w-[12rem]">
            Save Design</button>
      </div>
      <div className={`mt-6 justify-center w-full md:w-[30rem] mx-auto text-lg md:text-2xl md:whitespace-nowrap gap-4 grid-cols-2 md:grid-cols-2  grid ${!isZoomEnabled ? '' : 'hidden'}`}>
          <button ref={toggleZoomBtnRef} onClick={toggleZoom} 
            style={{fontFamily : `${orgDetails.font}`, backgroundColor: `${orgDetails.theme_color}`}}
            className="mx-auto text-zinc-100 font-extrabold py-2 px-4 text-xl rounded-xl  w-[12rem]">
            Edit Design
          </button>
          {isActive ? (
              isLiked ? (
                <button ref={addFavBtnRef} onClick={handleLike} 
                  style={{fontFamily : `${orgDetails.font}`, backgroundColor: `red`}}
                  className="mx-auto text-zinc-100 font-extrabold py-2 px-4 text-xl rounded-xl  w-[12rem]">
                  Unsave Design
                </button>
              ) : (
                <button ref={addFavBtnRef} onClick={handleLike} 
                  style={{fontFamily : `${orgDetails.font}`, backgroundColor: `${orgDetails.theme_color}`}}
                  className="mx-auto text-zinc-100 font-extrabold py-2 px-4 text-xl rounded-xl  w-[12rem]">
                  Save Design
                </button>
              )
          ) : (
            <button ref={addFavBtnRef} 
              style={{fontFamily : `${orgDetails.font}`, backgroundColor: `lightgrey`}}
              className="cursor-not-allowed text-zinc-100 font-extrabold py-2 px-4 rounded-xl text-xl inline-block w-4/12 md:w-2/12 lg:w-2/12 ml-2">
              Save Design
            </button>
          )}
      </div>
        {/*<div className="flex flex-row justify-end space-x-2 my-[1rem]">
          <div className="relative bottom-[50px] right-[5vw]">
            {isActive ? (
              isLiked ? (
                <HeartFilled
                  className="scale-150 text-red-500 cursor-pointer"
                  onClick={handleLike}
                  ref={addFavBtnRef}
                />
              ) : (
                <HeartOutlined
                  className="scale-150 cursor-pointer"
                  onClick={handleLike}
                  ref={addFavBtnRef}
                />
              )
            ) : (
              <HeartOutlined className="scale-150 text-gray-400 cursor-not-allowed" ref={addFavBtnRef} />
            )}
          </div>
        </div>*/}
    </div>
  );
});

export default ProductGallery;

