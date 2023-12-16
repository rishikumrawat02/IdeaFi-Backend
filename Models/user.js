const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    diceCode: {
        type: String,
        default: null
    }
});

const User = mongoose.model('User', userSchema);

const userProgressSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    patentInfo: {
        levels: [{
            status: {
                type: String,
                enum: ['Completed', 'Incomplete']
            },
            pointsEarned: {
                type: Number,
                default: 0
            }
        }]
    },
    trademarkInfo: {
        levels: [{
            status: {
                type: String,
                enum: ['Completed', 'Incomplete']
            },
            pointsEarned: {
                type: Number,
                default: 0
            }
        }]
    },
    copyrightInfo: {
        levels: [{
            status: {
                type: String,
                enum: ['Completed', 'Incomplete']
            },
            pointsEarned: {
                type: Number,
                default: 0
            }
        }]
    },
    designInfo: {
        levels: [{
            status: {
                type: String,
                enum: ['Completed', 'Incomplete']
            },
            pointsEarned: {
                type: Number,
                default: 0
            }
        }]
    },
    pointsDetail: [{
        points: Number,
        dateModified: mongoose.Schema.Types.Date
    }],
    streakInfo: {
        longest: {
            type: Number,
            default: 0
        },
        current: {
            type: Number,
            default: 0
        },
        lastModified: {
            type: mongoose.Schema.Types.Date,
        }
    },
    statics: {
        timeSpent: {
            type: Number,
            default: 0
        },
        correctAns: {
            type: Number,
            default: 0
        },
        wrongAns: {
            type: Number,
            default: 0
        }
    },
    badges: [String]
});

const UserProgress = mongoose.model("UserPrgoress", userProgressSchema);

module.exports = [User, UserProgress];