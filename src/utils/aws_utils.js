import AWS from "aws-sdk";
import axios from 'axios';
import axiosInstance from '../axiosInstance';

export const generate_presigned_url = async (img_id, bucket_name, expiration = 3600) => {
    AWS.config.update({
        region: "us-east-2",
        credentials: new AWS.Credentials({
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
        })
    });

    const s3 = new AWS.S3({ signatureVersion: "v4" });
    try {
        let url = s3.getSignedUrl("getObject", {
            Bucket: bucket_name,
            Key: `${img_id}.jpg`,
            Expires: expiration
        });

        // url = await validateImageUrl(url);
        return url;
    } catch (error) {
        console.error("Error generating presigned URL:", error);
        return null;
    }
};

export const validateImageUrl = async (url) => {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });

        const contentType = response.headers['content-type'];
        console.log(contentType, url)
        if (contentType.startsWith('image/')) {
            return url;
        } else {
            console.error('URL does not point to an image:', url);
            return false;
        }
    } catch (error) {
        console.error('Error fetching the URL:', url, error.message);
        return false;
    }
};

export const get_toggled_url = async (order_ids) => {
    try {
        const response = await axiosInstance.post("/get_toggled_url", { order_ids });
        if (response.status !== 200) throw new Error('Failed to fetch /get_toggled_url : img_url');
        return response.data;
    } catch (err) {
        console.log(err, 'failed to fetch /get_toggled_url : img_url');
        return null;
    }
}