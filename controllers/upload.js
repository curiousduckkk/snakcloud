const axios = require('axios');
const File = require("../models/File");
const mongoose = require('mongoose');
const User = require('../models/User');
const ObjectId = mongoose.Types.ObjectId;


const upload = {
    GetUploadURL: async (req, res, fileName, fileType) => {
        let type = "image/png";
        if (fileType == "jpg" || fileType == "jpeg"){
            type = "image/jpeg";
        }
        const requestBody = {
            operationName: "GetUploadUrl",
            variables: {
                mediaFormat: type
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
            const fileType = await upload.Extension(req, res, fileName);
            let type = "image/png";
            if (fileType == "jpg" || fileType == "jpeg"){
                type = "image/jpeg";
            }
            const uploadUrl = await upload.GetUploadURL(req, res, fileName, fileType); // Call GetUploadURL from upload object
            console.log('Upload URL:', uploadUrl);
            const response = await axios.put(uploadUrl, decodedFileData, {
                headers: {
                    'Content-Type': type
                }
            });
        
            if (response.status === 200) {
                console.log('File uploaded successfully');
                const file = await File.findOne({ uploadUrl })
                let link = "https://snakcloud.onrender.com/download/"+file._id;
                return res.status(200).json({
                    "link":link,
                    "fileName":file.fileName
                });
            } else {
                throw new Error('Failed to upload file');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    },

    DownloadFile: async(req, res) => {
        const {id}= req.params;
        if (id.length > 24) {
            return res.status(400).json({ error: "Invalid file id" });
        }
        try {
            const file = await File.findOne({_id: new ObjectId(id)});

            if (!file) {
                return res.status(404).json({ error: "File not found" });
            }
        
            console.log(file.uploaderName);
            if (req.user.user == file.uploaderName) {
                try {
                    let type = "image/png";
                    if (file.fileType == "jpg" || file.fileType == "jpeg"){
                        type = "image/jpeg";
                    }else if(file.fileType == "pdf"){
                        type = "application/pdf"
                    }                           
                    const response = await axios.get(file.contentUrl, { responseType: 'arraybuffer' });
                    res.set('Content-Type', type);
                    res.status(response.status).send(response.data);
                } catch (error) {
                    console.error('Error:', error);
                    res.status(500).send('Internal Server Error');
                }
            }
            
        // console.log(req.user.user);
        return res.status(403).json({
            "message": "Unauthorized"
        })
    }catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
    },

    Access: async (req, res) => {
        const { id, username } = req.body;
    
        // Validate the file ID
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid file id" });
        }
    
        try {
            const file = await File.findById(id);
    
            if (!file) {
                return res.status(404).json({ error: "File not found" });
            }
    
            if (file.uploaderName !== req.user.user) {
                return res.status(403).json({ error: "Unauthorized to grant access" });
            }
    
            const user = await User.findOne({ username });
    
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
    
            file.access.push(user._id);
    
            await file.save();
    
            return res.status(200).json({ message: "Access granted successfully" });
        } catch (error) {
            console.error("Error granting access:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
    
};

module.exports = upload;
