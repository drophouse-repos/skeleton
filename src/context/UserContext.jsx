// In context/UserContext.js or a similar file
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const [guestId, setGuestId] = useState(null);
    const [guestKeyId, setGuestKeyId] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = getAuth(app);
    const navigate = useNavigate();

    const clearGuestSessionStorage = () => {
        sessionStorage.removeItem('dh_guest_authToken');
        sessionStorage.removeItem('dh_guest_name');
        sessionStorage.removeItem('dh_guest_email');
        sessionStorage.removeItem('dh_guest_phone');
    }

    const fetchGuestData = async () => {
        const id = Cookies.get('site_data');
        const keyId = Cookies.get('site_prefs');

        const response = id ?
            await fetchSetOrGetGuest({salt_id: keyId, encrypted_data: id}) :
            await fetchSetOrGetGuest();
        
        const data = response.user_data;

        if (!id) {
            Cookies.set('site_data', data.user_id);
            Cookies.set('site_prefs', data.key_id);
        }
        
        const firstName = data.first_name;
        const email = data.email;
        const phoneNumber = data.phone_number;
        sessionStorage.setItem('dh_guest_authToken', response.token);

        setGuestId(data.user_id);
        setGuestKeyId(data.key_id);

        return { firstName, email, phoneNumber };
    };

    useEffect(() => {
        const initializeAuth = async () => {
            const { firstName, email, phoneNumber } = await fetchGuestData()
            if (process.env.REACT_APP_AUTHTYPE_SAML === "true")
            {
                let firstName = sessionStorage.getItem('saml_name');
                let email = sessionStorage.getItem('saml_email');
                let phone = sessionStorage.getItem('saml_phone');
                clearGuestSessionStorage();
                if(sessionStorage.getItem('saml_authToken') && firstName
                    && email && phone)
                {
                    setUser({ isLoggedIn: true, firstName, email, phone, isGuest: false });
                    setGuestId(null);
                    setGuestKeyId(null);
                }
                else
                {
                    setUser({ isLoggedIn: false });
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
                        setGuestId(null);
                        setGuestKeyId(null);
                        clearGuestSessionStorage();
                    } else if (sessionStorage.getItem("dh_guest_authToken")) {
                        setUser({ isLoggedIn: false, firstName, email, phoneNumber, isGuest: true });
                    }
                    else
                    {
                        setUser({ isLoggedIn: false, isGuest: false });
                    }
                    setLoading(false);
                });
                return () => unsubscribe();
            }
        }
        initializeAuth();
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const isEmailLink = urlParams.has("mode") && urlParams.get("mode") === "signIn";
        if (!loading && user?.isGuest && !isEmailLink) {
            navigate('/')
        }
    }, [loading])

    const handleSignOut = async () => {
        try {
            setLoading(true);
            await signOut(auth);
            const { firstName, email, phoneNumber } = await fetchGuestData();
            setUser({ isLoggedIn: false, firstName, email, phoneNumber, isGuest: true });
            setLoading(false);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, loading, setLoading, guestId, guestKeyId, handleSignOut, clearGuestSessionStorage }}>
            {!loading && children}
        </UserContext.Provider>
    );
};
