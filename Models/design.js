const mongoose = require('mongoose');
const designSchema = mongoose.Schema({
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
            link: {
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
                answer: [String],
                points: {
                    type: Number
                }
            },
            imgmcq: {
                questLink: {
                    type: String
                },
                optionsLink: [String],
                answerLink: [String],
                points: {
                    type: Number
                }
            }
        }]
    }]
});

const DesignModel = mongoose.model('DesignModel', designSchema);
module.exports = DesignModel;