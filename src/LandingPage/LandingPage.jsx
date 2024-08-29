import React, { useContext, useState, useEffect } from "react";
import "./LandingPage.css";
import ClassButton from "../components/ClassButton";
import StepCards from "./StepCards";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useUser } from "../context/UserContext";
import ProductCardSlider from "./ProductCardSlider";
import RShowcase from "./RShowcase";
import { PricesContext } from '../context/PricesContext';
import { OrderContext } from '../context/OrderContext';
import { fetchOrderHistory } from "../utils/fetch";
import { MessageBannerContext } from "../context/MessageBannerContext";
import MessageBanner from "../components/MessageBanner";
import { Orgcontext } from '../context/ApiContext';

const ImageChangeInterval = 3000;
function GetBackendImage() {
  const imageNumber = 12;
  let imageList = [];
  for (let i = 1; i <= imageNumber; i++) {
    imageList.push(`${process.env.REACT_APP_SERVER_NEW}/image/p${i}.png`);
  }
  return imageList;
}

const LandingPage = () => {
  const { user } = useUser();
  const {priceMap, getPriceNum} = useContext(PricesContext);
  const {isOrderPlaced} = useContext(OrderContext)
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
  const { name, orgDetails, product, landingpage } = useContext(Orgcontext);
  const [product_list, setProduct_list] = useState([])
  
  useEffect(() => {
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const name = landingpage.map(item => capitalizeFirstLetter(item.SampleProduct_Name));
    setProduct_list(name);
}, [landingpage]);
console.log("landingpage",landingpage)
const [CardProduct, setCardProduct] = useState();
useEffect(()=>{
setCardProduct(landingpage.map(item => { return item.SampleProduct_asset; }))
},[landingpage])


  const products = [];

  if(landingpage && landingpage && product_list && (landingpage.length == product_list.length && 
    landingpage.length == CardProduct.length && product_list.length == CardProduct.length))
  {
    for(var i=0; i<landingpage.length; i++)
    {
      let item_img = CardProduct[i]
      var obj = {
        type: landingpage[i].SampleProduct_Name,
        name: `${name} AI Designed ${product_list[i]}`,
        price: getPriceNum(landingpage[i].SampleProduct_Name),
        color: 'white',
        imageList: [item_img]
      }
      products.push(obj);
    }
  }

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 500) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  let className = 'top';
  if (scrolled) {
    if (window.innerWidth <= 544){
    className += ' scrolled';
    }
  }

  const handleOrderPlaced = () => {
      setShowMessageBanner(true);
      setMessageBannerText("Product designed & order placed");
      setBannerKey(prevKey => prevKey + 1);
  }
  return (
    <div
      className="justify-center bg-slate-200 text-black"
    >
    {showMessageBanner && <MessageBanner message={messageBannerText} keyTrigger={bannerKey} />}
      <div className="flex flex-col items-center w-screen">
        <div className="grid justify-center place-items-start grid-cols-1 md:grid-cols-2">
          <div
            style={{
              position: "sticky",
              width: "100%",
              textAlign: "center",
              paddingRight: "5%",
              paddingLeft: "5%",
            }}

            className={`${className} top-[8%] md:top-[8%] flex flex-col items-center`}
          >

            <RShowcase imageList={GetBackendImage()} changeInterval={3000} RMask={orgDetails[0].mask}/>
            <div className="h-4"></div>
            <div style={{fontFamily : `${orgDetails[0].font}`}} className="text-black text-5xl text-center">
              Personalized 
              <br />
                    {name}
            <br />
              Drops
            </div>

            {!isOrderPlaced ?
              <ClassButton
                text="Design Now"
                className={`font-bold tracking-wide text-gray-200 rounded-[20px] mt-12 px-3 py-1 h-fit md:text-3xl md:px-8 md:py-2 ${(window.innerWidth <= 544) ? `btn-mbl`: ``}`}
                link={user && user.isLoggedIn ? "/productsection" : "/auth"}
              />
            : 
              <ClassButton
                text="Design Now"
                className={`font-bold tracking-wide text-gray-200 rounded-[20px] mt-12 px-3 py-1 h-fit md:text-3xl md:px-8 md:py-2 ${(window.innerWidth <= 544) ? `btn-mbl`: ``}`}
                onClick={handleOrderPlaced}
              />
            }
            {process.env.REACT_APP_AUTHTYPE_SAML === "true" && (
            <ClassButton
              text="Contact Us"
              className={`font-bold tracking-wide text-gray-200 rounded-[20px] mt-12 px-3 py-1 h-fit md:text-3xl md:px-8 md:py-2 ${(window.innerWidth <= 544) ? `btn-mbl`: ``}`}
              link="/contact"
            />
            )}

          </div>

          <div className="mx-5 my-32">
            <StepCards />
          </div>
        </div>

        <div className="w-full h-10" />

        <div id="landing-product-slider" className={`w-[96vw] ${(process.env.REACT_APP_SAMPLE_PRODUCT_SLIDER == 'true') ? `` : `hidden`}`}>{/*w-screen*/}
          <ProductCardSlider products={products} changeInterval={ImageChangeInterval} />
        </div>

        <div className="w-full h-10" />

      </div>
    </div>
  );
};

export default LandingPage;
