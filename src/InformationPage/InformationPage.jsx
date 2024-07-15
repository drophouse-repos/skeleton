import React, { useState, useEffect } from 'react';
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
import { createCheckoutSession, createStudentCheckout } from '../utils/fetch';
import ClassInput from '../components/ClassInput';
import { Orgcontext } from '../context/ApiContext';
const emailRegex = /\S+@\S+\.\S+/;

const InformationPage = () => {
  const location = useLocation();
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
    state: '',
    zipCode: '',
  });
  const { orgDetails } = useContext(Orgcontext)

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
      return <p className="text-lg" style={{fontFamily : `${orgDetails[0].font}`}}>Not Applicable</p>;
    } else {
      return (
        <div>
          <br />
          <p className="text-lg" style={{fontFamily : `${orgDetails[0].font}`}}>{shippingInfo.firstName} {shippingInfo.lastName}</p>
          <p className="text-lg" style={{fontFamily : `${orgDetails[0].font}`}}>{shippingInfo.streetAddress} {shippingInfo.streetAddress2}, {shippingInfo.city}, {shippingInfo.stateProvince}, {shippingInfo.postalZipcode}</p>
          <p className="text-lg" style={{fontFamily : `${orgDetails[0].font}`}}>{shippingInfo.email}</p>
          <p className="text-lg" style={{fontFamily : `${orgDetails[0].font}`}}>{shippingInfo.phone}</p>
        </div>
      );
    }
  };

  const handleCardClick = (index) => {
    setSelectedId(prev => (prev === index ? null : index));
  };

  const handleAddressItemEdit = () => {
    const { firstName, lastName, email, phone, address1, address2, city, state, zipCode } = modalData;
    if (!firstName || !lastName || !email || !phone || !address1 || !city || !state || !zipCode) {
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
    productInfo["org_id"] = orgDetails[0].org_id;
    productInfo["org_name"] = orgDetails[0].name;
    console.log(productInfo)
    if(productInfo['shipping_info'] && productInfo['shipping_info']['firstName'] && productInfo['shipping_info']['email'] && productInfo['shipping_info']['lastName'] && productInfo['shipping_info']['phone'] && productInfo['shipping_info']['postalZipcode'] && productInfo['shipping_info']['stateProvince'] && productInfo['shipping_info']['streetAddress'] && productInfo['shipping_info']['city'])
    {
    if(process.env.REACT_APP_STRIPE_CHECKOUT_ENABLED === "false")
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
      if(process.env.REACT_APP_STRIPE_CHECKOUT_ENABLED === 'false'){
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
    if (currentAddress) {
      setModalData({
        firstName: currentAddress.firstName,
        lastName: currentAddress.lastName,
        email: currentAddress.email,
        phone: currentAddress.phone,
        address1: currentAddress.streetAddress,
        address2: currentAddress.streetAddress2,
        city: currentAddress.city,
        state: currentAddress.stateProvince,
        zipCode: currentAddress.postalZipcode
      });
    }
  };
  
  const handleModalInputChange = (field, value) => {
    setModalData(prev => ({ ...prev, [field]: value }));
  };

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
        title={<p className="text-lg" style={{fontFamily : `${orgDetails[0].font}`}}>{`Edit Address`}</p>}
        open={isModalOpen}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        closeIcon={false}
        zIndex={40}
        width={'80%'}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {['firstName', 'lastName', 'email', 'phone', 'address1', 'address2', 'city', 'zipCode'].map(field => (
            <div key={field}>
              <h2 className='text-start'>{field.replace(/([A-Z])/g, ' $1').toUpperCase()}<span className="text-red-600 ml-2">*</span></h2>
              <ClassInput
                id={`modal${field}`}
                placeholder={field.replace(/([A-Z])/g, ' $1')}
                value={modalData[field]}
                onChange={e => handleModalInputChange(field, e)}
              />
            </div>
          ))}
          <div>
            <h2 className='text-start' style={{fontFamily : `${orgDetails[0].font}`}}>STATE<span className="text-red-600 ml-2">*</span></h2>
            <Select id="modalState"
              placeholder="SELECT STATE"
              value={modalData.state}
              style={{ width: "100%", height: "40px", marginBottom: "10px", padding:"0px", borderColor:"lightgrey"
              ,borderWidth:"2px", boxShadow:"none", borderRadius:'0px'}}
              onChange={(value) => { handleModalInputChange('state', value)}}
              options={USStatesNames} />
          </div>
        </div>
        
          <br />
          <div className="flex flex-row w-full justify-end">
            <button className="bg-gray-200 text-black-100 font-extrabold py-2 px-4 rounded-full mr-5" onClick={handleCancel}>CANCEL</button>
            <button
              style={{fontFamily : `${orgDetails[0].font}`, backgroundColor: `${orgDetails[0].theme_color}`}}
              className="bg-sky-600 text-zinc-100 font-extrabold py-2 px-4 rounded-full text-lg"
              onClick={handleAddressItemEdit}
            >
              OK
            </button>
          </div>
      </Modal>


      <form className="infoForm" onSubmit={handleSubmit}>
        <div className="apparel-text font-bold text-lg" style={{fontFamily : `${orgDetails[0].font}`}}>Provide your information to continue</div>
        <SelectableCard index={1} onClick={handleCardClick} selected={selectedId === 1}>
          <h2 className="text-lg" style={{fontFamily : `${orgDetails[0].font}`}}>Address</h2>
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
          <label style={{fontFamily : `${orgDetails[0].font}`}}>
            I agree to the <a href="/Terms.pdf" target="_blank" style={{fontFamily : `${orgDetails[0].font}`}}>Terms and Conditions</a>
          </label>
        </div>
        <button className="continueBtn" type="submit" disabled={isLoading} style={{fontFamily : `${orgDetails[0].font}`, color: `${orgDetails[0].theme_color}`}}>
          {isLoading ? (
            <div className="snippet" data-title="dot-elastic">
          <div className="stage">
            <div className="dot-elastic"></div>
          </div>
        </div>
          ) : (
            `${(process.env.REACT_APP_STRIPE_CHECKOUT_ENABLED == 'true') ? `CHECKOUT` : `ORDER`}`
          )}
        </button>
      </form>
    </div>
  );
}
export default InformationPage;