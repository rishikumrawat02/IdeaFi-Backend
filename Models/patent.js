const mongoose = require('mongoose');
const patentSchema = mongoose.Schema({
    levels: [{
        title: {
            type: String,
            required: true
        },
        maxScore: {
            type: Number,
            required: true
        },
        content: [{
            para: {
                type: String,
                default: null
            },
            imgLink: {
                type: String,
                default: null
            },
            trueFalse: {
                quest: {
                    type: String
                },
                ans: {
                    type: String,
                    enum: ["True", "False"]
                },
                points: {
                    type: Number
                }
            },
            txtmcq: {
                quest: {
                    type: String
                },
                options: [String],
                answer: Number,
                points: {
                    type: Number
                }
            },
            imgmcq: {
                questLink: {
                    type: String
                },
                optionsLink: [String],
                answerLink: Number,
                points: {
                    type: Number
                }
            }
        }]
    }]
});

const PatentModel = mongoose.model('PatentModel', patentSchema);


async function insertData() {
    await PatentModel.insertMany([{
        content: [{
            detail: "My name is Rishabh"
        }], questions: []
    }]);
}
// insertData();


module.exports = PatentModel;