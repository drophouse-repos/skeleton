// In context/UserContext.js or a similar file
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut} from 'firebase/auth';
import { fetchSetOrGetGuest } from '../utils/fetch';
import app from './../firebase-config';
import { splitName } from '../utils';
const UserContext = createContext();
export const useUser = () => useContext(UserContext);

import FingerprintJS from '@fingerprintjs/fingerprintjs';
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fingerprint, setFingerprint] = useState(null);
    const auth = getAuth(app);

    useEffect(() => {
        if(process.env.REACT_APP_AUTHTYPE_SAML === "true")
        {
            let firstName = sessionStorage.getItem('saml_name')
            let email = sessionStorage.getItem('saml_email')
            let phone = sessionStorage.getItem('saml_phone')
            if(sessionStorage.getItem('saml_authToken') && firstName
                && email && phone)
            {
                setUser({ isLoggedIn: true, firstName, email, phone, isGuest: false });
            }
            else
            {
                setUser({ isLoggedIn: false })
            }
            setLoading(false);
        }
        else if(sessionStorage.getItem("dh_guest_authToken"))
        {
            let firstName = sessionStorage.getItem('dh_guest_name')
            let email = sessionStorage.getItem('dh_guest_email')
            let phone = sessionStorage.getItem('dh_guest_phone')
            if(sessionStorage.getItem('dh_guest_authToken') && firstName
                && email && phone)
            {
                setUser({ isLoggedIn: false, firstName, email, phone, isGuest: true });
            }
            else
            {
                setUser({ isLoggedIn: false })
            }
            setLoading(false);
        }
        else
        {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) {
                   const { displayName, email, phoneNumber } = user;       
                   let firstName = '';
                   if (!displayName) {
                     firstName = email.split('@')[0];
                   } else {
                     const names = splitName(displayName); 
                     firstName = names.firstName;
                   }
                } else {
                    setUser({ isLoggedIn: false, isGuest: false });
                }
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, []);
    useEffect(() => {
        if(user?.isGuest)
            return

        const fpPromise = FingerprintJS.load();
        fpPromise
          .then(fp => fp.get())
          .then(async (result) => {
            const visitorId = result.visitorId;
            setFingerprint(visitorId)

            if(user && user.isLoggedIn === false)
            {
                const response = await fetchSetOrGetGuest(visitorId)
                const data = response['user_data']
                const firstName = data.first_name+"_"+data.last_name
                const email = data.email
                const phoneNumber = data.phone_number
                const token = response.token
                sessionStorage.setItem('dh_guest_authToken', token);
                sessionStorage.setItem('dh_guest_name', firstName);
                sessionStorage.setItem('dh_guest_email', email);
                sessionStorage.setItem('dh_guest_phone', phoneNumber);
                setUser({ isLoggedIn: false, firstName, email,  phoneNumber, isGuest: true });
            }
          });    
      }, [user])

    const handleSignOut = async () => {
        try {
          await signOut(auth);
        } catch (error) {
          console.error('Error signing out:', error);
        }
      };

    return (
        <UserContext.Provider value={{ user, setUser, loading, handleSignOut }}>
            {!loading && children}
        </UserContext.Provider>
    );
};
