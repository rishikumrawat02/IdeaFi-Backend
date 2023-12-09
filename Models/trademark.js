const mongoose = require('mongoose');
const trademarkSchema = mongoose.Schema({
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

const TradeMarkModel = mongoose.model('TradeMarkModel',trademarkSchema);
module.exports = TradeMarkModel;