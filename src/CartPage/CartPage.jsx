import React, { useState } from 'react'; // Fixed import
import "./CartPage.css";
import { useEffect } from 'react'; // Fixed import
import { fetchCartItems, fetchRemoveFromCart, fetchImageBase64 } from '../utils/fetch';
import { useNavigate } from 'react-router';
import { AppContext } from '../context/AppContext';
import { ImageContext } from '../context/ImageContext';
import { PricesContext } from '../context/PricesContext';
import { useContext } from 'react';
import { LeftCircleOutlined } from "@ant-design/icons"; 
import { MessageBannerContext } from "../context/MessageBannerContext";
import { Loading } from '../components/LoadingComponent/Loading';
import { Orgcontext } from '../context/ApiContext';

function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [updateTrigger, setUpdateTrigger] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {setShowMessageBanner, setMessageBannerText} = useContext(MessageBannerContext);
    const {priceMap, getPriceNum} = useContext(PricesContext);
    const { orgDetails } = useContext(Orgcontext)
    const {
        setPrompt,
        setApparel,
        setSize,
        setCartNumber,
        setColor
      } = useContext(AppContext);
    const {
        generatedImage,
        setGeneratedImage,
        setEditedImage,
        setThumbnailsrc,
        setImageToCart,
        isImageToCart
      } = useContext(ImageContext);
    
      useEffect(()=> {
        setShowMessageBanner(false)
      },[])
    const navigate = useNavigate();
    useEffect(() => {
        setIsLoading(true);
        fetchCartItems(navigate)
            .then(items => {
                setIsLoading(false);
                const transformedData = items.cart.map(item => ({
                    image: item.image,
                    img_id: item.img_id,
                    title: `${orgDetails.name} ${(item.apparel) == 'mug' ? `` : `${item.color.charAt(0).toUpperCase() + item.color.slice(1)}`}  ${item.apparel.charAt(0).toUpperCase() + item.apparel.slice(1)}`,
                    prompt: item.prompt,
                    apparel: item.apparel,
                    color: item.color,
                    size: item.size,
                    quantity: 1,
                    price: item.price / 100,
                    selected: false,
                    thumbnail: item.thumbnail,
                    toggled: item.toggled,
                    timestamp: item.timestamp,
                }));
                setCartItems(transformedData);
                const updateTotals = transformedData.reduce((acc, item) => {
                    acc.totalPrice += item.price * item.quantity;  
                    return acc;
                }, { totalPrice: 0 });
        
                setTotalPrice(updateTotals.totalPrice);
            })
            .catch(error => {
                console.error("Error fetching cart items:", error);
            });
        
        //setUpdateTrigger(false);
    }, [priceMap, updateTrigger]);

    const refetchCartItems = () => {
        setUpdateTrigger(prev => !prev);  // Toggle the trigger
    };

    function deleteFromCart(index, event) {
        event.stopPropagation();
        cartItems.map(async (item, i) => {
            if (i === index) {
                await fetchRemoveFromCart(item.img_id, navigate, setCartNumber);
                if(generatedImage && generatedImage.img_id && item && item.img_id && generatedImage.img_id == item.img_id)
                    setImageToCart(false);
                refetchCartItems();
                if (!isImageToCart) {
                    setImageToCart(false);
                  }
            }
        });
    }

    const handleBuyAll = async () => {
        setShowMessageBanner(false);
        const productInfo = {
            "products": []
          };
          cartItems.forEach(item => {
            item.price = item.price * 100;
            productInfo.products.push(item);
        });
        if (productInfo.products.length != 0) {
            navigate('/information', { state: { productInfo: productInfo } });
        } else{
        }
    }

    const handleRowClick = async (product) => {
        const imageBase64 = await fetchImageBase64(product.image);
        setPrompt(product.prompt);
        setApparel(product.apparel);
        setSize(product.size);
        setGeneratedImage({photo: imageBase64, prompt: product.prompt, img_id: product.img_id});
        setColor(product.color);
        setEditedImage(imageBase64);
        setThumbnailsrc(product.thumbnail);
        setImageToCart(true);
        navigate('/product');
    };
    return (
        isLoading ? <Loading/>: (
            <div className='mt-[3rem] min-h-[80vh] bg-white w-full relative lg:grid lg:grid-cols-6 max-w-[1400px] md:p-[2rem] pt-0'>
                <div className={`flex flex-col w-full bg-white p-[20px] lg:col-span-4 ${cartItems.length === 0? 'hidden' : ''}`}>
                    <div className='grid col-auto md:grid-cols-2 items-center'>
                        <div className='header-container flex items-center justify-between px-4 py-2'>
                            <button 
                                onClick={() => navigate('/product')} 
                                className="back-button flex items-center justify-center"
                            >
                                <LeftCircleOutlined style={{ fontSize: '1.1rem', marginRight: "1em" }} />
                                <div className="text-xl" style={{fontFamily : `${orgDetails.font}`}}>Back To Products</div>
                            </button>
                        </div>
                        <span className='mt-[1rem] md:mt-auto text-md col-auto md:text-lg justify-self-center md:justify-self-end lg:hidden' style={{fontFamily : `${orgDetails.font}`}}>Subtotal: ${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className='border-b-2 border-[#DDDDDD] grid grid-cols-1 justify-items-center lg:hidden'>
                        <button className='mx-auto text-white h-[2rem] my-[1rem] rounded-3xl text-lg font-medium w-[10rem]' style={{fontFamily : `${orgDetails.font}`, backgroundColor: `${orgDetails.theme_color}`}} onClick={handleBuyAll}>Checkout</button>
                    </div>
                    {cartItems.filter(item => !item.saveForLater).map((product, index) => (
                            <div className='flex flex-row border-b cursor-pointer' key={index} onClick={() => handleRowClick(product)}>
                            <div className='w-[10rem] p-[1rem] self-center'>
                                <img src={product.thumbnail} alt="product" />
                            </div>
                            <ul className='w-full p-[1rem]'>
                                <li className='grid grid-cols-3'><span className='text-left text-md md:text-3xl col-span-2' style={{fontFamily : `${orgDetails.font}`}}>{product.title}</span><span className='justify-self-end md:text-3xl' style={{fontFamily : `${orgDetails.font}`}}>${product.price.toFixed(2)}</span></li>
                                <li className={`text-left text-slate-500 text-lg ${(product.title.includes('Mug')) || (product.title.includes('Cap')) ? `hidden` : ``}`} style={{fontFamily : `${orgDetails.font}`}}>Size: {product.size}</li>
                                <li className='text-left text-slate-500 text-lg' style={{fontFamily : `${orgDetails.font}`}}>prompt: {product.prompt}</li>
                                <div className='grid grid-cols-2 gap-4 divide-x w-fit font-light text-[12px] md:text-base mt-[1rem] cursor-pointer text-red-900'>
                                    <span onClick={(e) => deleteFromCart(index, e)} style={{fontFamily : `${orgDetails.font}`}}>Delete</span>
                                </div>
                            </ul>
                        </div>
                    ))}
                </div>
                <div className={`w-[300px] h-[300px] rounded-lg border border-slate-300 drop-shadow-2xl bg-white lg:col-span-2 mt-[4rem] p-[2rem] ${cartItems.length === 0? 'hidden' : 'cartCheckout'}`}>
                    <div className='uppercase text-3xl font-medium border-b-2 border-gray-600 pb-[1rem]' style={{fontFamily : `${orgDetails.font}`}}>Summary</div>
                    <div className='uppercase text-2xl font-medium mt-[2rem]' style={{fontFamily : `${orgDetails.font}`}}>Subtotal</div>
                    <div className='uppercase text-xl font-normal text-slate-500' style={{fontFamily : `${orgDetails.font}`}}>$ {totalPrice.toFixed(2)}</div>
                    <button className='mx-auto text-white h-[2rem] my-[1rem] rounded-3xl text-lg font-medium w-[10rem]' style={{fontFamily : `${orgDetails.font}`, backgroundColor: `${orgDetails.theme_color}`}} onClick={handleBuyAll}>Checkout</button>
                </div>
                <div className={`${cartItems.length === 0? '' : 'hidden'} w-full col-span-6`}>
                    <div className='text-2xl md:text-2xl mb-2 mt-16' style={{fontFamily : `${orgDetails.font}`}}>Shopping Cart is empty.</div>
                    <div className='text-2xl md:text-2xl mb-10' style={{fontFamily : `${orgDetails.font}`}}>Please go to add your design.</div>
                    <button className='bg-sky-600 text-zinc-100 font-extrabold py-2 px-4 rounded-full w-[10rem] mb-10 text-lg' onClick={(e) =>  navigate('/product')} style={{fontFamily : `${orgDetails.font}`, backgroundColor: `${orgDetails.theme_color}`}}>Design Now</button>
                </div>
            </div>
        )
    );
}



export default CartPage;
