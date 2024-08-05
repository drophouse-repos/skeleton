import { React, useEffect, useState, useContext, useRef } from "react";
import "./UserPage.css";
import { Modal, Input, Select } from "antd";
import { FormOutlined, LeftCircleOutlined } from "@ant-design/icons";
import { USStatesNames } from "../utils/USStateNames";
import { fetchBasicUserInfo, fetchOrderHistory, fetchShippingInfo, fetchUpdateBasicInfo, fetchUpdateShippingInfo } from "../utils/fetch";
import { useNavigate } from 'react-router';
import { PricesContext } from '../context/PricesContext';
import LazyLoad from 'react-lazyload';
import { Orgcontext } from "../context/ApiContext";
import { MessageBannerContext } from "../context/MessageBannerContext";
import MessageBanner from "../components/MessageBanner";
import ClassInput from '../components/ClassInput';
import {
  LoadScript,
  StandaloneSearchBox,
} from '@react-google-maps/api';
const libraries = ['places'];
const apiKey = process.env.REACT_APP_GOOGLE_API;

export default function UserPage() {
  const searchBoxRef = useRef(null);
  const [isNormalModalOpen, setIsNormalModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState("");
  const [shippingInfo, setShippingInfo] = useState([]);
  const [basicUserInfo, setBasicUserInfo] = useState(null);
  const [orderList, setOrderList] = useState([]);
  const [modalAddressType, setModalAddressType] = useState("");
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const {priceMap, getPriceNum} = useContext(PricesContext);
  const [baseModalData, setBaseModalData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
  });
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
  const { orgDetails } = useContext(Orgcontext)

  const navigate = useNavigate();
  useEffect(() => {
    prefillModal('primary')
  }, [shippingInfo])
  useEffect(() => {
    setBaseModalData(basicUserInfo)
  }, [basicUserInfo])
  useEffect(() => {
    fetchShippingInfo(setShippingInfo, navigate);
    fetchBasicUserInfo(navigate)
      .then(data => {
        setBasicUserInfo(data);
      });
    fetchOrderHistory(navigate)
      .then(orders => {
        let transformedData = [];
        if (orders != null) {
          orders.order_history.forEach(order => {
            order.item.forEach(item => {
              transformedData.push({
                imageSrc: item.thumbnail,
                title: `Customized ${orgDetails[0].name} ${item.color} ${item.apparel}`,
                type: item.apparel,
                color: item.color,
                size: item.size,
                price: getPriceNum(item.apparel.toLowerCase()),
                shippingStatus: order.status
              });
            });
          });
        }
        setOrderList(transformedData);
      });
  }, [priceMap, updateTrigger]);

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
  const refetchShippingInfo = () => {
    setUpdateTrigger(prev => !prev);  
  };

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

  function addressToString(shippingInfo, num) {
    if (shippingInfo === '') {
      if (num === 1) {
        return "No first Address"
      } else {
        return "No secondary Address"
      }
    } else {
      return `${shippingInfo.streetAddress} ${shippingInfo.streetAddress2}, ${shippingInfo.city}, ${shippingInfo.stateProvince}, ${shippingInfo.postalZipcode}`;
    }
  }

  function getName() {
    if (!basicUserInfo)
      return '';
    else
      return basicUserInfo.firstName + ' ' + basicUserInfo.lastName
  }

  function getEmail() {
    if (!basicUserInfo)
      return '';
    else
      return basicUserInfo.email
  }

  function getPhone() {
    if (!basicUserInfo)
      return '';
    else
      return basicUserInfo.phone
  }

  function closeModal() {
    resetModal()
    setIsAddressModalOpen(false)
    setIsNormalModalOpen(false)
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
    setBaseModalData({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    })
  };
  function EditBtn({ item, isAddress, addressType }) {
    const showModal = () => {
      if (isAddress) {
        prefillModal('primary')
        setIsAddressModalOpen(true);
      }
      else {
        setBaseModalData(basicUserInfo)
        setIsNormalModalOpen(true);
      }
    };

    return (
      <FormOutlined
        onClick={() => {
          setModalItem(item);
          setModalAddressType(addressType)
          showModal();
        }}
      />
    );
  }


  function handlePhoneEdit(phone) {
    const newBasicInfo = {
      "firstName": basicUserInfo.firstName,
      "lastName": basicUserInfo.lastName,
      "email": basicUserInfo.email,
      "phone": phone
    }
    fetchUpdateBasicInfo(newBasicInfo, navigate)
      .then(data => {
        refetchShippingInfo()
      })
    setIsNormalModalOpen(false)
  }

  function handleAddressItemEdit(firstName, lastName, email, phone, address1, address2, city, state, zip, addressType) {
    const new_shipping_info = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      streetAddress: address1,
      streetAddress2: address2,
      city: city,
      stateProvince: state,
      postalZipcode: zip,
      addressType: addressType
    }

    fetchUpdateShippingInfo(new_shipping_info, navigate)
    .then((data)=>{
      if(data.success)
      {
        refetchShippingInfo()
        return;
      }
      setMessageBannerText(data.message);
      setShowMessageBanner(true);
      setBannerKey(prevKey => prevKey + 1);
      return;
    })
    setIsAddressModalOpen(false)
  }

  function UserInfoItem({ label, value, showEditButton, addressType }) {
    return (
      <div className="flex flex-col justify-start items-start w-full">
        <div className="flex flex-row w-full whitespace-nowrap text-md font-extrabold" style={{fontFamily : `${orgDetails[0].font}`}}>
          {label}
          {showEditButton && (
            <div className="flex flex-row justify-end w-full m-auto">
              <EditBtn item={label} isAddress={label.includes("Address")} addressType={addressType} />
            </div>
          )}
        </div>
        <div className="text-zinc-500 text-lg text-start pl-4" style={{fontFamily : `${orgDetails[0].font}`}}>{value}</div>
      </div>
    );
  }


  function OrderItem({ order }) {
    return (
      <div className="flex flex-row w-full bg-gray-100 rounded-lg space-x-2 p-2">
        <div className="w-3/5 self-center">
          <img src={order.imageSrc} alt="" />
        </div>
        <div className="w-full">
          <ul>
            <li className="text-black text-xl text-left font-bold" style={{fontFamily : `${orgDetails[0].font}`}}>
              {order.title}
            </li>
            <li className="text-left text-gray-600 text-md" style={{fontFamily : `${orgDetails[0].font}`}}>
              ${order.price.toFixed(2)}
            </li>
            <li className="text-left text-gray-600 text-md" style={{fontFamily : `${orgDetails[0].font}`}}>
              Type: {order.type}
            </li>
            <li className="text-left text-gray-600 text-md" style={{fontFamily : `${orgDetails[0].font}`}}>
              Color: {order.color}
            </li>
            <li className="text-left text-gray-600 text-md" style={{fontFamily : `${orgDetails[0].font}`}}>
              Size: {order.size}
            </li>
            <li className="text-left text-gray-600 text-md" style={{fontFamily : `${orgDetails[0].font}`}}>
              Status: {order.shippingStatus}
            </li>
           
          </ul>
        </div>
      </div>
    );
  }

  const handleModalInputChange = (field, value) => {
    setModalData(prev => ({ ...prev, [field]: value }));
  };
  const handleBaseModalInputChange = (field, value) => {
    setBaseModalData(prev => ({ ...prev, [field]: value }));
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
      if (types.includes('administrative_area_level_3')) {
        handleModalInputChange('city', long_name);
      } 
      if (types.includes('administrative_area_level_1')) {
        handleModalInputChange('state', short_name);
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

  return (
    <div className="w-screen max-w-xl">
      {showMessageBanner && <MessageBanner message={messageBannerText} keyTrigger={bannerKey} />}
      <div className="px-5 py-14">
        <div className="user-info-container">
          <button
            onClick={() => navigate(-1)}
            className="back-button text-black-500 hover:text-blue-700"
          >
            <LeftCircleOutlined style={{ fontSize: '24px' }} />
          </button>
          <h1 className="text-2xl font-semibold">Account Information</h1>
        </div>
        <div className="flex flex-col px-5 items-start space-y-2">
          <Modal
            title={<p className="text-xl" style={{fontFamily : `${orgDetails[0].font}`}}>{`Edit ${modalItem}`}</p>}
            open={isNormalModalOpen}
            okButtonProps={{ style: { display: "none" } }}
            cancelButtonProps={{ style: { display: "none" } }}
            closeIcon={false}
            zIndex={40}
          >
            <h2 className='text-start text-lg mt-2' style={{fontFamily : `${orgDetails[0].font}`}}>New {modalItem}:<span className="text-red-600 ml-2">*</span></h2>
            <input id="modalPhone" className="border-2 border-neutral-300 w-full h-10 p-2 focus:outline-none focus:border-primary-500" placeholder="Phone Number" value={(baseModalData && baseModalData.phone) ? baseModalData.phone : ''}
            onChange={e => handleBaseModalInputChange('phone', e.target.value)} />

            <div className="flex flex-row w-full justify-end mt-3">
              <button className="bg-gray-200 text-black-100 font-extrabold py-2 px-4 rounded-full mr-5" onClick={closeModal}>CANCEL</button>
              <button
                style={{fontFamily : `${orgDetails[0].font}`, backgroundColor: `${orgDetails[0].theme_color}`}}
                className="bg-sky-600 text-zinc-100 font-extrabold py-2 px-4 rounded-full text-lg"
                onClick={() => { handlePhoneEdit(document.getElementById("modalPhone").value) }}
              >
                OK
              </button>
            </div>
          </Modal>

          <Modal
            title={`Edit ${modalItem}`}
            open={isAddressModalOpen}
            okButtonProps={{ style: { display: "none" } }}
            cancelButtonProps={{ style: { display: "none" } }}
            closeIcon={false}
            zIndex={40}
            width={'80%'}
          >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {['firstName', 'lastName', 'email', 'phone', 'address1', 'address2', 'city', 'zipCode'].map(field => (
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
              <div className="flex items-center border-2 border-neutral-300 w-full h-10 icon-infopage">
              <span className="material-icons p-2">{getIconForField(field)}</span>
              <ClassInput
                id={`modal${field}`}
                placeholder={field === 'address2' ? 'Building/Unit No. ' : field.replace(/([A-Z])/g, ' $1')}
                value={modalData[field]}
                onChange={e => handleModalInputChange(field, e)}
                className="flex-1 p-2 focus:outline-none focus:border-primary-500 input-infopage"
              />
            </div>
              }
            </div>
          ))}
          <div>
            <h2 className='text-start' style={{fontFamily : `${orgDetails[0].font}`}}>STATE<span className="text-red-600 ml-2">*</span></h2>
            <div className="flex items-center border-2 border-neutral-300 w-full h-10 icon-infopage">
            <span className="material-icons p-2">{getIconForField('state')}</span>
              <Select id="modalState"
                placeholder="SELECT STATE"
                value={modalData.state}
                style={{ width: "100%", height: "40px", marginBottom: "10px", padding:"0px", borderColor:"lightgrey"
                ,borderWidth:"2px", boxShadow:"none", borderRadius:'0px'}}
                onChange={(value) => { handleModalInputChange('state', value)}}
                className="border-2 border-neutral-300 w-full h-10 p-2 focus:outline-none focus:border-primary-500 input-infopage"
                options={USStatesNames} />
              </div>
          </div>
        </div>
            <div className="flex flex-row w-full justify-end mt-3">
                <button className="bg-gray-200 text-black-100 font-extrabold py-2 px-4 rounded-full mr-5" onClick={closeModal}>CANCEL</button>
                <button
                  style={{fontFamily : `${orgDetails[0].font}`, backgroundColor: `${orgDetails[0].theme_color}`}}
                  className="bg-sky-600 text-zinc-100 font-extrabold py-2 px-4 rounded-full text-lg"
                  onClick={() => handleAddressItemEdit(
                    document.getElementById("modalfirstName").value,
                    document.getElementById("modallastName").value,
                    document.getElementById("modalemail").value,
                    document.getElementById("modalphone").value,
                    document.getElementById("modaladdress1").value,
                    document.getElementById("modaladdress2").value,
                    document.getElementById("modalcity").value,
                    document.getElementById("modalState").currentValue ? document.getElementById("modalState").currentValue : "AL",
                    document.getElementById("modalzipCode").value,
                    modalAddressType
                  )}
                >
                  OK
                </button>
              </div>
          </Modal>

          <br /><br />
          <div className="text-black text-4xl font-bold pt-4" style={{fontFamily : `${orgDetails[0].font}`}}>
            {getName()}
          </div>

          <div className="border-2 h-0 border-zinc-500 w-full rounded-full"></div>

          <UserInfoItem label="Email" value={getEmail()} showEditButton={false} addressType="null" />
          <UserInfoItem label="Phone Number" value={getPhone()} showEditButton={true} addressType="null" />
          <UserInfoItem
            label="Primary Address"
            value={addressToString(findAddress('primary'), 1)}
            showEditButton={true}
            addressType="primary"
          />

          <div className="border-2 h-0 border-zinc-500 w-full rounded-full"></div>

          <div style={{fontFamily : `${orgDetails[0].font}`}} className="text-black text-3xl font-bold">
            Order History:
          </div>

          {orderList.map((order, index) => {
            return (
              <LazyLoad>
                <OrderItem order={order} key={index} />
              </LazyLoad>);
          })}
        </div>
      </div>
    </div>
  );
}