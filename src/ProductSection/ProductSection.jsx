import React, { useContext, useState, useEffect } from 'react';
import ProductList from './ProductList';
import './ProductSection.css'
import { Orgcontext } from '../context/ApiContext';
import { PricesContext } from '../context/PricesContext';

const ProductSection = () => {
  const { orgDetails } = useContext(Orgcontext)
  const { priceMap, getPriceNum } = useContext(PricesContext)
  
  var products = []
  function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
      return array
  }
  const getProductImg = (index) => {
    var img = {}
    if(orgDetails && orgDetails.Products && orgDetails.Products[index] && orgDetails.Products[index].Product_Colors)
    {
      var variants = orgDetails.Products[index].Product_Colors
      var keys = shuffleArray(Object.keys(variants))
      for(var i=0; i<keys.length; i++)
      {
        if(variants && variants[keys[i]] && variants[keys[i]]['asset'] && variants[keys[i]]['asset']['front'] && variants[keys[i]]['asset']['front'] != '' && variants[keys[i]]['asset']['front'] != null)
        {
          img['front'] = variants[keys[i]]['asset']['front']
        }
        if(variants && variants[keys[i]] && variants[keys[i]]['asset'] && variants[keys[i]]['asset']['back'] && variants[keys[i]]['asset']['back'] != '' && variants[keys[i]]['asset']['back'] != null)
        {
          img['back'] = variants[keys[i]]['asset']['back']
        }
        if(img?.front && img?.back)
          break
      }
    }
    return img
  }
  for(var i=0; i<orgDetails.Products.length; i++)
  {
    var img = getProductImg(i)
    var product = orgDetails.Products[i]
    var obj = {
      name: product.Product_Description,
      greenmask: product.Product_Greenmask,
      type: product.Product_Name,
      price: getPriceNum(product.Product_Name),
      color: product.Product_Default_Color,
      color_map: product.Product_Colors,
      size: product.Product_Sizes,
      frontImage: img['front'],
      backImage: img['back']
    }
    products.push(obj)
  }
  const [ProductsList, setProductsList] = useState(products);
  const [selectedType, setSelectedType] = useState('All');
  const handleFilter = (apparel) => {
    setSelectedType(apparel);
    if (apparel === 'All') {
      setProductsList(products);
    } else {
      const filteredProducts = products.filter(product => product.type === apparel);
      setProductsList(filteredProducts);
    }
  };

  return (
    <div>
      <div className="col-span-1 mt-24 text-left ml-2">
        <h2 className="text-left mb-4">
          <strong>Filters</strong>
        </h2>

        {/* Flex container for responsive buttons */}
        <ul className="flex flex-wrap gap-2 overflow-x-auto">
          <li
            onClick={() => handleFilter('All')}
            className={`px-4 py-2 rounded-lg text-sm font-bold text-gray-500 cursor-pointer transition-colors duration-300 ${
              selectedType === 'All' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            All
          </li>

          {Array.from(new Set(orgDetails.Products.map(product => product.Product_Name)))
            .sort()
            .map(productName => (
              <li
                key={productName}
                onClick={() => handleFilter(productName)}
                className={`px-4 py-2 rounded-lg text-sm font-bold text-gray-500 cursor-pointer transition-colors duration-300 ${
                  selectedType === productName ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {productName.charAt(0).toUpperCase() + productName.slice(1)}
              </li>
            ))}
        </ul>
      </div>
      <div className='grid grid-cols-8 gap-4'>
        <div className="col-start-1 col-span-8 product-card-catelog">
          {ProductsList.length > 0 ? <ProductList products={ProductsList} /> : 
          <>
            <div className='product' style={{width: '84.5vw'}}>
            <h2>No Products Available</h2> 
            </div>
          </>}
          
        </div>
      </div>
    </div>
  );
};

export default ProductSection;
