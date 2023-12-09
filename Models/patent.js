const mongoose = require('mongoose');
const patentSchema = mongoose.Schema({
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

const PatentModel = mongoose.model('PatentModel',patentSchema);


async function insertData(){
    await PatentModel.insertMany([{ content:[{
        detail:"My name is Rishabh"
    }],questions:[]  }]);
}
// insertData();


module.exports = PatentModel;