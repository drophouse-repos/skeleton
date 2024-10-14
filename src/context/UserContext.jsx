// In context/UserContext.js or a similar file
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut} from 'firebase/auth';
import app from './../firebase-config';
import { splitName } from '../utils';
const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
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
                setUser({ isLoggedIn: true, firstName, email, phone });
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
                  
                  setUser({ isLoggedIn: true, firstName, email,  phoneNumber });
                } else {
                    setUser({ isLoggedIn: false });
                }
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, []);

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
