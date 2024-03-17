const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    //filename: { type: String, required: true},
    //fileType: { type: String, required: true},
    uploaderName: { type: String, required: true},
    //Access: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    uploadUrl: { type: String, required: true},
    contentUrl: { type: String, required: true}
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
