import axiosInstance from '../axiosInstance';

export async function postAuthData({email, firstName, lastName, phoneNumber, navigate}) {
    try {
        const payload = {
            email,
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
        };
        const response = await axiosInstance.post("/auth", payload);
        return {success: true};
    } catch (error) {
        return handleHttpError(error, navigate, 'postAuthData')
    }
}

export const fetchImage = async (prompt, setGeneratedImage, navigate) => {
    if (prompt) {
        try {
            const response = await axiosInstance.post("/generate_image", { prompt });
            const data = response.data;
            if (response.status !== 200) throw new Error(data.message);
            setGeneratedImage({
                photo: `data:image/jpeg;base64,${data.photo}`,
                altText: prompt,
                img_id: data.img_id,
            });
            return {success: true};
        } catch (err) {
            return handleHttpError(err, navigate, "fetchImage")
        } 
    } else {
        alert('Please provide a proper prompt');
    }
};

export const fetchFavoriteImages = async (setLikedProducts, navigate) => {
    try {
        const response = await axiosInstance.get("/get_liked_images");
        const data = response.data;
        if (response.status !== 200) 
            throw new Error('Failed to fetch favorite images');
        setLikedProducts(data.liked_images);
    } catch (err) {
        return handleHttpError(err, navigate, 'fetchFavoriteImages')
    }
};

export async function fetchPostLike(liked, img_id, prompt, navigate) {
    try {
        // Prepare the request payload
        const payload = {
            img_id: img_id,
            prompt: prompt,
            like: liked,
        };
        const response = await axiosInstance.post('/like_image', payload);
        return {success: true};
    } catch (err) {
        return handleHttpError(err, navigate, 'fetchPostLike')
    }
}

export const fetchPrices = async () => {
    try {
        const response = await axiosInstance.post('/get_prices');
        if (response.status !== 200) throw new Error('Failed to get prices');
            return response.data;
    } catch (err) {
        return 0;
    }
};

export const fetchCartItems = async (navigate) => {
    try {
        const response = await axiosInstance.get("/view_cart");
        const data = response.data;
        if (response.status !== 200) throw new Error('Failed to fetch cart Items');
        //setCartItems(data);
        return data;
    } catch (err) {
        return handleHttpError(err, navigate, 'fetchCartItems')
    }
};

export const fetchRemoveFromCart = async (img_id, navigate, setCartNumber) => {
    try {
        const response = await axiosInstance.post('/remove_from_cart', {"img_id": img_id});
        if (response.status !== 200) throw new Error('Failed to remove cart Items');
        else {
            setCartNumber(prev => prev - 1);
            return {success: true};
        }
    } catch (err) {
        return handleHttpError(err, navigate, 'fetchRemoveFromCart')
    }
};

export const fetchCartNumber = async () => {
    try {
        const response = await axiosInstance.get('/get_cart_number');
        if (response.status !== 200) throw new Error('Failed to get cart number');
            return response.data;
    } catch (err) {
        return 0
    }
};

export const fetchMoveToAnotherCart = async (item, navigate) => {
    try {
        const response = await axiosInstance.post('/move_to_another_cart', item);
        if (response.status !== 200) throw new Error('Failed to move item to cart');
        return {success: true};
    } catch (err) {
        return handleHttpError(err, navigate, 'fetchMoveToCart')
    }
};

export const fetchShippingInfo = async (setShippingInfo, navigate) => {
    try {
        const response = await axiosInstance.get("/get_shipping_information");
        const data = response.data;
        if (response.status !== 200) throw new Error('Failed to fetch shippingInfo');
        setShippingInfo(data);
        return data;
    } catch (err) {
        return handleHttpError(err, navigate, 'fetchShippingInfo')
    }
};

export const fetchUpdateShippingInfo = async (shipping_info, navigate) => {
    try {
        const response = await axiosInstance.post('/update_shipping_information', shipping_info);
        if (response.status == 200){
            return {success: true};
        }
    } catch (err) {
        console.error("Error:", err);
        return handleHttpError(err, navigate, 'fetchUpdateShippingInfo')
    }
};

export const fetchOrderHistory = async (navigate) => {
    try {
        const response = await axiosInstance.get("/get_order_history");
        if (response.status !== 200) throw new Error('Failed to fetch shippingInfo');
        const data = response.data;
        return data;
    } catch (err) {
        handleHttpError(err, navigate, 'fetchOrderHistory')
    }
};

export const fetchBasicUserInfo = async (navigate) => {
    try {
        const response = await axiosInstance.get("/get_basic_info");
        const data = response.data;
        if (response.status !== 200) throw new Error('Failed to fetch shippingInfo');
        return data;
    } catch (err) {
        handleHttpError(err, navigate, 'fetchBasicUserInfo')
    }
};

export const fetchAddToCart = async (item, navigate) => {
    try {
        const response = await axiosInstance.post('/add_to_cart', item);
        if (response.status !== 200) throw new Error('Failed to add Items');
        return {success: true};
    } catch (err) {
        return handleHttpError(err, navigate, 'fetchAddToCart')
    }
};

export const fetchSaveImg = async (item, navigate) => {
    try {
        const response = await axiosInstance.post('/save_img', item);       
        if (response.status !== 200) throw new Error('Failed to add Items');
        return {success: true};
    } catch (err) {
        return handleHttpError(err, navigate, 'fetchAddToCart')
    }
};

export const fetchAskAi = async (prompt, setAiSuggestions, setAiTaskId, setDictionaryId, navigate) => {
    if (prompt) {
        try {
            const response = await axiosInstance.post("/ask_gpt", { prompt });
            const data = response.data;
            setAiSuggestions(data.response);
            setAiTaskId(data.response.task_id);
            if (response.status !== 200) throw new Error(data.message);
            return {success: true};
        } catch (err) {
            return handleHttpError(err, navigate,'fetchAskAi')
        } 
    } else {
        alert('Please provide a proper prompt');
    }
};

export const createStudentCheckout = async (data, navigate) => {
    try {
        const response = await axiosInstance.post(`/create-student-checkout`, data);
        if (response.data) {
            window.location.href = "/success";
        }   
    } 
    catch (error) {
        console.error("Error:", error);
        return handleHttpError(error, navigate,'createCheckoutSession')
    }
}

export const createCheckoutSession = async (data, navigate) => {
    try {
        const response = await axiosInstance.post(`/create-checkout-session`, data);
        if (response.data) {
            window.location.href = response.data.url;
        }   
    } 
    catch (error) {
        console.error("Error:", error);
        return handleHttpError(error, navigate,'createCheckoutSession')
    }
}

export const createCheckoutSessionCart = async (data) => {
    try {
        const response = await axiosInstance.post(`/create-checkout-session-cart`, data);
        if (response.data) {
            window.location.href = response.data.url;
          } else {
          }   
    } catch (error) {
        console.error("Error:", error);
    }
}

export const fetchGetImage = async (request, setGeneratedImage, setEditedImage, navigate) =>{
    try {
        const response = await axiosInstance.post("/get_image", request);
        const data = response.data;
        if (response.status !== 200) throw new Error(data.message);
        setGeneratedImage({
            photo: `data:image/jpeg;base64,${data.photo}`,
            altText: request.prompt,
            img_id: data.img_id,
        });
        setEditedImage(`data:image/jpeg;base64,${data.photo}`);
        return {success: true};
    } catch (err) {
        return handleHttpError(err, navigate,'fetchGetImage')
    } 
}

export const fetchStorePrompt = async(promptsInfo, navigate) => {
    try {
        const response = await axiosInstance.post('/store_prompt', promptsInfo);
        if (response.status !== 200) throw new Error('Failed to store prompt');
        return {success: true};
    } catch (err) {
        return handleHttpError(err, navigate, 'fetchStorePrompt')
    }
}

export const fetchImageUrl = async(img_id, navigate) => {
    try {
        const response = await axiosInstance.get('/get_image_url',  { params: { img_id } });
        if (response.status !== 200) throw new Error('Failed to fetch url');
        return response.data.url;
    } catch (err) {
        return handleHttpError(err, navigate, 'fetchImageUrl')
    }
}

export const fetchIsLiked = async(img_id, setIsLiked, navigate) => {
    try {
        const request = {"img_id": img_id}
        const response = await axiosInstance.post('/get_is_liked', request);
        if (response.status !== 200) throw new Error('Failed to get if image is liked');
        setIsLiked(response.data)
        return {success: true};
    } catch (err) {
        return handleHttpError(err, navigate, 'fetchIsLiked')
    }
}

export const fetchUpdateBasicInfo = async(basicInfo, navigate) => {
    try {
        const response = await axiosInstance.post('/update_basic_info', basicInfo);
        if (response.status !== 200) throw new Error('Failed to update basic Info');
        return {success: true};
    } catch (err) {
        return handleHttpError(err, navigate, 'fetchUpdateBasicInfo')
    }
}

export const fetchSendEmail = async(request, navigate) => {
    try {
        const response = await axiosInstance.post('/send_email', request);
        if (response.status !== 200) throw new Error('Failed to send email');
        return {success: true};
    } catch (err) {
        return handleHttpError(err, navigate, 'fetchSendEmail')
    }
}

export const fetchImageBase64 = async(signed_url) => {
    try{
        const imageUrl  = await fetch(signed_url,  {
            method: 'GET',
            mode: 'cors',
            cache: "no-cache",
        });

        const blob = await imageUrl.blob();
        const reader = new FileReader();
        const convertBase64Promise = new Promise((resolve, reject) => {
        reader.onloadend = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        });
        reader.readAsDataURL(blob);

        return await convertBase64Promise;
    }catch (err) {
        console.log("Fetch Saved Signed Image Url Fail");
    }
}


export const fetchOrganisationlist = async (navigate) => {
    try {
        const response = await axiosInstance.post("/organisation_list");
        const data = response.data;
        if (response.status !== 200) throw new Error('Failed to fetch Organisations');
        return data;
    } catch (err) {
        return handleHttpError(err, navigate, 'fetchOrganisationlist')
    }
};

function handleHttpError(err, navigate, funcName) {
    if (err.response) {
        const status = err.response.status;
        const _message = (err.response.data && err.response.data && err.response.data.detail && (typeof err.response.data.detail == "string"))
         ?  err.response.data.detail : (err.response.data.detail && err.response.data.detail.message) 
         ? err.response.data.detail.message : err.response.data.toString();
        
        switch (status) {
            case 400:
                return { success: false, message: _message, navigated: false }; // Indicate no navigation
            case 401:
                navigate('/auth')
                return { success: false, navigated: true }; // Indicate navigation
            case 422:
                return { success: false, message: _message ? _message : "Your input is unprocessible.", navigated: false }; // Indicate no navigation
            case 429:
                navigate(`/error?message=${encodeURIComponent("Rate Limit Exceeded")}&source=${encodeURIComponent(funcName)}`);
                return { success: false, navigated: true }; // Indicate navigation
            default:
                // const message = err.response && err.response.data ? err.response.data.detail : err.detail;
                navigate(`/error?message=${encodeURIComponent(_message)}&source=${encodeURIComponent(funcName)}`);
                return { success: false, navigated: true }; // Indicate navigation
        }
    }
    return { success: false, navigated: false }; // Indicate no navigation if no response
}