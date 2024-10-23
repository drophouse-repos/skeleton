import React, { useState, useEffect, useRef } from 'react';
import "./InformationPage.css";
import { useContext } from 'react';
import { MessageBannerContext } from "../context/MessageBannerContext";
import MessageBanner from "../components/MessageBanner";
import { OrderContext } from '../context/OrderContext';
import { useNavigate } from 'react-router';
import { fetchShippingInfo, fetchUpdateShippingInfo } from '../utils/fetch';
import { USStatesNames } from '../utils/USStateNames';
import { Modal, Input, Select } from "antd";
import { FormOutlined } from "@ant-design/icons";
import SelectableCard from '../components/SelectableCard';
import { useLocation } from 'react-router-dom';
import { createCheckoutSession, createStudentCheckout, fetchcountrylist, fetchstatelist } from '../utils/fetch';
import ClassInput from '../components/ClassInput';
import { Orgcontext } from '../context/ApiContext';
import { useUser } from "../context/UserContext";

const emailRegex = /\S+@\S+\.\S+/;
import {
  LoadScript,
  StandaloneSearchBox,
} from '@react-google-maps/api';
const libraries = ['places'];
const apiKey = process.env.REACT_APP_GOOGLE_API;

const InformationPage = () => {
  const { user } = useUser();
  const location = useLocation();
  const searchBoxRef = useRef(null);
  const { productInfo } = location.state || {};
  
  const initialFormData = () => {
    const savedFormData = sessionStorage.getItem('formData');
    return savedFormData ? JSON.parse(savedFormData) : {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      streetAddress: '',
      streetAddress2: '',
      city: '',
      country: 'United States',
      stateProvince: '',
      postalZipcode: '',
    };
  };
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [shippingInfo, setShippingInfo] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [selectedId, setSelectedId] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAddressType, setModalAddressType] = useState("");
  const [modalData, setModalData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    country: '',
    state: '',
    zipCode: '',
  });
  const [countryList, setCountryList] = useState([])
  const [countryMap, setCountryMap] = useState({});

  useEffect(() => {
    if(!user.isLoggedIn)
      navigate('/auth')
  }, [user])
  
  useEffect(()=>{
    const fetchCountryList = async () => {
      try {
          const fetch = await fetchcountrylist()
          const countryListData = Object.values(fetch).map(item => ({
              value: item.country_short_name,
              label: item.country_name
          }))
          setCountryList(countryListData)
          const countryData = fetch.reduce((acc, item) => {
            acc[item.country_short_name] = item.country_name;
            return acc;
          }, {});
          setCountryMap(countryData)
      } catch {
        console.error("error fetching country list")
      }
    }
    fetchCountryList();
  },[])
  const [stateList, setStateList] = useState([])
  const handleCountryChange = async (selectedoption,changestate) => {
    if(changestate){
      handleModalInputChange('state',null)
    }
    try{
      handleModalInputChange('country',selectedoption)
      const fetch = await fetchstatelist(countryMap[selectedoption])
      const stateListData = Object.values(fetch).map(item => ({
        value: item.state_name,
        label: item.state_name
      }))
      setStateList(stateListData)
    } catch(err) {
      console.error("error fetching state list : ",err);
    }
  }
  


  const { orgDetails, env } = useContext(Orgcontext)

  const {
    showMessageBanner,
    setShowMessageBanner,
    messageBannerText,
    setMessageBannerText,
    bannerKey,
    setBannerKey
  } = useContext(MessageBannerContext);
  useEffect(()=> {
    setShowMessageBanner(false)
  },[])
  const {isOrderPlaced} = useContext(OrderContext)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isConfirmOrder, setisConfirmOrder] = useState(false);
  const closeConfirmationModal = () => setIsConfirmationModalOpen(false);

  useEffect(() => {
    if(isConfirmOrder)
    {
      setIsConfirmationModalOpen(false)
      handleSubmit()
    }
  }, [isConfirmOrder])
  
  useEffect(() => {
    prefillModal('primary')
  }, [shippingInfo])

  useEffect(() => {
    setTermsAccepted(false);
    const isValidEmail = emailRegex.test(formData.email);
    const areAllFieldsFilled = Object.entries(formData).every(([key, value]) =>
      key === 'streetAddress2' || value.trim() !== '' // Exclude 'streetAddress2' from mandatory fields
    );
    setIsFormValid(isValidEmail && areAllFieldsFilled);
    fetchShippingInfo(setShippingInfo, navigate)
    .then(result => {
      if(result.shipping_info.length === 0){
        setModalAddressType("primary")
        prefillModal("primary")
        setIsModalOpen(true)
      }
    })
  }, [updateTrigger]);

  const forceUpdate = () => {
    setUpdateTrigger(prev => !prev);
    setIsLoading(true) 
  };
  useEffect(() => {
    setIsLoading(false);
  }, [updateTrigger]);

  function findAddress(type) {
    let shipping_info = shippingInfo.shipping_info
    if (!shipping_info)
      return '';
    for (let i = 0; i < shipping_info.length; i++) {
      if (shipping_info[i].addressType === type) {
        return shipping_info[i];
      }
    }
    return '';
  }

  const renderShippingInfoContent = (shippingInfo) => {
    if (!shippingInfo || shippingInfo === '') {
      return <p className="text-lg" style={{fontFamily : `${orgDetails.font}`}}>Not Applicable</p>;
    } else {
      return (
        <div>
          <br />
          <p className="text-lg" style={{fontFamily : `${orgDetails.font}`}}>{shippingInfo.firstName} {shippingInfo.lastName}</p>
          <p className="text-lg" style={{fontFamily : `${orgDetails.font}`}}>{shippingInfo.streetAddress} {shippingInfo.streetAddress2}, {shippingInfo.city}, {shippingInfo.stateProvince}, {shippingInfo.postalZipcode}</p>
          <p className="text-lg" style={{fontFamily : `${orgDetails.font}`}}>{shippingInfo.email}</p>
          <p className="text-lg" style={{fontFamily : `${orgDetails.font}`}}>{shippingInfo.phone}</p>
        </div>
      );
    }
  };

  const handleCardClick = (index) => {
    setSelectedId(prev => (prev === index ? null : index));
  };

  const handleAddressItemEdit = () => {
    const { firstName, lastName, email, phone, address1, address2, city, country, state, zipCode } = modalData;
    if (!firstName || !lastName || !email || !phone || !address1 || !city || !country || !state || !zipCode) {
      setMessageBannerText('Please fill in all required fields.');
      setShowMessageBanner(true);
      setBannerKey(prevKey => prevKey + 1);
      return;
    } else if (!emailRegex.test(email)) {
      setMessageBannerText('Please fill in a valid email.');
      setShowMessageBanner(true);
      setBannerKey(prevKey => prevKey + 1);
      return;
    }

    const new_shipping_info = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      streetAddress: address1,
      streetAddress2: address2,
      city: city,
      country: country,
      stateProvince: state,
      postalZipcode: zipCode,
      addressType: 'primary'
    }

    fetchUpdateShippingInfo(new_shipping_info, navigate)
    .then((data)=>{
      if(data.success)
      {
        setTimeout(()=>{
          forceUpdate()
        }, 1000)
        return;
      }
      setMessageBannerText(data.message);
      setShowMessageBanner(true);
      setBannerKey(prevKey => prevKey + 1);
      return;
    })
    resetModal();
    setIsModalOpen(false);
  }
  const handleCancel = () => {
    resetModal();
    setIsModalOpen(false);
    setIsLoading(false)
  }

  const resetModal = () => {
    setModalData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address1: '',
      address2: '',
      city: '',
      country: '',
      state: '',
      zipCode: ''
    });
  };
  const handleSubmit = async (e) => {
    if(e) e.preventDefault();
    if(isOrderPlaced)
    {
      window.location.href = "/user";
      return;
    }
    productInfo["shipping_info"] = findAddress('primary');
    productInfo["org_id"] = orgDetails.org_id;
    productInfo["org_name"] = orgDetails.name;
    if(productInfo['shipping_info'] && productInfo['shipping_info']['firstName'] && productInfo['shipping_info']['email'] && productInfo['shipping_info']['lastName'] && productInfo['shipping_info']['phone'] && productInfo['shipping_info']['postalZipcode'] && productInfo['shipping_info']['stateProvince'] && productInfo['shipping_info']['streetAddress'] && productInfo['shipping_info']['city'])
    {
    if(env?.STRIPE_CHECKOUT_ENABLED === false)
    {
      if(!isConfirmOrder)
      {
        setIsConfirmationModalOpen(true)
        return;
      }
    }
  }
  else
    {
      setMessageBannerText("Please fill address details");
      setShowMessageBanner(true);
      setBannerKey(prevKey => prevKey + 1);
      setIsLoading(false);
      return;
    }
    setIsLoading(true); // Set loading to true when checkout starts

    if (!termsAccepted || !selectedId) {

      let message = '';

      if (!termsAccepted) {
        message = 'Please accept the terms and conditions.';
      } else if (!selectedId) {
        message = 'Please pick a shipping address.';
      } else {
        message = 'The selected shipping address is not applicable.'
      }
      setMessageBannerText(message);
      setShowMessageBanner(true);
      setBannerKey(prevKey => prevKey + 1);
      setIsLoading(false);
      return;
    }
    try {
      if(env?.STRIPE_CHECKOUT_ENABLED === false){
        createStudentCheckout(productInfo, navigate)
        .then((data)=>{
          setMessageBannerText(data.message);
          setShowMessageBanner(true);
          setBannerKey(prevKey => prevKey + 1);
          setIsLoading(false);
          return;
        }) // await?
      }
      else{
        createCheckoutSession(productInfo, navigate); // await? 
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setIsLoading(false); 
    }
  };

  const prefillModal = (addressType) => {
    const currentAddress = findAddress(addressType);
    handleCountryChange(currentAddress.country,false)
    if (currentAddress) {
      setModalData({
        firstName: currentAddress.firstName,
        lastName: currentAddress.lastName,
        email: currentAddress.email,
        phone: currentAddress.phone,
        address1: currentAddress.streetAddress,
        address2: currentAddress.streetAddress2,
        city: currentAddress.city,
        country: currentAddress.country,
        state: currentAddress.stateProvince,
        zipCode: currentAddress.postalZipcode
      });
    }
  };
  
  const handleModalInputChange = (field, value) => {
    setModalData(prev => ({ ...prev, [field]: value }));
  };
  const onPlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (places.length === 0) return;

    const place = places[0];
    const addressComponents = place.address_components;
    if(!addressComponents)
      return
    handleModalInputChange('address1', place.name)
    addressComponents.forEach(component => {
      const { types, long_name, short_name } = component;
      if (types.includes('country')) {
        handleModalInputChange('country', short_name);
        handleCountryChange(short_name, false)
      }
      if (types.includes('administrative_area_level_3') || types.includes('locality')) {
        handleModalInputChange('city', long_name);
      } 
      if (types.includes('administrative_area_level_1')) {
        handleModalInputChange('state', long_name);
      } 
      if (types.includes('postal_code')) {
        handleModalInputChange('zipCode', long_name);
      }
    });
  };
  const getIconForField = (field) => {
    const iconMap = {
      firstName: 'person',
      lastName: 'person',
      email: 'email',
      phone: 'phone',
      address1: 'location_on',
      address2: 'location_on',
      city: 'location_city',
      zipCode: 'mail',
      state: 'location_on'
    };
  
    // Return the icon name from the map or a default icon
    return iconMap[field] || 'help'; // 'help' is a fallback icon
  };
  const [DemoModal, setDemoModal] = useState(false);
  const ShowDemoModal = (e) => {
    e.preventDefault();
    setDemoModal(!DemoModal);
  }
  const CloseShowDemoModal = (e) => {
    e.preventDefault();
    setDemoModal(!DemoModal);
  }
  
  return (
    <div>
      {showMessageBanner && <MessageBanner message={messageBannerText} keyTrigger={bannerKey} />}
      {isConfirmationModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{zIndex: `9999`}}>
              <div className="bg-white p-4 rounded shadow-lg" style={{width: '50%'}}>
                  <h2 className="text-lg font-bold mb-4">Are you sure, want to place an order ?</h2>
                  <div className="flex justify-end mt-4">
                      <button
                          className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-3 rounded mr-2"
                          onClick={closeConfirmationModal}
                      >
                          Cancel
                      </button>
                      <button
                          className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
                          onClick={() => setisConfirmOrder(true)}
                      >
                          Yes
                      </button>
                  </div>
              </div>
          </div>
      )}
      <Modal
        title={<p className="text-lg" style={{fontFamily : `${orgDetails.font}`}}>{`Edit Address`}</p>}
        open={isModalOpen}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        closeIcon={false}
        zIndex={40}
        width={'80%'}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {['firstName', 'lastName', 'email', 'phone', 'address1', 'address2', 'city', 'country', 'zipCode'].map(field => (
            <div key={field}>
              <h2 className='text-start'>{field === 'address2' ? 'BUILDING/UNIT NO. ' : field==='address1' ? 'ADDRESS LINE' : field.replace(/([A-Z])/g, ' $1').toUpperCase()}<span className="text-red-600 ml-2">{field === 'address2' ? '' : '*'}</span></h2>
              {field == 'address1' ?
                <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
                <StandaloneSearchBox
                  onLoad={ref => (searchBoxRef.current = ref)}
                  onPlacesChanged={onPlacesChanged}
                  className="custom-search-box"
                >
                  <div className="flex items-center border-2 border-neutral-300 w-full h-10 icon-infopage">
                    <span className="material-icons p-2">location_on</span>
                    <ClassInput
                      id={`modal${field}`}
                      placeholder='Address Line'
                      value={modalData[field]}
                      onChange={e => handleModalInputChange(field, e)}
                      className="flex-1 p-2 focus:outline-none focus:border-primary-500 input-infopage"
                    />
                  </div>
                </StandaloneSearchBox>
              </LoadScript>
              :
              <>
              {field == 'country' ? 
              <>
              <div className="flex items-center border-2 border-neutral-300 w-full h-10 icon-infopage">
                <span className="material-icons p-2">{getIconForField('state')}</span>
                <Select
                  id="modalCountry"
                  placeholder="SELECT COUNTRY"
                  value={modalData.country}
                  style={{ width: "100%", height: "40px", marginBottom: "10px", padding:"0px", borderColor:"lightgrey"
                  ,borderWidth:"2px", boxShadow:"none", borderRadius:'0px'}}
                  onChange={(selectedOption) => handleCountryChange( selectedOption, true )}
                  options={countryList}
                  className="border-2 border-neutral-300 w-full h-10 p-2 focus:outline-none focus:border-primary-500 input-infopage"
                />
                </div>
        </>:
              <div className="flex items-center border-2 border-neutral-300 w-full h-10 icon-infopage">
              <span className="material-icons p-2">{getIconForField(field)}</span>
              <ClassInput
                id={`modal${field}`}
                placeholder={field === 'address2' ? 'Building/Unit No. ' : field.replace(/([A-Z])/g, ' $1')}
                value={modalData[field]}
                onChange={e => handleModalInputChange(field, e)}
                className="flex-1 p-2 focus:outline-none focus:border-primary-500 input-infopage"
              />
            </div>}</>
              }
            </div>
          ))}
          <div>
            <h2 className='text-start' style={{fontFamily : `${orgDetails.font}`}}>STATE<span className="text-red-600 ml-2">*</span></h2>
            <div className="flex items-center border-2 border-neutral-300 w-full h-10 icon-infopage">
            <span className="material-icons p-2">{getIconForField('state')}</span>
              <Select id="modalState"
                placeholder="SELECT STATE"
                value={modalData.state}
                style={{ width: "100%", height: "40px", marginBottom: "10px", padding:"0px", borderColor:"lightgrey"
                ,borderWidth:"2px", boxShadow:"none", borderRadius:'0px'}}
                onChange={(value) => { handleModalInputChange('state', value)}}
                className="border-2 border-neutral-300 w-full h-10 p-2 focus:outline-none focus:border-primary-500 input-infopage"
                options={stateList} />
              </div>
          </div>
        </div>
        
          <br />
          <div className="flex flex-row w-full justify-end">
            <button className="bg-gray-200 text-black-100 font-extrabold py-2 px-4 rounded-full mr-5" onClick={handleCancel}>CANCEL</button>
            <button
              style={{fontFamily : `${orgDetails.font}`, backgroundColor: `${orgDetails.theme_color}`}}
              className="bg-sky-600 text-zinc-100 font-extrabold py-2 px-4 rounded-full text-lg"
              onClick={handleAddressItemEdit}
            >
              OK
            </button>
          </div>
      </Modal>


      <form className="infoForm" onSubmit={handleSubmit}>
        <div className="apparel-text font-bold text-lg" style={{fontFamily : `${orgDetails.font}`}}>Provide your information to continue</div>
        <SelectableCard index={1} onClick={handleCardClick} selected={selectedId === 1}>
          <h2 className="text-lg" style={{fontFamily : `${orgDetails.font}`}}>Address</h2>
          {renderShippingInfoContent(findAddress("primary"))}
          <FormOutlined
            onClick={(e) => {
              e.stopPropagation();
              setModalAddressType("primary")
              prefillModal("primary")
              setIsModalOpen(true)
              setIsLoading(true)
            }}
          />
        </SelectableCard>
        <div className="termsCheckbox">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={e => setTermsAccepted(e.target.checked)}
          />
          <label style={{fontFamily : `${orgDetails.font}`}}>
            I agree to the <a href="/Terms.pdf" target="_blank" style={{fontFamily : `${orgDetails.font}`}}>Terms and Conditions</a>
          </label>
        </div>
        {process.env.REACT_APP_DEMO ? 
        <><button className="continueBtn" onClick={(e) => ShowDemoModal(e)} style={{fontFamily : `${orgDetails.font}`, color: `${orgDetails.theme_color}`}}>
          ORDER
        </button><br></br>
        {DemoModal && 
        <>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{zIndex: `9999`}}>
              <div className="bg-white p-4 rounded shadow-lg" style={{width: window.innerWidth <= 544 ? '90%' :'50%'}}>
                  <h2 className="text-lg font-bold mb-4">This is a demo site for more details contact : <br></br>
                  <span style={{color: `${orgDetails.theme_color}`}}> support@drophouse.art</span></h2>
                  <div className="flex justify-end mt-4">
                      <button
                          className="bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded mr-2"
                          onClick={(e) => CloseShowDemoModal(e)}
                      >
                          Ok
                      </button>
                  </div>
              </div>
          </div>
        </>}
        </>
        : 
        <button className="continueBtn" type="submit" disabled={isLoading} style={{fontFamily : `${orgDetails.font}`, color: `${orgDetails.theme_color}`}}>
          {isLoading ? (
            <div className="snippet" data-title="dot-elastic">
          <div className="stage">
            <div className="dot-elastic"></div>
          </div>
        </div>
          ) : (
            `${(env?.STRIPE_CHECKOUT_ENABLED === true) ? `CHECKOUT` : `ORDER`}`
          )}
        </button>
}
      </form>
    </div>
  );
}
export default InformationPage;