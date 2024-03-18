const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    uploaderName: { type: String, required: true },
    uploadUrl: { type: String, required: true },
    contentUrl: { type: String, required: true },
    access: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Reference to User model
});

const File = mongoose.model("File", fileSchema);

module.exports = File;
