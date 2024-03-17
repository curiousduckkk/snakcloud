// const fs = require('fs');
// const FormData = require('form-data');
// const axios = require('axios');
// const { sendGraphqlRequest } = require('./burp'); // Assuming burp.js is in the same directory

// // Function to upload file to the obtained uploadUrl
// async function uploadFile(filePath) {
//     try {
//         // Get the uploadUrl from the GraphQL request
//         const graphqlResponse = await sendGraphqlRequest();
//         const uploadUrl = graphqlResponse.data.uploadUrl.uploadUrl;

//         // Read the file to be uploaded
//         const fileData = fs.readFileSync(filePath);

//         // Prepare form data with file
//         const formData = new FormData();
//         formData.append('file', fileData, {
//             filename: 'uploadedFile.png', // Modify filename as needed
//             contentType: 'image/png' // Modify content type as needed
//         });

//         // Make POST request to upload the file
//         const response = await axios.post(uploadUrl, formData, {
//             headers: {
//                 ...formData.getHeaders()
//             }
//         });

//         console.log('File uploaded successfully:', response.data);
//         return response.data;
//     } catch (error) {
//         console.error('Error uploading file:', error);
//         throw error;
//     }
// }

// // Example usage: Call uploadFile with the path to the file to be uploaded
// const filePath = '/path/to/your/file.png'; // Replace with the actual path
// uploadFile(filePath);

