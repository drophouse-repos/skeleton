import React, { createContext, useState} from 'react';

export const MessageBannerContext = createContext();

export const MessageBannerProvider=({children}) => {
    const [showMessageBanner, setShowMessageBanner] = useState(false);
    const [messageBannerText, setMessageBannerText] = useState('');
    const [bannerKey, setBannerKey] = useState(0);
    return (
        <MessageBannerContext.Provider value={{ 
            showMessageBanner, setShowMessageBanner, 
            messageBannerText, setMessageBannerText,
            bannerKey, setBannerKey
        }}>
            {children}
        </MessageBannerContext.Provider>
    );
}