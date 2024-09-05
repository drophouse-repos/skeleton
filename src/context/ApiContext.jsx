import React, { createContext, useState, useEffect } from 'react';
import Loader from '../components/loader';
import { fetchOrganisationlist, fetchOrganisation_by_id } from '../utils/fetch';
import LoadingPage from '../components/newloader';
import { generate_presigned_url } from '../utils/aws_utils';

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
            try { // Assuming fetchOrganisationlist returns the JSON structure you provided
                const org_id = {
                    org_id: process.env.REACT_APP_ORGANISATION_ID
                }
                const item = await fetchOrganisation_by_id(org_id);
                // Filter out the organisation with org_id === '1002'
                // const organisationData = items.map(item => {
                    // Extract organisation-level details
                console.log('before', item)
                    if(item.mask && !item.mask.includes('data:image'))
                        item.mask = await generate_presigned_url(item.mask, 'drophouse-skeleton-bucket')
                    
                    if(item.logo && !item.logo.includes('data:image'))
                        item.logo = await generate_presigned_url(item.logo, 'drophouse-skeleton-bucket')
                    
                    if(item.greenmask && !item.greenmask.includes('data:image'))
                        item.greenmask = await generate_presigned_url(item.greenmask, 'drophouse-skeleton-bucket')
                    
                    if(item.favicon && !item.favicon.includes('data:image'))
                        item.favicon = await generate_presigned_url(item.favicon, 'drophouse-skeleton-bucket')

                    for(var i=0; i<item.landingpage.length; i++)
                    {
                        if(item.landingpage[i]['asset'] && !item.landingpage[i]['asset'].includes('data:image'))
                            item.landingpage[i]['asset'] = await generate_presigned_url(item.landingpage[i]['asset'], 'drophouse-skeleton-bucket')
                    }

                    for(var i=0; i<item.products.length; i++)
                    {
                        if(item.products[i]['mask'] && !item.products[i]['mask'].includes('data/image'))
                            item.products[i]['mask'] = await generate_presigned_url(item.products[i]['mask'], 'drophouse-skeleton-bucket') 
                    
                        if(item.products[i]['defaultProduct'] && !item.products[i]['defaultProduct'].includes('data/image'))
                            item.products[i]['defaultProduct'] = await generate_presigned_url(item.products[i]['defaultProduct'], 'drophouse-skeleton-bucket') 

                        for(var j in item.products[i]['colors'])
                        {
                            if(item.products[i]['colors'][j]['asset']['front'] && !item.products[i]['colors'][j]['asset']['front'].includes('data/image'))
                                item.products[i]['colors'][j]['asset']['front'] = await generate_presigned_url(item.products[i]['colors'][j]['asset']['front'], 'drophouse-skeleton-bucket') 

                            if(item.products[i]['colors'][j]['asset']['back'] && !item.products[i]['colors'][j]['asset']['back'].includes('data/image'))
                                item.products[i]['colors'][j]['asset']['back'] = await generate_presigned_url(item.products[i]['colors'][j]['asset']['back'], 'drophouse-skeleton-bucket') 
                        }
                    }
                    
                    console.log('after', item)
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
                // <Loader />
                <LoadingPage />
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