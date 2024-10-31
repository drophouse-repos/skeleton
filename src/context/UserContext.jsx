// In context/UserContext.js or a similar file
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut} from 'firebase/auth';
import { fetchSetOrGetGuest } from '../utils/fetch';
import app from './../firebase-config';
import { splitName } from '../utils';
import Cookies from 'js-cookie';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [guestId, setGuestId] = useState(null)
    const [guestKeyId, setGuestKeyId] = useState(null)
    const [loading, setLoading] = useState(true);
    const auth = getAuth(app);

    const clearGuestSessionStorage = () => {
        sessionStorage.removeItem('dh_guest_authToken');
        sessionStorage.removeItem('dh_guest_name');
        sessionStorage.removeItem('dh_guest_email');
        sessionStorage.removeItem('dh_guest_phone');
    }

    const fetchGuestData = async () => {
        const id = Cookies.get('guestId')
        const keyId = Cookies.get('guestKeyId')

        console.log("try to get guestId: ", id)

        const response = id ?
            await fetchSetOrGetGuest({salt_id: keyId, encrypted_data: id}) :
            await fetchSetOrGetGuest();
        
        const data = response.user_data;

        if (!id) {
            Cookies.set('guestId', data.user_id)
            Cookies.set('guestKeyId', data.key_id)
            console.log("set guestId and guestKeyId: ", data.user_id, data.key_id)
        }
        
        const firstName = data.first_name
        const email = data.email
        const phoneNumber = data.phone_number
        console.log("do we get to setting sessionStorage?")
        sessionStorage.setItem('dh_guest_authToken', response.token);
        sessionStorage.setItem('dh_guest_name', firstName);
        sessionStorage.setItem('dh_guest_email', email);
        sessionStorage.setItem('dh_guest_phone', phoneNumber);

        setGuestId(data.user_id)
        setGuestKeyId(data.key_id)
    };

    useEffect(() => {
        fetchGuestData();
        if (process.env.REACT_APP_AUTHTYPE_SAML === "true")
        {
            let firstName = sessionStorage.getItem('saml_name')
            let email = sessionStorage.getItem('saml_email')
            let phone = sessionStorage.getItem('saml_phone')
            clearGuestSessionStorage()
            if(sessionStorage.getItem('saml_authToken') && firstName
                && email && phone)
            {
                setUser({ isLoggedIn: true, firstName, email, phone, isGuest: false });
                setGuestId(null)
                setGuestKeyId(null)
            }
            else
            {
                setUser({ isLoggedIn: false })
            }
            setLoading(false);
        }
        else if (sessionStorage.getItem("dh_guest_authToken"))
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
                    setUser({ isLoggedIn: true, firstName, email, phoneNumber, isGuest: false });
                    setGuestId(null)
                    setGuestKeyId(null)
                    console.log("user is logged into firebase")
                    clearGuestSessionStorage();
                } else {
                    setUser({ isLoggedIn: false, isGuest: false });
                }
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, []);

    useEffect(() => {
        if(!guestId || user?.isGuest || user?.isLoggedIn) return
        fetchGuestData();
        setUser({ isLoggedIn: false, isGuest: true })
        window.location.href="/"
    }, [user, guestId, guestKeyId])
    
    // useEffect(() => {
    //     const fpPromise = FingerprintJS.load();
    //     fpPromise
    //       .then(fp => fp.get())
    //       .then(async (result) => {
    //         const visitorId = result.visitorId;
    //         setFingerprint(visitorId)
    //     });    
    // }, [])

    // useEffect(() => {
    //     if(!guestId) return
    //     if(user?.isGuest || user?.isLoggedIn) return

    //     fetchSetOrGetGuest()
    //     .then((response) => {
    //         const data = response['user_data']
    //         const firstName = data.first_name
    //         const email = data.email
    //         const phoneNumber = data.phone_number
    //         const token = response.token
    //         sessionStorage.setItem('dh_guest_authToken', token);
    //         sessionStorage.setItem('dh_guest_name', firstName);
    //         sessionStorage.setItem('dh_guest_email', email);
    //         sessionStorage.setItem('dh_guest_phone', phoneNumber);
    //         window.location.href="/"
    //     })
    //     .catch((error)=>{
    //         console.log(error)
    //     })
    //   }, [user, guestId])

    const handleSignOut = async () => {
        try {
          await signOut(auth);
          window.location.href= '/'
        } catch (error) {
          console.error('Error signing out:', error);
        }
      };

    return (
        <UserContext.Provider value={{ user, setUser, loading, handleSignOut, guestId, guestKeyId, clearGuestSessionStorage }}>
            {!loading && children}
        </UserContext.Provider>
    );
};
