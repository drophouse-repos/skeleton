import React, { createContext, useState, useEffect } from 'react';
import Loader from '../components/loader';
import { fetchOrganisationlist } from '../utils/fetch';

export const Orgcontext = createContext();

const OrganisationDetails = ({ children }) => {
    const [orgDetails, setOrgDetails] = useState([]);
    const [orgId, setOrgId] = useState('');
    const [name, setName] = useState('');
    const [mask, setMask] = useState('');
    const [logo, setLogo] = useState('');
    const [themeColor, setThemeColor] = useState('');
    const [font, setFont] = useState('');
    const [favicon, setFavicon] = useState('');
    const [product, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [landingpage, setLandingPage] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const items = await fetchOrganisationlist(); // Assuming fetchOrganisationlist returns the JSON structure you provided

                // Filter out the organisation with org_id === '1002'
                const organisationData = Object.values(items).filter(item => item.org_id === `${process.env.REACT_APP_ORGANISATION_ID}`).map(item => {
                    // Extract organisation-level details
                    setOrgId(item.org_id);
                    setName(item.name);
                    setMask(item.mask);
                    setLogo(item.logo);
                    setThemeColor(item.theme_color);
                    setFont(item.font);
                    setFavicon(item.favicon);

                    const landingpage_data = item.landingpage.map(sampleproduct => ({
                        SampleProduct_Name: sampleproduct.name,
                        SampleProduct_asset: sampleproduct.asset
                    }))
                    setLandingPage(landingpage_data);
                    // Extract product-level details
                    const productsData = item.products.map(product => ({
                        Product_Name: product.name,
                        Product_Description: product.description,
                        Product_Default_Color: product.default_color,
                        Product_Sizes: product.sizes,
                        Product_Clip: product.clip,
                        Product_Mask: product.mask,
                        Product_Colors: product.colors,
                        Product_DefaultProduct: product.defaultProduct,
                        Product_Dimensions_Top: product.dimensions.top,
                        Product_Dimensions_Left: product.dimensions.left,
                        Product_Dimensions_Height: product.dimensions.height,
                        Product_Dimensions_Width: product.dimensions.width
                    }));

                    setProducts(productsData);

                    // Return combined organisation and product details
                    return { ...item, LandingPage: landingpage , Products: productsData };
                });

                setOrgDetails(organisationData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
                // Handle error state or logging
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {loading ? (
                <Loader />
            ) : (
                <Orgcontext.Provider value={{ 
                    orgDetails, orgId, name, mask, logo, themeColor, font, favicon, product, landingpage
                }}>
                    {children}
                </Orgcontext.Provider>
            )}
        </div>
    );
};

export default OrganisationDetails;
