const axios = require('axios');
const User = require("../models/User");
const File = require("../models/File");

const upload= {
    
    GetUploadURL: async (req, res) => {
    const {file} = req.body;
    // console.log(req.user.user);
    // console.log(file);
    const requestBody = {
        operationName: "GetUploadUrl",
        variables: {
            mediaFormat: "image/png"
        },
        query: "query GetUploadUrl($mediaFormat: String!) {\n  uploadUrl(mediaFormat: $mediaFormat) {\n    uploadUrl\n    contentObjectBase64\n    contentUrl\n    urlHeaders {\n      key\n      value\n      __typename\n    }\n    __typename\n  }\n}\n"
    };

    const headers = {
        'Content-Type': 'application/json',
        'Cookie': 'sc-a-nonce=2666e29c-8142-4ac2-b37b-0f20339058c0',
        'Authorization': 'Bearer hCgwKCjE3MDk1NzUyMTESzAEib8irgpgL40c3_eUB6W5KE-IXSDFL3aOiVLujblEBDewZP7TjOMRlenBseEp86RaC5SCYwIHACQwRtJpEKgCbbMy92fG2ZQroyT1mhDB5IPSdSAI7-Q-78PAiWRxcXj3WyCo36JLqDjSqORm8XuhKsMjm-hQBmWoU1OCqO0zp8bbAeJ6IGUxPjfrpiOY7Mb-SGlwbwuAEgYs4N8u_DY6TuNi8VJcPtukUsMOWhB1MtJ13DDMOzZraZqoTIjJ0-R-pUu6numkrkpR7I7s',
        'Origin': 'https://my.snapchat.com',
        'Referer': 'https://my.snapchat.com/'
    };

    return axios.post('https://us-east1-aws.api.snapchat.com/gravy-gateway/graphql', requestBody, { headers })
    .then(response => {
        const data = response.data;
        console.log('Response:', data); // Log the entire data object
        const uploadUrl = data.data.uploadUrl.uploadUrl; // Using optional chaining
        const contentUrl = data.data.uploadUrl.contentUrl;
        const userName = req.user.user;
        const newFile = new File({ uploaderName: userName, uploadUrl: uploadUrl, contentUrl: contentUrl });
        newFile.save();
        // console.log(uploadUrl);
        return response.data;
e
        })
        .catch(error => {
            console.error('Error:', error);
            throw error; 
        });
    
},
};
module.exports = upload;