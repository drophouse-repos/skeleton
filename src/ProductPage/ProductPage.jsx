import React from "react";
import { useRef, useEffect, useState, useContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductPage.css";
import { AppContext } from "../context/AppContext";
import { ImageContext } from "../context/ImageContext";
import { PricesContext } from '../context/PricesContext';
import { MessageBannerContext } from "../context/MessageBannerContext";
import { Select, Tour } from "antd";
import { fetchAskAi, fetchAddToCart, fetchGetImage, fetchStorePrompt, fetchSaveImg } from "../utils/fetch";
import ProductGallery from "../components/ProductGallery";
import PromptBoxButton from "../components/PromptBoxButton";
import ProductPopup from "../components/ProductPopup";
import InfoButton from "../components/InfoButton";
import ModalComponent from '../components/ModalComponent';
import EditDesignTip from "../assets/EditDesignTip.png";
import MessageBanner from "../components/MessageBanner";
import app from "../firebase-config";
import { OrderContext } from '../context/OrderContext';
import { Orgcontext } from "../context/ApiContext";

const ProductPage = () => {
  const { product, orgDetails } = useContext(Orgcontext);
  const [productListLoad, setProductListLoad] = useState([]);
  const [productImageList, setProductImageList] = useState([]);
  const [tourOpen, setTourOpen] = useState(true);
  const [productPopupIsShown, setProductPopupIsShown] = useState(false);
  const [productPopupInfo, setProductPopupInfo] = useState({});
  const [productPopupTitle, setProductPopupTitle] = useState("");
  const [currentColor, setCurrentColor] = useState("white");
  const [modalSelectionMade, setModalSelectionMade] = useState(false);
  const [changeFromMug, setChangeFromMug] = useState(1);
  const {isOrderPlaced} = useContext(OrderContext)

  if(isOrderPlaced)
  {
    window.location.href = "/user";
    return;
  }
  const {
    prompt,
    setPrompt,
    apparel,
    setApparel,
    size,
    setSize,
    color,
    setColor,
    aiSuggestions,
    setAiSuggestions,
    setCartNumber,
    aiTaskId,
    setAiTaskId,
    dictionaryId,
    setDictionaryId,
    isActive,
    setIsActive
  } = useContext(AppContext);
  const [localPrompt, setLocalPrompt] = useState(prompt);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isGenerating, setIsGenerating, setGeneratedImage, generatedImage, editedImage, setEditedImage, isLiked, setIsLiked, thumbnailsrc, setThumbnailsrc, isImageToCart, setImageToCart } = useContext(ImageContext);
  const [toggled, setToggled] = useState(false);
  const [isAskingRosie, setIsAskingRosie] = useState(false);
  const navigate = useNavigate();
  const [isFirstVisit, setIsFirstVist] = useState(false);
  const [isZoomEnabled, setIsZoomEnabled] = useState(false);
  const {priceMap, getPriceNum} = useContext(PricesContext);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState();
  const [colorNameToIndex, setColorNameToIndex] = useState({});
  const [indexColor, setIndexColor] = useState([])
  const [productList, setProductList] = useState([]);
  useEffect(() => {
    if(apparel === 'mug'){
      setSize('M')
    }
   else if(apparel === 'cap'){
      setSize('M')
    }
    else {
    setSize('')
    }
  },[apparel])
  useEffect(() => {
    if (product) {
      setProductListLoad(product);
    }
  }, [product]);
  useEffect(() => {
    if (productListLoad.length > 0 && apparel) {
      const productList = productListLoad.filter(item => item.Product_Name === apparel);
      setProductList(productListLoad)
      if (productList.length > 0) {
        const productListColour = productList[0].Product_Colors || [];
        const productColourName = Object.values(productListColour).map(item => item.name);
        setIndexColor(productColourName);
      } else {
        setIndexColor([]);
      }
    }
  }, [productListLoad, apparel]);
  useEffect(() => {
    const productKeys = Object.keys(productList);
    if (productKeys.length === 1 && indexColor.map(v => v.toLowerCase()).indexOf(color.toLowerCase()) >= 0) {
      setColor(indexColor[indexColor.map(v => v.toLowerCase()).indexOf(color.toLowerCase())]);
      console.log("Color changed according to the product data");
      const fetchIndex = async () => {
        const index = await getIndexByName(color);
        setCurrentGalleryIndex(index?index:0);
      };
      fetchIndex();
    }
    else{
      const fetchIndex = async () => {
        const index = await getIndexByName(color);
        setCurrentGalleryIndex(index);
      };
      fetchIndex();
    }
  }, [productList, indexColor, color, setColor]);
  useEffect(() => {
    if (productListLoad.length > 0 && apparel) {
      const productList = productListLoad.filter(item => item.Product_Name === apparel);

      const productListColour = productList[0]?.Product_Colors || {};

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
  }, [productListLoad, apparel]);

  const getIndexByName = (color) => {
    return colorNameToIndex[color];
  };

  const {
    showMessageBanner,
    setShowMessageBanner,
    messageBannerText,
    setMessageBannerText,
    bannerKey,
    setBannerKey
  } = useContext(MessageBannerContext);
  useEffect(()=> {
    setShowMessageBanner(false)
  },[])
  const productGalleryRef = useRef(null);

  useEffect(() => {
    if (product) {
      setProductListLoad(product);
    }
  }, [product]);

  useEffect(() => {
    if (productListLoad.length > 0 && apparel) {
      const selectedProduct = productListLoad.find(item => item.Product_Name === apparel);
      const productListColour = selectedProduct?.Product_Colors || [];
      setProductImageList(productListColour);
    }
  }, [productListLoad, apparel]);

  const apparelOptions = productListLoad.map(item => ({
    value: item.Product_Name,
    label: item.Product_Description
  }));

  const selectedProduct = productListLoad.find(item => item.Product_Name === apparel);

  const [sizes, setSizes] = useState([]);
  useEffect(() => {
    if (selectedProduct?.Product_Sizes) {
      setSizes([{ value: '', label: '' }, ...selectedProduct.Product_Sizes.map(size => ({
        value: size,
        label: size,
      }))]);
    }
  }, [selectedProduct,apparel]);
  const [toggleActivated, setToggleActivated] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
    setShowMessageBanner(false)
  }, []);
  useEffect(() => {
    const firstVisit = localStorage.getItem("firstVisit");
    if (firstVisit == null) {
      setIsFirstVist(true)
    } else {
      setIsFirstVist(false)
    }
    if (firstVisit == null) {
      setIsFirstVist(true)
    } else {
      setIsFirstVist(false)
    }
    if (firstVisit) {
      setTourOpen(false);
    }
  }, []);

  useEffect(() => {
    setToggled(false);
  }, [generatedImage]);

  useEffect(() => {
    const active = prompt && apparel && color && generatedImage && !isGenerating && !toggleActivated;
    setIsActive(!!active);
  }, [prompt, apparel, color, generatedImage, isGenerating, toggleActivated]);

  const charCount = localPrompt.length;
  const shouldFlash = charCount == 0 | localPrompt == prompt;
  const handlePromptChange = (e) => {
    let word = "";
    if (e.target.value) {
      word = e.target.value;
    }
    setLocalPrompt(word);
  };

  const handleAskAI = () => {
    if (!localPrompt || isGenerating) {
      handleGPTBtnDisable()
      return
    }
    if (!isAskingRosie) {
      productGalleryRef.current.disenableZoomer();
      setIsAskingRosie(true);
      fetchAskAi(localPrompt, setAiSuggestions, setAiTaskId, setDictionaryId, navigate)
        .then(succeeded => {
          if (!succeeded.success) {
            if (succeeded.navigated)
              return
            setMessageBannerText(succeeded.message);
            setShowMessageBanner(true);
            setBannerKey(prevKey => prevKey + 1);
            setIsAskingRosie(false);
            return;
          }
          setIsAskingRosie(false);
          setIsModalVisible(true);
        })
    }
  };

  const handleGenerateClick = (taskId, dictionaryId, promptIndex) => {
    if (!localPrompt || isGenerating) {
      handleGPTBtnDisable()
      return
    }; 
    setIsGenerating(true);
    let promptsArray = aiSuggestions.Prompts;
    const promptKey = Object.keys(promptsArray[promptIndex])[0];
    const aiChosenPrompt = promptsArray[promptIndex][promptKey];
    fetchGetImage({ idx: promptIndex, prompt: aiChosenPrompt, task_id: taskId }, setGeneratedImage, setEditedImage, navigate)
      .then(succeeded => {
        if (!succeeded.success) {
          if (succeeded.navigated)
            return
          setMessageBannerText(succeeded.message);
          setShowMessageBanner(true);
          setBannerKey(prevKey => prevKey + 1);
          return;
        }
        setImageToCart(false);
      })
      .finally(() => {
        setIsGenerating(false);
        setPrompt(aiChosenPrompt);
        setModalSelectionMade(false); // Reset the modal selection state
        productGalleryRef.current.resetEditImagePosition();
      });
    setIsLiked(false);
    setToggled(false);
  };

  const handleSelectExample = (selectedExample, promptIndex) => {
    setLocalPrompt(selectedExample);
    setIsModalVisible(false);
    setModalSelectionMade(true);
    setIsGenerating(true);
    let promptsInfo = {
      "prompt1": aiSuggestions.Prompts[0].Prompt1,
      "prompt2": aiSuggestions.Prompts[1].Prompt2,
      "prompt3": aiSuggestions.Prompts[2].Prompt3,
      "chosenNum": promptIndex+1
    }
    fetchStorePrompt(promptsInfo, navigate)
    handleGenerateClick(aiTaskId, dictionaryId, promptIndex);
  };

  const handleModalClose = () => {
    let promptsInfo = {
      "prompt1": aiSuggestions.Prompts[0].Prompt1,
      "prompt2": aiSuggestions.Prompts[1].Prompt2,
      "prompt3": aiSuggestions.Prompts[2].Prompt3,
      "chosenNum": 0
    }
    fetchStorePrompt(promptsInfo, navigate)
    setIsModalVisible(false)
  }

  const handleApparelChange = (value) => {
    if(value === 'mug'){
      setCurrentGalleryIndex(0);
      productGalleryRef.current.galleryGoTo(0);
      setCurrentColor("white");
      setColor("white");
      setSize('M')
    }
    else if(value === 'cap'){
      setCurrentGalleryIndex(0);
      productGalleryRef.current.galleryGoTo(0);
      setCurrentColor("white");
      setColor("white");
      setSize('M')
    }
    else {
      setSize('')
    }
    setCurrentGalleryIndex(0);
    productGalleryRef.current.galleryGoTo(0);
    setCurrentColor("white");
    setColor("white");
    setApparel(value);
  };

  const handleSizeChange = (value) => {
    setSize(value);
  };
  const handlechangeblanksize = () => {
    setSizes(sizes.filter(option => option.value !== ''));
  }

  const handleProductGalleryChange = (selectedColor) => {
    setCurrentColor(selectedColor);
  };
  const handleAddToCart = async (setState) => {
    if (!isActive) {
      handleCartBtnDisable();
      return
    }
    if(size == ''){
        setShowMessageBanner(true);
        setMessageBannerText('Please select your size');
        setBannerKey(prevKey => prevKey + 1);
    }
    else{
        const thumbnail = await productGalleryRef.current.getSelectedPreviewImage(apparel, color, editedImage);
      
        const productPopupInfo = {
          title: `${orgDetails.name} ${!(apparel) == 'mug' ? `${color.charAt(0).toUpperCase() + color.slice(1)}` : ``} ${apparel.charAt(0).toUpperCase() + apparel.slice(1)}`,
          size: size,
          price: getPriceNum(apparel),
          image: thumbnail,
        };
        const productInfo = {
          apparel: apparel,
          size: size,
          color: color,
          img_id: generatedImage.img_id,
          prompt: prompt,
          timestamp: new Date().toISOString(),
          thumbnail: thumbnail,
          toggled: toggled ? toggled : false,
          price: getPriceNum(apparel) * 100,
        }
        const succeeded = await fetchAddToCart(productInfo, navigate);
        if (!succeeded.success) {
          if (succeeded.navigated)
            return
          setMessageBannerText(succeeded.message);
          setShowMessageBanner(true);
          setBannerKey(prevKey => prevKey + 1);
          return;
        }
        setCartNumber(prev => prev + 1);
        setProductPopupTitle("ADDED TO Cart");
        setProductPopupInfo(productPopupInfo);
        setProductPopupIsShown(true);
        setImageToCart(true);
    }
  }

  const handleBuy = async () => {
    if (!isActive) {
      handleCartBtnDisable();
      return
    }
    if(size == ''){
      setShowMessageBanner(true);
      setMessageBannerText('Please select your size');
      setBannerKey(prevKey => prevKey + 1);
    }
    else {
        const thumbnail = await productGalleryRef.current.getSelectedPreviewImage(apparel, color, editedImage);
        if (generatedImage.img_id === null) {
        } else {
          const productInfo = {
            "products":
              [
                {
                  apparel: apparel,
                  size: size,
                  color: color,
                  img_id: generatedImage.img_id,
                  prompt: prompt,
                  timestamp: new Date().toISOString(),
                  thumbnail: thumbnail,
                  toggled: toggled ? toggled : false,
                  price: getPriceNum(apparel) * 100,
                }
              ]
          };
          navigate('/information', { state: { productInfo: productInfo } });
        }
    }
  }

  const promptBoxRef = useRef(null);
  const generateBtnRef = useRef(null);
  const addToCartBtn = useRef(null);

  const steps = [
    {
      title: "Type Description",
      description: "Type in a description for the design you want",
      target: () => promptBoxRef.current,
    },
    {
      title: "Generate Design",
      description: "Click here to generate your design",
      target: () => generateBtnRef.current,
    },
    {
      title: "Save Design",
      description: "Tap the Heart Icon to save your design",
      target: () => productGalleryRef.current.getSaveBtn,
    },
    {
      title: "Edit Design",
      placement:"top",
      description: 
        <div className="w-[80vw] md:w-[28rem]">
          <img className="mx-auto w-[80%]" src={EditDesignTip} alt=""/>
          <span className="text-xl">Click here to reposition your design</span>
        </div>,
      target: () => productGalleryRef.current.getToggleZoomBtn,
    },
  ];

  const handleInput = (e) => {
    e.target.style.height = 'inherit'; // Reset the height
    e.target.style.height = `${Math.min(e.target.scrollHeight, maxTextAreaHeight)}px`; // Set new height
  };
  const maxTextAreaHeight = 120; 

  const disableCartBtn = () => {
    if(!addToCartBtn.current)
      return;
    addToCartBtn.current.style.backgroundColor = 'lightgrey';
    addToCartBtn.current.style.pointerEvents = 'none';
    addToCartBtn.current.style.cursor = 'not-allowed';
  }
  const enableCartBtn = () => {
    if(!addToCartBtn.current)
      return;
    addToCartBtn.current.style.backgroundColor = orgDetails.theme_color;
    addToCartBtn.current.style.pointerEvents = 'auto';
    addToCartBtn.current.style.cursor = 'pointer';
  }

  const handleCartBtnDisable = () => {
    if (!isActive) {
      setShowMessageBanner(true);
      setMessageBannerText("Generate a design first");
      setBannerKey(prevKey => prevKey + 1);
    }
  }

  const handleGPTBtnDisable = () => {
    if (!localPrompt || isGenerating) {
      setShowMessageBanner(true);
      setMessageBannerText("Please input a prompt");
      setBannerKey(prevKey => prevKey + 1);
    }
  }

  return (
    <div className={`pt-[4rem] md:pt-[6rem] w-[96vw] ${isZoomEnabled ? '' : 'touch-pan-y'}`}>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
      {showMessageBanner && <MessageBanner message={messageBannerText} keyTrigger={bannerKey} />}
      {isModalVisible && (
        <ModalComponent
          aiSuggestions={aiSuggestions}
          onClose={handleModalClose}
          onSelectExample={handleSelectExample}
        />
      )}
      <Tour
        open={tourOpen}
        onClose={() => {
          localStorage.setItem("firstVisit", true);
          setIsFirstVist(false)
          setTourOpen(false);
        }}
        steps={steps}
        indicatorsRender={(current, total) => (
          <span>
            {current + 1} / {total}
          </span>
        )}
      />
      <ProductPopup
        isShown={productPopupIsShown}
        popupTitle={productPopupTitle}
        productInfo={productPopupInfo}
        setIsShown={setProductPopupIsShown}
      />
      <div className="m-auto max-w-screen-lg">
        <div className="w-full px-5">
          <div className="text-left"><span className="ml-1 mr-2 text-lg" style={{fontFamily : `${orgDetails.font}`}}>Description Box</span><InfoButton link="/information/prompt" /></div>
          <textarea
            ref={promptBoxRef}
            name="prompt"
            value={localPrompt}
            onChange={(e) => handlePromptChange(e)}
            onInput={handleInput}
            className="productPageInputbox shadow-lg rounded-md border"
            rows="2"
            style={{fontFamily : `${orgDetails.font}`, overflowY: 'auto', height: '70px',fontSize: '15px'}}
            placeholder="Describe Your design..."
            disabled={isGenerating}
          />
          <div className="flex flex-row justify-end space-x-2 my-[1rem]">
            <PromptBoxButton
              ref={generateBtnRef}
              text={"Design Now"}
              onClick={handleAskAI}
              loading={isAskingRosie | isGenerating}
              className={(shouldFlash && isFirstVisit) ? "flash" : ""}
            />
          </div>
        </div>
        <ProductGallery
            ref={productGalleryRef}
            setToggled={setToggled}
            setToggleActivated={setToggleActivated}
            isZoomEnabled={isZoomEnabled}
            setIsZoomEnabled={setIsZoomEnabled}
            onChange={(selectedColor) =>
              handleProductGalleryChange(selectedColor)
            }
            currentIndex = {currentGalleryIndex}
            setCurrentIndex = {setCurrentGalleryIndex}
            changeFromMug = {changeFromMug}
          />
        <div className={`justify-center  px-5 ${(process.env.REACT_APP_CART_ENABLED == 'true') ? (window.innerWidth <= 544) ? ``:`mt-[2rem]` : ``}`}>
          <div className={`grid ${apparel !== 'mug' && apparel !== 'cap' ? 'grid-cols-2' : 'grid-cols-1'} ${(window.innerWidth <= 544 ? `w-full` : `w-[70%]` )} mx-auto justify-items-center items-center`}>
      {apparelOptions.length === 1 ? (
      <span className="text-gray-800 span-input">{apparelOptions[0].label}</span>
    ) : (
      <Select
        style={{ fontFamily: `${orgDetails.font}` }}
        className={`${(window.innerWidth <= 544 ? 'w-[9rem]' : 'w-[15rem]')} border-none outline-none`}
        onChange={handleApparelChange}
        value={apparel}
        options={apparelOptions}
      />
    )}

            {apparel !== 'mug' && apparel !== 'cap' && (
              <Select
                style={{fontFamily : `${orgDetails.font}`}}
                className={`${(window.innerWidth <= 544 ? `w-[8rem]` : `w-[15rem]` )} border-none outline-none`}
                value={size || undefined}
                placeholder={'Select Size'}
                onChange={handleSizeChange}
                options={sizes}
                defaultValue={{ value: '', label: 'Select Size' }}
                onFocus={handlechangeblanksize}
                render={(value) => {
                  return value === '' ? 'Select Size' : value;
                }}
              />
            )}
            <span></span>
            {apparel !== 'mug' && apparel !== 'cap' && (
              <span style={{fontFamily : `${orgDetails.font}`}} className="text-blue-600 font-bold hover:text-teal-600 mt-0 cursor-pointer" onClick={() => {navigate("/information/size");}}>Size Information & Chart</span>
            )}
          </div>
          <div className={`text-center text-black font-normal font-karl ${(window.innerWidth <= 544) ? `my-[1rem]`: `my-[3rem]`} ${(process.env.REACT_APP_SHOWPRICE == 'true') ? `` : `hidden`}`}>
            <span className="text-3xl font-bold" style={{fontFamily : `${orgDetails.font}`}}>
              ${getPriceNum(apparel)}
            </span>
          </div>
          <div className={`justify-center w-full md:w-[30rem] mx-auto text-lg md:text-2xl md:whitespace-nowrap gap-4 grid-cols-2 md:grid-cols-2  ${(process.env.REACT_APP_CART_ENABLED == 'true') ? `grid` : `flex mt-4`}`}>
            <button
              style={{fontFamily : `${orgDetails.font}`, backgroundColor: `${orgDetails.theme_color}`}}
              className={`mx-auto text-zinc-100 font-extrabold py-2 px-4 text-xl rounded-xl  ${(process.env.REACT_APP_CART_ENABLED == 'true') ? (window.innerWidth <= 544) ? `w-[8.5rem]`: `w-[12rem]` : `hidden`}`}
              onClick={handleAddToCart} ref={addToCartBtn}
            >
              Add to Cart
            </button>
            {isImageToCart ? disableCartBtn() : enableCartBtn()}
            <button
               style={{fontFamily : `${orgDetails.font}`, backgroundColor: `${(process.env.REACT_APP_DEMO == 'true') ? 'grey' : orgDetails.theme_color}`}}
              className={`mx-auto text-zinc-100 font-extrabold py-2 px-4 text-xl rounded-xl ${(process.env.REACT_APP_CART_ENABLED == 'true') && (window.innerWidth <= 544) ? `w-[8rem]` :`w-[12rem]`}`}
              onClick={handleBuy}
              disabled={process.env.REACT_APP_DEMO}
            >
              Buy
            </button>
          </div>
          <br />
          <br />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;