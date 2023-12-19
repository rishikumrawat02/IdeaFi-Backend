const mongoose = require('mongoose');
const streakSchema = mongoose.Schema({
    trueFalse: {
        quest: {
            type: String
        },
        ans: {
            type: String,
            enum: ["True", "False"]
        }
    },
    txtmcq: {
        quest: {
            type: String
        },
        options: [String],
        answer: [String]
    }
});

const StreakModel = mongoose.model('StreakModel',streakSchema);
module.exports = StreakModel;