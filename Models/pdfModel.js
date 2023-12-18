const mongoose = require('mongoose');
const pdfSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    pdfData: {
        type: String,
        required: true
    }
});

const pdfModel = mongoose.model('PDFModel',pdfSchema);
module.exports = pdfModel;