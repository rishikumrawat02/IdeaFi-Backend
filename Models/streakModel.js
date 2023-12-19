const mongoose = require('mongoose');
const streakSchema = mongoose.Schema({
    quest: {
        type: String
    },
    options: [String],
    answer: String
});

const StreakModel = mongoose.model('StreakModel', streakSchema);
module.exports = StreakModel;