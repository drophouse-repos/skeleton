import { useEffect } from "react";
import { CloseOutlined } from "@ant-design/icons";

const popupWindowExistTime = 8000;

export default function ProductPopup({ productInfo, popupTitle, isShown, setIsShown, isSaveDesign }) {

    useEffect(() => {
        if (isShown) {
            const timeoutInstance = setTimeout(() => {
                setIsShown(false);
            }, popupWindowExistTime);

            return () => {
                clearTimeout(timeoutInstance);
            };
        }
    }, [isShown, setIsShown]);

    return (
        isShown && (<>
        {isSaveDesign ? 
                <div  className={`flex flex-col space-t-3 fixed bg-neutral-100 rounded-lg top-16 right-10 z-50 shadow-[0_0px_10px_3px_rgba(0,0,0,0.3)]`}
                style={{display: isSaveDesign ? '': 'none'}}>
                <div className="flex flex-row relative justify-center items-center content-center">
                    <div className="pt-2 font-bold " style={{fontFamily: 'Arsenal'}}>{popupTitle}</div>
                    <div className="absolute right-2 hover:text-orange-500">
                        <CloseOutlined onClick={
                            () => {
                                setIsShown(false);
                            }
                        } />
                    </div>

                </div>

                <div className="flex flex-row justify-center">
                    <div className="w-12/12 p-5">
                        <img src={productInfo.image} alt={productInfo.title} style={{maxWidth:'200px'}}/>
                    </div>
                </div>
            </div>
                : 
            <div className={`flex flex-col space-t-3 fixed bg-neutral-100 rounded-lg top-16 right-10 z-50 shadow-[0_0px_10px_3px_rgba(0,0,0,0.3)]`}
            style={{display: isSaveDesign ? 'none': ''}}>
                <div className="flex flex-row relative justify-center items-center content-center">
                    <div className="pt-2 font-bold ">{popupTitle}</div>
                    <div className="absolute right-2 hover:text-orange-500">
                        <CloseOutlined onClick={
                            () => {
                                setIsShown(false);
                            }
                        } />
                    </div>

                </div>

                <div className="flex flex-col justify-between">
                    <div className="p-5 max-w-xs">
                        <img src={productInfo.image} alt={productInfo.title} />
                    </div>
                    <div className="flex flex-col w-12/12 justify-start items-center p-6">
                        <div className="flex flex-row w-full text-lg font-bold pt-5">
                            {productInfo.title}
                        </div>
                        <br />
                        <div className={`flex flex-row w-full text-xl ${(productInfo.title.includes('Cap') || productInfo.title.includes('Mug') ? `hidden` : ``)}`}>Size: {productInfo.size}</div>
                        <div className="flex flex-row w-full text-xl">${productInfo.price}</div>
                    </div>
                </div>
            </div>
            }
            </>
        )
    );
}

