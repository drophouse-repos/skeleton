import { useEffect } from "react";
import "./ProductInformation.css"
import InformationTopNav from "../../components/InformationTopNav/InformationTopNav";
// import Tshirt_Carbon_Clip from "../../assets/ProductInformationTshirt.png"
import Hoodie_Clip from "../../assets/ProductInformationHoodie.jpg"
import React, { useContext, useState } from "react";
import HoodieSizeInfo from "../../assets/HoodieSizeInfo.jpg"
import TshirtSizeInfo from "../../assets/TshirtSizeInfo.jpg"
import { Modal } from "antd";
import { Orgcontext } from "../../context/ApiContext";

function ProductInformation(){
    const { orgDetails, product, landingpage } = useContext(Orgcontext)
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [unitIndex, setUnitIndex] = React.useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [Tshirt, setTshirt] = useState();
    const [Hoodie, setHoodie] = useState();
    const [HoodieAvail, setHoodieAvail] = useState(true);
    useEffect(() => {
        const  getFirstAsset =  (productName) => {
            const filteredProducts = landingpage.filter(item => item.SampleProduct_Name === productName);
            const sampleproduct = Object.values(filteredProducts).map(item => {return {name : item.SampleProduct_Name,asset : item.SampleProduct_asset}});
            if (sampleproduct[0]) {
                return sampleproduct[0].asset;
            } else {
                return false;
            }
        };
        const fetchData = async () => {
            const tshirtClip = await getFirstAsset('tshirt');
            const hoodieClip = await getFirstAsset('hoodie');
            setTshirt(tshirtClip);
            setHoodie(hoodieClip);
            setHoodieAvail(hoodieClip); // Set hoodie availability based on hoodieClip existence
        };
    
        fetchData();
      }, [landingpage]);
    
    const Tshirt_Carbon_Clip = Tshirt;
    const Hoodie_Clip = Hoodie;

    const handleZoomIn = () => {
        setZoomLevel(prevZoom => Math.min(prevZoom + 0.1, 3)); // max zoom level of 3
    };

    const handleZoomOut = () => {
        setZoomLevel(prevZoom => Math.max(prevZoom - 0.1, 1)); // min zoom level of 1
    };

    const sizeInformation = [
        {
            productImg: Tshirt_Carbon_Clip,
            productTitle: "T-Shirt",
            productDesp: 'Measurements are provided by our suppliers. Product measurements may vary by up to 2” (5 cm). Pro tip! Measure one of your products at home and compare with the measurements you see in this guide.',
            productSizeInfo: TshirtSizeInfo,
            unitInformation: [
                {
                    unitName: "Inches",
                    title: ['Size label', 'Length', 'Width'],
                    sizeData: [
                    ["S", "29 &frac12;", "18"],
                    ["M", "30 &frac12;", "20"],
                    ["L", "31 &frac12;", "22"],
                    ["XL", "32 &frac12;", "24"]]
                },
                {
                    unitName: "Centimeters",
                    title: ['Size label', 'Length', 'Width'],
                    sizeData: [
                        ["S", "74.93", "45.72"],
                        ["M", "77.47", "50.80"],
                        ["L", "80.01", "55.88"],
                        ["XL", "82.55", "60.96"]
                    ]       
                }
            ]
        },
        {
            productImg: Hoodie_Clip,
            productTitle: "Hoodie",
            productDesp: 'This size guide shows product measurements taken when products are laid flat. Actual product measurements may vary by up to 1" because they’re custom-made by hand',
            productSizeInfo: HoodieSizeInfo,
            unitInformation: [
                {
                    unitName: "Inches",
                    title: ['size label', 'A', 'B', 'C'],
                    sizeData: [
                        ["XS", "19 &frac34;", "26 &frac14;", "22 &frac14;"],
                        ["S", "20 &frac12;", "26 &frac34;", "22 &frac58;"],
                        ["M", "21 &frac14;", "27 &frac38;", "23"],
                        ["L", "22 &frac78;", "28", "23 &frac58;"],
                        ["XL", "24 &frac38;", "28 &frac12;", "24 &frac14;"]
                    ]
                },
                {
                    unitName: "Centimeters",
                    title: ['size label', 'A', 'B', 'C'],
                    sizeData: [
                        ["XS", "50.17", "66.68", "56.52"],
                        ["S", "52.07", "67.95", "57.57"],
                        ["M", "53.98", "69.53", "58.42"],
                        ["L", "58.10", "71.12", "60.00"],
                        ["XL", "61.91", "72.39", "61.60"]
                    ]     
                }
            ]
        }
    ]

    const  productInformation = [
        {
            productImg: Tshirt_Carbon_Clip,
            productTitle: "T-Shirt",
            productDesp: "Elevate any casual outfit with a Premium T-Shirt. This durable yet soft tee is made of ring-spun cotton and has a classy, structured fit thanks to its heavyweight material. Layer the t-shirt with a jacket or wear it on its own and create an effortlessly cool look.",
            productDetail: "100% combed ring-spun cotton; Carbon Grey is 60% cotton and 40% polyester; Fabric weight: 6.5 oz/yd² or 220 g/m²;Yarn diameter: 20 singles; Relaxed fit; Side-seamed construction; Ribbed lycra collar; Single-needle edgestitch 2 ⅖ cm"
        },
        {
            productImg: Hoodie_Clip,
            productTitle: "Hoodie",
            productDesp: "This All-Over Print Recycled Unisex Hoodie has a relaxed fit and super soft cotton-feel fabric thanks to the recycled polyester and spandex blend. The brushed fleece inside makes this hoodie a true wardrobe favorite.",
            productDetail: "95% recycled polyester, 5% spandex; Fabric weight may vary by 5%: 9.08 oz./yd.² or 308 g/m²; Soft cotton-feel fabric face; Brushed fleece fabric inside; Double-lined hood with design on both sides; Unisex style; White or black drawstrings; Area for a custom logo on the inside of the lower hem; Overlock seams; Printed, cut, and hand-sewn by our expert in-house team; Fabric is OEKO-TEX 100 standard and Global Recycled Standard certified"
        }
    ]

    const productImageList = productInformation.map((data, index)=> {
        return (
            <div key={index} className={`my-[2rem] mx-[1rem] pb-[1rem] productListBorder border-b-2 
            ${HoodieAvail ? '' : (data.productTitle == 'Hoodie') ? `hidden` : ``}
             ${index === activeIndex ? "border-[#0491F7]" : "border-transparent"}`} onClick={()=>setActiveIndex(index)}>
                <img className="w-[5rem] md:w-[8rem] lg:w-[10rem] mb-[1rem]" src={data.productImg} alt={data.productTitle} />
                <span>{data.productTitle} </span>
            </div>
        )
    })


    return(
        <div className="flex flex-col align-center justify-center w-4/5 max-w-screen-lg mt-[4rem]">
            <InformationTopNav title="Product and Size Information"/>
            <div className="flex flex-row">
                {productImageList}
            </div>
            <div className="whitespace-normal text-justify p-[1rem] border-[1px] border-slate-400 rounded-lg sm:text-sm md:text-md lg:text-xl" style={{fontFamily : `${orgDetails.font}`}}>
                {productInformation[activeIndex].productDesp}
                <ul className="list-disc">
                    <span className="block h-[4rem]"></span>
                    {productInformation[activeIndex].productDetail.split(";").map((dataListContent, index)=> <li key={index} className="ml-[2rem] text-left indent-2" style={{fontFamily : `${orgDetails.font}`}}>{dataListContent}</li>)}
                    <span className="block h-[4rem]"></span>
                </ul>
            </div>

            <div className="w-full mt-8 mb-4 text-left text-2xl" style={{fontFamily : `${orgDetails.font}`}}>Size Information</div>
            <div className="whitespace-normal text-left p-[1rem] border-[1px] border-slate-400 rounded-lg sm:text-sm md:text-md lg:text-xl">
                <span style={{fontFamily : `${orgDetails.font}`}}>{sizeInformation[activeIndex].productDesp}</span>
                <img className="mt-[1vh]" onClick={()=> (window.innerWidth <= 544) ? setIsModalOpen(true) : []} src={sizeInformation[activeIndex].productSizeInfo} alt="product size information" />
                <Modal
                        open={isModalOpen}
                        okButtonProps={{ style: { display: "none" } }}
                        cancelButtonProps={{ style: { display: "none" } }}
                        closeIcon={true}
                        zIndex={40}
                        width={'100%'}
                        onCancel={() => setIsModalOpen(false)}
                        footer={null} // Remove default footer
                    >
            <div className="relative">
                <img
                    className="mt-[1vh] transition-transform duration-300"
                    src={sizeInformation[activeIndex].productSizeInfo}
                    alt="product size information"
                    style={{ transform: `scale(${zoomLevel})`, width: '100%' }}
                />
                <div className="relative left-0 right-0 flex justify-center">
                    <button onClick={handleZoomIn} className="bg-gray-200 p-2 m-1 rounded-full">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5V19M5 12H19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <button onClick={handleZoomOut} className="bg-gray-200 p-2 m-1 rounded-full">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        </Modal>
            </div>

            <div className="text-left my-[2rem] text-lg w-full" >
                {sizeInformation[activeIndex].unitInformation.map((unit, index)=> <span key={index} className={`ml-[1.5rem] inline-block pb-[1rem] border-b-2 ${index === unitIndex ? "font-bold border-slate-400" : "border-transparent"}`} onClick={()=>setUnitIndex(index)}
                    style={{fontFamily : `${orgDetails.font}`}} >{unit.unitName}</span>)}
            </div>

            <table className="border-collapse border border-slate-400 ...">
                <thead>
                    <tr>
                        {sizeInformation[activeIndex].unitInformation[unitIndex].title.map((title, index)=><th key={index} clasName="border border-slate-300 ..." style={{fontFamily : `${orgDetails.font}`}}>{title}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {sizeInformation[activeIndex].unitInformation[unitIndex].sizeData.map((data, index)=> <tr key={index}>
                        {data.map((d, index)=> <td key={index} className="border border-slate-300 ..." style={{fontFamily : `${orgDetails.font}`}} dangerouslySetInnerHTML={{ __html: d }}></td>)}
                    </tr>)}
                </tbody>
            </table>
        </div>
    )
}

export default ProductInformation;