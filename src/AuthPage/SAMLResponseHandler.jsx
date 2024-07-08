import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from "../context/UserContext"; 
import axios from 'axios';

const SAMLResponseHandler = () => {
  const location = useLocation();
  const getQueryParams = (queryString) => {
    return new URLSearchParams(queryString);
  };
  const { user, setUser } = useUser();
  useEffect(() => {
    let queryParams = getQueryParams(location.search);
    let en_eid = queryParams.get('eid');
    let en_data = queryParams.get('email');
    if(en_eid && en_data)
    {
      var payload = {
        'eid' : en_eid,
        'email' : en_data
      }
      axios.post(`${process.env.REACT_APP_SERVER_NEW}/saml/jwt`, payload)
      .then(response => {
        const data = response.data;
        if(data.token && data.token != null)
        {
          var token = data.token;
          var user_data = data.user_data;
          var firstName = user_data['first_name'];
          var email = user_data['email'];
          var phoneNumber = user_data['phone_number']

          if(token && firstName && email)
          {
            sessionStorage.setItem('saml_authToken', token);
            sessionStorage.setItem('saml_name', firstName);
            sessionStorage.setItem('saml_email', email);
            sessionStorage.setItem('saml_phone', phoneNumber);
            setUser({ isLoggedIn: true, firstName, email, phoneNumber });
          }
        }
        else
        {
          window.location.href = "/auth";
        }
      })
      .catch(error => {
        console.error('Error verifying SAML response', error);
      });
    }
  }, [location]);

  return (
    <div></div>
  );
};

export default SAMLResponseHandler;