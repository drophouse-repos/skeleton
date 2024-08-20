import React, { createContext, useState, useEffect } from 'react';
import Loader from '../components/loader'
import LoadingPage from '../components/newloader';
import { fetchOrderHistory } from '../utils/fetch';

export const OrderContext = createContext();

export const OrderProvider=({children}) => {
    const [loading, setLoading] = useState(true);
	const [isOrderPlaced, setOrderPlaced] = useState(false);

	useEffect(()=>{
		if(process.env.REACT_APP_AUTHTYPE_SAML != "true")
		{
			setLoading(false)
			return;	
		}
    	fetchOrderHistory()
        .then(orders => {
          	if (orders != null) {
            	orders.order_history.forEach(order => {
              		if(order.status == 'pending' || order.status == 'verified'
              		 || order.status == 'shipped' || order.status == 'delivering'
              		  || order.status == 'delivered'){
              			setOrderPlaced(true)
              		}
            	});
		    	setLoading(false);
          	}
          	else
          	{
		    	setLoading(false);
          	}
        })
        .catch((error)=>{
	    	console.log(error);
	    	setLoading(false);
	    })
  	}, [])

  	return (
  		<div>
  		{
  			loading 
  			? (
  				// <Loader />
				<LoadingPage />
  			)
  			: (
  				<OrderContext.Provider value={{isOrderPlaced, loading}}>
	  				{children}
	  			</OrderContext.Provider>
  			)
  		}
  		</div>
  	);
}