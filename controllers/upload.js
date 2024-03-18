const axios = require('axios');
const User = require("../models/User");
const File = require("../models/File");

const upload = {
    GetUploadURL: async (req, res, fileName, fileType) => {
        const requestBody = {
            operationName: "GetUploadUrl",
            variables: {
                mediaFormat: "image/png"
            },
            query: "query GetUploadUrl($mediaFormat: String!) {\n  uploadUrl(mediaFormat: $mediaFormat) {\n    uploadUrl\n    contentObjectBase64\n    contentUrl\n    urlHeaders {\n      key\n      value\n      __typename\n    }\n    __typename\n  }\n}\n"
        };

        const headers = {
            'Content-Type': 'application/json',
            'Cookie': 'sc-a-nonce=2666e29c-8142-4ac2-b37b-0f20339058c0;',
            'Authorization': 'Bearer hCgwKCjE3MDk1NzUyMTESzAHfiXKyn0nnQ8Cun_GOuExMhGuZaWB0bAWMCh0WzdrPL5bxEF9uRb4Po66sO2hiNP1-FayP3luNvnIeEQqAVqai69_rFnAd_pXXb3PsgJTb5OPRKyXfVYO9CB2khZJntV84v9YApRL7csAQh3vSvej1yjNBp3i3sGxFILqo49Zja9pEPV4MeOSGS1gISbScfcpk1FnzXxXp_nOl37VYUVdwRYoUKKGWNoPaC5_ZPXrVq-zQ0uHiVf_yzXHxYnV5OcMpqwS2M9kS6HhSAOU',
            'Origin': 'https://my.snapchat.com',
            'Referer': 'https://my.snapchat.com/'
        };

        try {
            const response = await axios.post('https://us-east1-aws.api.snapchat.com/gravy-gateway/graphql', requestBody, { headers });
            const data = response.data;
            const fileType = await upload.Extension(req, res, fileName);
            const uploadUrl = data.data.uploadUrl.uploadUrl;
            const contentUrl = data.data.uploadUrl.contentUrl;
            const userName = req.user.user;
            const newFile = new File({ fileName: fileName, fileType: fileType, uploaderName: userName, uploadUrl: uploadUrl, contentUrl: contentUrl });
            await newFile.save();
            return uploadUrl;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    Extension: async(req, res, fileName) => {
        try {
            const parts = fileName.split('.');
            if (parts.length > 1) {
                const extension = parts[parts.length - 1];
                return extension;
            } else {
                throw new Error('Failed to upload file'); // Throw error if no extension found
            }
        } catch (error) {
            console.error('Error extracting extension:', error);
            throw error;
        }
    },

    UploadFile: async (req, res) => {
        const { fileName, fileData } = req.body;
        try {
            // Decode base64 file data
            const decodedFileData = Buffer.from(fileData, 'base64');
        
            const uploadUrl = await upload.GetUploadURL(req, res, fileName); // Call GetUploadURL from upload object
            console.log('Upload URL:', uploadUrl);
            const response = await axios.put(uploadUrl, decodedFileData, {
                headers: {
                    'Content-Type': "image/png" // Set the content type header based on file type
                }
            });
        
            if (response.status === 200) {
                console.log('File uploaded successfully');
                return response.data;
            } else {
                throw new Error('Failed to upload file');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }
};

module.exports = upload;
