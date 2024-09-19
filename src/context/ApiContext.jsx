import React, { createContext, useState, useEffect } from 'react';
import Loader from '../components/loader';
import { fetchOrganisationlist, fetchOrganisation_by_id } from '../utils/fetch';
import LoadingPage from '../components/newloader';
import { generate_presigned_url, generate_base64_url } from '../utils/aws_utils';

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
                const org_id = {
                    org_id: process.env.REACT_APP_ORGANISATION_ID
                }
                // const org_s3_bucket = "drophouse-skeleton"
                const item = await fetchOrganisation_by_id(org_id);
                    // if(item.mask && !item.mask.includes('data:image') && !item.mask.includes('https://'))
                    //     item.mask = await generate_presigned_url(item.mask, org_s3_bucket)
                    
                    // if(item.logo && !item.logo.includes('data:image') && !item.logo.includes('https://'))
                    //     item.logo = await generate_presigned_url(item.logo, org_s3_bucket)
                    
                    // if(item.greenmask && !item.greenmask.includes('data:image') && !item.greenmask.includes('https://'))
                    //     item.greenmask = await generate_presigned_url(item.greenmask, org_s3_bucket)
                    
                    // if(item.favicon && !item.favicon.includes('data:image') && !item.favicon.includes('https://'))
                    //     item.favicon = await generate_presigned_url(item.favicon, org_s3_bucket)

                    // for(var i=0; i<item.landingpage.length; i++)
                    // {
                    //     if(item.landingpage[i]['asset'] && !item.landingpage[i]['asset'].includes('data:image') && !item.landingpage[i]['asset'].includes('https://'))
                    //         item.landingpage[i]['asset'] = await generate_presigned_url(item.landingpage[i]['asset'], org_s3_bucket)
                    //     if(item.landingpage[i]['asset_back'] && !item.landingpage[i]['asset_back'].includes('data:image') && !item.landingpage[i]['asset_back'].includes('https://'))
                    //         item.landingpage[i]['asset_back'] = await generate_presigned_url(item.landingpage[i]['asset_back'], org_s3_bucket)
                    // }

                    // for(var i=0; i<item.products.length; i++)
                    // {
                    //     if(item.products[i]['mask'] && !item.products[i]['mask'].includes('data:image') && !item.products[i]['mask'].includes('https://')){
                    //         // item.products[i]['mask'] = await generate_presigned_url(item.products[i]['mask'], org_s3_bucket)
                    //         item.products[i]['mask'] = await generate_base64_url(item.products[i]['mask'], org_s3_bucket)
                    //     }
                    
                    //     if(item.products[i]['defaultProduct'] && !item.products[i]['defaultProduct'].includes('data:image') && !item.products[i]['defaultProduct'].includes('https://')){
                    //         // item.products[i]['defaultProduct'] = await generate_presigned_url(item.products[i]['defaultProduct'], org_s3_bucket)
                    //         item.products[i]['defaultProduct'] = await generate_base64_url(item.products[i]['defaultProduct'], org_s3_bucket)
                    //     }

                    //     for(var j in item.products[i]['colors'])
                    //     {
                    //         if(item.products[i]['colors'][j]['asset']['front'] && !item.products[i]['colors'][j]['asset']['front'].includes('data:image') && !item.products[i]['colors'][j]['asset']['front'].includes('https://')){
                    //             // item.products[i]['colors'][j]['asset']['front'] = await generate_presigned_url(item.products[i]['colors'][j]['asset']['front'], org_s3_bucket)
                    //             item.products[i]['colors'][j]['asset']['front'] = await generate_base64_url(item.products[i]['colors'][j]['asset']['front'], org_s3_bucket)
                    //         }

                    //         if(item.products[i]['colors'][j]['asset']['back'] && !item.products[i]['colors'][j]['asset']['back'].includes('data:image') && !item.products[i]['colors'][j]['asset']['back'].includes('https://')){
                    //             // item.products[i]['colors'][j]['asset']['back'] = await generate_presigned_url(item.products[i]['colors'][j]['asset']['back'], org_s3_bucket)
                    //             item.products[i]['colors'][j]['asset']['back'] = await generate_base64_url(item.products[i]['colors'][j]['asset']['back'], org_s3_bucket)
                    //         }
                    //     }
                    // }
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