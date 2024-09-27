import React, { createContext, useState, useEffect } from 'react';
import Loader from '../components/loader';
import { fetchOrganisationlist, fetchOrganisation_by_id } from '../utils/fetch';
import LoadingPage from '../components/newloader';
import { generate_presigned_url, generate_base64_url } from '../utils/aws_utils';
import { loadState } from '../utils';

export const Orgcontext = createContext();

const OrganisationDetails = ({ children }) => {
    const [orgDetails, setOrgDetails] = useState([]);
    const [orgId, setOrgId] = useState('');
    const [name, setName] = useState('');
    const [mask, setMask] = useState('');
    const [greenmask, setGreenmask] = useState('');
    const [logo, setLogo] = useState('');
    const [themeColor, setThemeColor] = useState('');
    const [font, setFont] = useState('');
    const [favicon, setFavicon] = useState('');
    const [product, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [landingpage, setLandingPage] = useState([]);
    const [galleryPage, setGalleryPage] = useState(true);

    useEffect(() => {
        const state = { greenmask };
        sessionStorage.setItem('localmask', JSON.stringify(state));
    }, [greenmask]);

    useEffect(() => {
        const fetchData = async () => {
            try { 
                const org_id = {
                    org_id: process.env.REACT_APP_ORGANISATION_ID
                }
                const item = await fetchOrganisation_by_id(org_id);
                    setGalleryPage((item && item.greenmask && item.greenmask != null && item.greenmask != '') ? false : true)
                    let _greenmask = (item && item.greenmask && item.greenmask != null && item.greenmask != '') ? item.greenmask : ''
                    if(galleryPage === true)
                        _greenmask = loadState('greenmask', _greenmask, 'localmask')
                    setGreenmask(_greenmask);
                    
                    setOrgId(item.org_id);
                    setName(item.name);
                    setMask(item.mask);
                    setLogo(item.logo);
                    setThemeColor(item.theme_color);
                    setFont(item.font);
                    setFavicon(item.favicon);

                    const landingpage_data = item.landingpage.map(sampleproduct => ({
                        SampleProduct_Name: sampleproduct.name,
                        SampleProduct_asset_front: sampleproduct.asset,
                        SampleProduct_asset_back: sampleproduct.asset_back
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
                        Product_Greenmask: product.greenmask,
                        Product_Colors: product.colors,
                        Product_DefaultProduct: product.defaultProduct,
                        Product_Dimensions_Top: product.dimensions.top,
                        Product_Dimensions_Left: product.dimensions.left,
                        Product_Dimensions_Height: product.dimensions.height,
                        Product_Dimensions_Width: product.dimensions.width
                    }));

                    setProducts(productsData);

                    // Return combined organisation and product details
                    setOrgDetails({ ...item, LandingPage: landingpage , Products: productsData });
                // });
                // setOrgDetails(organisationData);
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
                <LoadingPage />
            ) : (
                <Orgcontext.Provider value={{ 
                    orgDetails, orgId, name, mask, logo, themeColor, 
                    font, favicon, product, landingpage, 
                    galleryPage, greenmask, setGreenmask
                }}>
                    {children}
                </Orgcontext.Provider>
            )}
        </div>
    );
};

export default OrganisationDetails;