const mongoose = require('mongoose');
const ipSchema = mongoose.Schema({
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
            trueFalse: [
                {
                    quest: {
                        type: String,
                        required: true
                    },
                    ans: {
                        type: String,
                        enum: ["True", "False"]
                    },
                    points: {
                        type: Number,
                        required: true
                    }
                }
            ],
            txtmcq: [
                {
                    quest: {
                        type: String,
                        required: true,
                    },
                    options: [String],
                    answer: [String],
                    points: {
                        type: Number,
                        required: true
                    }
                }
            ],
            imgmcq: [
                {
                    questLink: {
                        type: String,
                        required: true,
                    },
                    optionsLink: [String],
                    answerLink: [String],
                    points: {
                        type: Number,
                        required: true
                    }
                }
            ]

        }]
    }]
});

const IPModel = mongoose.model('IPModel', ipSchema);
module.exports = IPModel;