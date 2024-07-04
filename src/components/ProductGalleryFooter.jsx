import { React, useContext, useState, useEffect } from "react";
import { Orgcontext } from "../context/ApiContext";
export default function ProductColorFooter({ currentIndex, onFooterClick , apparel}) {    
    const { product } = useContext(Orgcontext);
    const [productListLoad, setProductListLoad] = useState([]);
    const [productImageList, setProductImageList] = useState([]);
  
    useEffect(() => {
      if (product) {
        setProductListLoad(product);
      }
    }, [product]);
    useEffect(() => {
      if (productListLoad.length > 0 && apparel) {
        const productList = Object.values(productListLoad).filter(item => item.Product_Name === apparel);
        const productListColour = productList[0]?.Product_Colors || [];
        const productImage = Object.values(productListColour).map(item => item.color_map ? item.color_map: item.name);
        setProductImageList(productImage);
      }
    }, [productListLoad, apparel]);
    // console.log(productImageList)
    const ColorBall = ({ color, highlight, onClick }) => {
        return (
            <div
                style={{
                    backgroundColor: color,
                    border: "1px solid grey",
                    borderRadius: "50%",
                    width: highlight ? "25px" : "18px",
                    height: highlight ? "25px" : "18px",
                }}
                onClick={onClick}
            ></div>
        );
    };

    return (
        <div style={{marginTop: '15px'}} className={`flex flex-row justify-center items-center space-x-5`}>
            {
                productImageList.map((color, index)=>{
                    return <ColorBall key={index} color={color} highlight={currentIndex === index} onClick={() => { onFooterClick(index);}}/>
                })
            }
        </div>
    );
}