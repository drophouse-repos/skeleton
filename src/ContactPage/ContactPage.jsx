
import React, {useState, useContext} from 'react';
import ClassInput from '../components/ClassInput';
import ClassTextArea from '../components/ClassTextArea';
import ClassButton from '../components/ClassButton';
import { fetchSendEmail } from '../utils/fetch';
import { useNavigate } from "react-router-dom";
import MessageBanner from "../components/MessageBanner";
import { MessageBannerContext } from "../context/MessageBannerContext";
const DrophouseContactEmail = "support@drophouse.art";
import { Orgcontext } from '../context/ApiContext';

export default function ContactPage(){
    const { orgDetails } = useContext(Orgcontext)
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const {
        showMessageBanner,
        setShowMessageBanner,
        messageBannerText,
        setMessageBannerText,
        bannerKey,
        setBannerKey
      } = useContext(MessageBannerContext);
    const handleSubmit = (e) => {
        if(email === '' || name === '' || message === ''){
            setMessageBannerText("Missing Required Fields");
            setShowMessageBanner(true);
            setBannerKey(prevKey => prevKey + 1);
            return;
        }
        const request={
            "email": email,
            "name": name,
            "message": message
        }
        fetchSendEmail(request, navigate)
        .then(succeeded => {
            if (!succeeded.success) {
                if (succeeded.navigated)
                  return
                setMessageBannerText(succeeded.message);
                setShowMessageBanner(true);
                setBannerKey(prevKey => prevKey + 1);
                return;
              }else{
                setMessageBannerText("Thank you for contacting us!");
                setShowMessageBanner(true);
                setBannerKey(prevKey => prevKey + 1);
                return;
              }
          })
    }

    return (
        <div className="flex flex-col w-10/12 h-full" style={{}}>
            {showMessageBanner && <MessageBanner message={messageBannerText} keyTrigger={bannerKey} />}
            <div className="h-[50px]"></div>
            <div className="h-8"></div>
            <div className='flex flex-col text-white h-24 text-5xl text-center justify-center' style={{fontFamily : `${orgDetails[0].font}`, backgroundColor: `${orgDetails[0].theme_color}`}}>
                CONTACT
            </div>
            <div className="h-8"></div>
            <div className="flex flex-col md:flex-row space-y-10 md:space-x-10">
                <div className="md:w-8/12 border-2 border-neutral-300 px-5">
                    <div className="h-8"></div>
                    <h1 className="text-4xl mb-2" style={{fontFamily : `${orgDetails[0].font}`}}>Contact us</h1>
                    <p className="text-gray-500 text-lg" style={{fontFamily : `${orgDetails[0].font}`}}>Reach out to us with your ideas, feedback, or inquiries! At Drophouse, your voice fuels our innovation. Connect with us through email or social media. Let's make your apparel dreams a reality together. Your journey of expression starts here.</p>
                    <div className=''>
                        <div className='flex flex-col space-y-2'>
                            <h2 className='text-start' style={{fontFamily : `${orgDetails[0].font}`}}>NAME</h2>
                            <ClassInput placeholder="Enter your name" onChange={setName} />

                            <h2 className='text-start' style={{fontFamily : `${orgDetails[0].font}`}}>EMAIL ADDRESS</h2>
                            <ClassInput placeholder="Enter your email" onChange={setEmail} />

                            <h2 className='text-start' style={{fontFamily : `${orgDetails[0].font}`}}>Message</h2>
                            <ClassTextArea placeholder="Enter your message" onChange={setMessage} />

                            <ClassButton text="SUBMIT" className="bg-black text-white border-2 border-white px-4 text-xl h-12" onClick={handleSubmit} />
                        </div>
                        <div className="h-6"></div>
                    </div>
                </div>
                <div className="w-full md:w-4/12">
                    <div className='w-full'>
                        <h2 className="text-start text-gray-900 text-lg" style={{fontFamily : `${orgDetails[0].font}`}}>OUR OFFICE</h2>
                        <p className="text-start text-gray-500 text-lg" style={{fontFamily : `${orgDetails[0].font}`}}>415 N CASS AVE WESTMONT, IL, 60559</p>
                    </div>
                    <div className="h-6"></div>
                    <div className='w-full'>
                        <h2 className="text-start text-gray-900 text-lg" style={{fontFamily : `${orgDetails[0].font}`}}>CONTACT</h2>
                        <p className="text-start text-gray-500 text-lg" style={{fontFamily : `${orgDetails[0].font}`}}>{DrophouseContactEmail}</p>
                        <p className="text-start text-gray-500 text-lg" style={{fontFamily : `${orgDetails[0].font}`}}>+1 (312) 544-9842</p>
                    </div>
                </div>
            </div>
        </div>
    );
}