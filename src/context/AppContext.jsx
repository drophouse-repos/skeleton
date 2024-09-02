import React, { createContext, useState, useEffect } from 'react';
import { loadState } from '../utils';
import Loader from '../components/loader'
import LoadingPage from '../components/newloader';
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState(loadState('prompt', '', 'appState'));
  const [apparel, setApparel] = useState(loadState('apparel', 'tshirt','appState'));
  const [size, setSize] = useState(loadState('size', 'M', 'appState'));
  const [color, setColor] = useState(loadState('color', 'white','appState'));
  const [price, setPrice] = useState(loadState('price', 50, 'appState'));
  const [cartNumber, setCartNumber] = useState(loadState('cartItems', 0, 'appState'));
  const [aiSuggestions, setAiSuggestions] = useState(loadState('ai_suggestions', [], 'appState'));
  const [aiTaskId, setAiTaskId] = useState(loadState('aiTaskId', 0, 'appState'));
  const [dictionaryId, setDictionaryId] = useState(loadState('aiTaskId', '', 'appState'));
  const [isActive, setIsActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    setLoading(true);
    const state = { prompt, apparel, size, color, price, aiSuggestions };
    sessionStorage.setItem('appState', JSON.stringify(state));
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
              aiTaskId, setAiTaskId,
              dictionaryId, setDictionaryId,
              isActive, setIsActive,
              menuOpen, setMenuOpen
            }}>
              {children}
            </AppContext.Provider>
        )
    }
    </div>
  );
};
