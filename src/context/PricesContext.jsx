import React, { createContext, useState, useEffect } from 'react';
import Loader from '../components/loader'
import { fetchPrices } from '../utils/fetch';

export const PricesContext = createContext();

export const PricesProvider=({children}) => {
    const [loading, setLoading] = useState(true);
	const [priceMap, setPriceMap] = useState(false);

	useEffect(() => {
	    fetchPrices().then((priceData) => {
	      	setPriceMap(priceData);
	        setLoading(false);
	    })
	    .catch((error)=>{
	    	console.log(error);
	    	setLoading(false);
	    })
  	}, []);
	  
  	const getPriceNum = (apparel) => {
    	return priceMap[apparel] ? parseFloat(priceMap[apparel]) : parseFloat('0');
  	}

  	return (
  		<div>
  		{
  			loading 
  			? (
  				<Loader />
  			)
  			: (
  				<PricesContext.Provider value={{priceMap, loading, getPriceNum}}>
	  				{children}
	  			</PricesContext.Provider>
  			)
  		}
  		</div>
  	);
}