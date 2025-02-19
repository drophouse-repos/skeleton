import React, { createContext, useState, useEffect } from 'react';
import { loadState } from '../utils';
import Loader from '../components/loader'
import LoadingPage from '../components/newloader';
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState(loadState('prompt', '', 'appState'));
  const [apparel, setApparel] = useState(loadState('apparel', 'tshirt','appState'));
  const [size, setSize] = useState(loadState('size', '', 'appState'));
  const [color, setColor] = useState(loadState('color', 'white','appState'));
  const [price, setPrice] = useState(loadState('price', 50, 'appState'));
  const [cartNumber, setCartNumber] = useState(loadState('cartItems', 0, 'appState'));
  const [favNumber, setFavNumber] = useState(loadState('favItems', 0, 'appState'));
  const [aiSuggestions, setAiSuggestions] = useState(loadState('ai_suggestions', [], 'appState'));
  const [aiTaskId, setAiTaskId] = useState(loadState('aiTaskId', 0, 'appState'));
  const [dictionaryId, setDictionaryId] = useState(loadState('aiTaskId', '', 'appState'));
  const [isActive, setIsActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [productPopupIsShown, setProductPopupIsShown] = useState(false);
  const [productPopupInfo, setProductPopupInfo] = useState({});
  const [productPopupTitle, setProductPopupTitle] = useState("");
  const [isSaveDesign, setisSaveDesign] = useState(false);
  useEffect(() => {
    setLoading(true);
    const state = { prompt, apparel, size, color, price, aiSuggestions };
    localStorage.setItem('appState', JSON.stringify(state));
    setLoading(false);
  }, [prompt, apparel, size, color, price, aiSuggestions]);

  return (
    <div>
    {
        loading
        ? (
            // <Loader />
            <LoadingPage />
        )
        : (
            <AppContext.Provider value={{ 
              prompt, setPrompt,
              apparel, setApparel,
              size, setSize,
              color, setColor,
              price, setPrice,
              aiSuggestions, setAiSuggestions,
              cartNumber, setCartNumber,
              favNumber, setFavNumber,
              aiTaskId, setAiTaskId,
              dictionaryId, setDictionaryId,
              isActive, setIsActive,
              menuOpen, setMenuOpen,
              productPopupIsShown, setProductPopupIsShown,
              productPopupInfo, setProductPopupInfo,
              productPopupTitle, setProductPopupTitle,
              isSaveDesign, setisSaveDesign
            }}>
              {children}
            </AppContext.Provider>
        )
    }
    </div>
  );
};
