import FileSaver from 'file-saver';
import { randomPrompts } from '../data';
import { v4 as uuidv4 } from 'uuid';
import { useContext } from 'react';
import prompts from '../data/prompts.json'; // Adjust the path as needed

  export const getRandomPrompt = () => {
    if (Array.isArray(prompts) && prompts.length > 0) {
      const randomIndex = Math.floor(Math.random() * prompts.length);
      return prompts[randomIndex];
    } else {
      console.error("Prompts file is empty or not an array.");
      return null;
    }
  };

  export async function downloadImage(photo) {
    const _id = uuidv4();
    FileSaver.saveAs(photo, `download-${_id}.jpg`);
  }

  export const getSessionID = () => {
    let sessionID = sessionStorage.getItem('sessionID');
    if (!sessionID) {
      sessionID = uuidv4(); 
      sessionStorage.setItem('sessionID', sessionID);
    }
    return sessionID;
  };
  
  export async function handleCheckout(obj_data) {
      try {
      const {apparel, color, size, email, sessionID} = obj_data;
        const response = await fetch(process.env.REACT_APP_BACKBONE + '/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ apparel: apparel, color: color, size: size, email: email, sessionID: sessionID }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
      } else {
          throw new Error('Stripe session URL not received');
      }
      } catch (error) {
        console.error('Failed to create checkout session', error);
        alert('Failed to create checkout session: ' + error.message);
      }
    };

  export const loadState = (key, defaultValue, storageName) => {
	try {
	  const savedState = localStorage.getItem(storageName);
	  if (savedState) {
		const state = JSON.parse(savedState);
		return state[key] !== undefined ? state[key] : defaultValue;
	  } else {
		return defaultValue;
	  }
	} catch (err) {
	  console.error('Error reading from localStorage:', err);
	  return defaultValue;
	}
  };

  export const handleFailure = (error) => {
    console.error("Google login failed:", error);
  };

 export function splitName(fullName) {

   fullName = fullName.trim();

   if (!fullName.includes(" ")) {
     return { firstName: fullName, lastName: "" };
   }
   const parts = fullName.split(" ");
   const prefixesAndSuffixes = ["Jr", "Sr", "II", "III", "IV", "V", "Dr", "Mr", "Mrs", "Miss", "Ms"];
   const lastNameParts = parts.slice(-1);
   if (parts.length > 2 && prefixesAndSuffixes.includes(parts.at(-2).replace(".", ""))) {
     lastNameParts.unshift(parts.slice(-2, -1)[0]);
   }
   if (parts.length > 2 && parts.at(-2).includes("-")) {
     lastNameParts.unshift(parts.slice(-2, -1)[0]);
   }
 
   // Assume the first part is the firstName and the rest is lastName
   const firstName = parts.slice(0, parts.length - lastNameParts.length).join(" ");
   const lastName = lastNameParts.join(" ");
 
   return { firstName, lastName };
  };


  export const updateFavicon = (iconUrl) => {
    const link = document.getElementById('dynamic-favicon');
    if (link) {
      link.href = iconUrl;
    } else {
      const newLink = document.createElement('link');
      newLink.id = 'dynamic-favicon';
      newLink.rel = 'icon';
      newLink.href = iconUrl;
      document.head.appendChild(newLink);
    }
  };