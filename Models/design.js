const mongoose = require('mongoose');
const designSchema = mongoose.Schema({
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

const DesignModel = mongoose.model('DesignModel',designSchema);
module.exports = DesignModel;