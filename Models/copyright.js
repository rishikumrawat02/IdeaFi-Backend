const mongoose = require('mongoose');
const copyrightSchema = mongoose.Schema({
    content:[{
        detail:{
            type:String,
            required: true
        }
    }],
    questions:[{
        question:{
            type: String,
            required: true 
        },
        options:[{
            type: String,
            required: true
        }],
        answer:{
            type: String,
            required: true
        },
        points:{
            type: Number,
            required: true
        }
    }]
});

const CopyRightModel = mongoose.model('CopyRightModel',copyrightSchema);
module.exports = CopyRightModel;