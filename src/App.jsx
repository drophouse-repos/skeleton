import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import InformationPage from './InformationPage/InformationPage';
import Legal from './components/Legal';
import { AppProvider } from './context/AppContext';
import { ImageProvider } from './context/ImageContext';
import { PricesProvider } from './context/PricesContext';
import { OrderProvider } from './context/OrderContext';
import { MessageBannerProvider } from "./context/MessageBannerContext";
import ThankYouPage from './ThankYouPage/ThankYouPage';
import ErrorPage from './ErrorPage/ErrorPage';
import NotFoundPage from './ErrorPage/NotFoundPage';
import LandingPage from './LandingPage/LandingPage';
import ProductPage from './ProductPage/ProductPage';
import { UserProvider } from './context/UserContext';
import AuthPage from './AuthPage/AuthPage';
import SAMLResponseHandler from './AuthPage/SAMLResponseHandler';
import FavoritePage from './FavoritePage/FavoritePage';
import ProductInformation from './InformationPage/ProductInformation/ProductInformation';
import PromptInformation from './InformationPage/PromptInformation/PromptInformation';
import NavBar from './components/NavBar';
import UserPage from './UserPage/UserPage';
import CartPage from './CartPage/CartPage';
import DriverPage from './DriverPage/DriverPage';
import { Navigate } from 'react-router-dom';
import { useUser } from "./context/UserContext"; 
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react";
import ContactPage from './ContactPage/ContactPage';
import CatalogPage from './CatalogPage/CatalogPage';
import LoadingPage from './components/newloader';
import OrganisationDetails, { Orgcontext } from './context/ApiContext';
import ProductSection from './ProductSection/ProductSection';
import DemoOverlay from './context/DemoContext';
import ScrollToTop from './components/ScrollToTop';

const PrivateRoute = ({ children }) => {
	const { user, loading } = useUser();
	if(!loading)
		return (user.isLoggedIn || user.isGuest) ? children : <Navigate to="/auth" replace />;
};

const App = () => {
	const [loading, setLoading] = useState(true);
	const [showInAppBrowserWarning, setShowInAppBrowserWarning] = useState(false);
	const { env } = useContext(Orgcontext) || { env: {} };

	useEffect(() => {
		const userAgent = navigator.userAgent || navigator.vendor || window.opera;
		const isInstagram = userAgent.includes('Instagram');
		const isLark = userAgent.includes('Lark/');
		
		if (isInstagram || isLark) {
			setShowInAppBrowserWarning(true);
		}
	}, []);

	const openInBrowser = () => {
		const url = window.location.href;
		const isAndroid = /Android/i.test(navigator.userAgent);
		const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

		if (isAndroid) {
			window.location.href = `intent://${url.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end;`;
		} else if (isIOS) {
			window.open(url, '_blank', 'noopener,noreferrer');
		} else {
			window.open(url, '_blank');
		}
	};

	useEffect(() => {
		const timeout = setTimeout(() => {
			setLoading(false);
		}, 500); 
		return () => clearTimeout(timeout);
	}, []);

	return (
		<div>
		{loading ? (
			<LoadingPage />
			) : (
			<>
			{process.env.REACT_APP_DEMO && <DemoOverlay />}
			<OrganisationDetails>
				<AppProvider>
					<ImageProvider>
						<UserProvider>
							<MessageBannerProvider>
								<PricesProvider>
								<OrderProvider>
									<Analytics />
									{env?.AUTHTYPE_SAML === true && <SAMLResponseHandler />}
									<SpeedInsights />
										<div className='flexcenter relative'>
											<NavBar />
											<ScrollToTop />
											<Routes>
												<Route path="/" element={<LandingPage />} />
												<Route path="/product" element={<PrivateRoute><ProductPage /></PrivateRoute>} />
												<Route path="/information" element={<PrivateRoute><InformationPage /></PrivateRoute>} />
												<Route path="/information/size" element={<PrivateRoute><ProductInformation /></PrivateRoute>} /> 
												<Route path="/information/prompt" element={<PrivateRoute><PromptInformation /></PrivateRoute>} />            
												<Route path="/success" element={<ThankYouPage />} />
												<Route path="/error" element={<PrivateRoute><ErrorPage /></PrivateRoute>} />
												<Route path="/auth" element={<AuthPage />} />
												<Route path="/fav" element={<PrivateRoute><FavoritePage /></PrivateRoute>} />
												<Route path="/user" element={<PrivateRoute><UserPage /></PrivateRoute>} />
												<Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
												<Route path="/driver" element={<PrivateRoute><DriverPage /></PrivateRoute>} />
												<Route path="/contact" element={<ContactPage />} />
												<Route path="/product/gallery" element={<ProductSection />} />
												<Route path="/catalog" element={<CatalogPage />} />
												<Route path="*" element={<NotFoundPage />} />
											</Routes>
											<Legal />
										</div>
								</OrderProvider>
								</PricesProvider>
							</MessageBannerProvider>
						</UserProvider>
					</ImageProvider>
				</AppProvider>
			</OrganisationDetails>
			</>
			)}
		</div>
	);
};
export default App;
