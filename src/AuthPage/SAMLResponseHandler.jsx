import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { useLocation } from 'react-router-dom';

const SAMLResponseHandler = () => {
  useEffect(() => {
    const handleSAMLResponse = async () => {
      if (process.env.REACT_APP_AUTHTYPE_SAML === 'true') {
        axios.post(`${process.env.REACT_APP_SERVER_NEW}/saml/jwt`, {})
        .then(response => {
          const { token } = response.data;
          sessionStorage.setItem('saml_authToken', token);
        })
        .catch(error => {
          console.error('Error verifying SAML response', error);
        });
      }
    };

    handleSAMLResponse();
  }, []);

  return (
    <div>
      <h2>Processing Response...</h2>
    </div>
  );
};

export default SAMLResponseHandler;
