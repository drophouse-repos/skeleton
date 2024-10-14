import { React, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from '../context/AppContext';
import { Orgcontext } from "../context/ApiContext";

export default function ProductSection({prop}) {

  const { name, orgDetails, product,env } = useContext(Orgcontext);
  const [productImage, setProductImage] = useState([])
  const [product_disc, setProduct_disc] = useState([])
  const [product_count, setProduct_count] = useState([])
  
  useEffect(() => {
    const descriptions = product.map(item => item.Product_Description);
    const image = product.map(item => item.Product_DefaultProduct);
    const name = product.map(item => item.Product_Name)
    setProduct_disc(descriptions)
    setProductImage(image)
    setProduct_count(name)
},[])
  function MerchandiseButton({ title, description, image, onClick }) {
    return (
      <div className="p-2 w-1/2 max-w-[45%] m-2 sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 rounded-[12px] shadow-[0_0px_10px_3px_rgba(0,0,0,0.3)] hover:shadow-[0_0px_5px_2px_rgba(0,0,0,0.4)]">
        <img src={image} alt={description} onClick={onClick} />
        <div className="font-bold">{title}</div>
      </div>
    );
  }


  function ProductSectionContainer() {
    
    const navigate = useNavigate();
    const { apparel, setApparel, setColor, setMenuOpen } = useContext(AppContext);

    const items = product_count;
    const itemsDesc = product_disc;
    const itemsImglist = productImage;
    
    const products = [];
    if(items && items && itemsDesc && (items.length == itemsDesc.length && 
      items.length == itemsImglist.length && itemsDesc.length == itemsImglist.length))
    {
      for(var i=0; i<items.length; i++)
      {
        let item_img = itemsImglist[i]
        var obj = {
          id : i,
          type: items[i],
          title: itemsDesc[i],
          color: 'white',
          image: item_img
        }
        products.push(obj);
      }
    }

    return (
      <div className={`flex flex-wrap justify-start -mx-2`}>
        {products.map((item) => (
          <MerchandiseButton
            key={item.id}
            title={item.title}
            image={item.image}
            onClick={() => {
              setMenuOpen(false)
              setApparel(item.type);
              setColor(item.color);
              navigate("/product");              
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`rounded-[12px]  ${env?.SIDEBAR_PRODUCT_IMAGES_ENABLED === true ? `` : `hidden`}`}>
      <div className="flex flex-row justify-start text-xl text-gray-bold mb-2">
        Products
      </div>

      <div className="h-2" />

      <ProductSectionContainer />
    </div>
  );
}
