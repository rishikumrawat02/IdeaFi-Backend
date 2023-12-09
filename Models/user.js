const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userId:{
        type: String,
        required: true,
        unique: true
    },
    username:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        min:0,
        max:100,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    diceCode:{
        type: String,
        default: null
    }
});

const User = mongoose.model('User',userSchema);

const userProgressSchema = mongoose.Schema({
    patentInfo:{
        levels:[{
            name:{
                type: String,
                required: true
            },
            status:{
                type: String,
                enum: ['Completed','Incomplete']
            },
            pointsEarned:{
                type: Number,
                default: 0
            }
        }]
    },
    trademarkInfo:{
        levels:[{
            name:{
                type: String,
                required: true
            },
            status:{
                type: String,
                enum: ['Completed','Incomplete']
            },
            pointsEarned:{
                type: Number,
                default: 0
            }
        }]
    },
    copyrightInfo:{
        levels:[{
            name:{
                type: String,
                required: true
            },
            status:{
                type: String,
                enum: ['Completed','Incomplete']
            },
            pointsEarned:{
                type: Number,
                default: 0
            }
        }]
    },
    designInfo:{
        levels:[{
            name:{
                type: String,
                required: true
            },
            status:{
                type: String,
                enum: ['Completed','Incomplete']
            },
            pointsEarned:{
                type: Number,
                default: 0
            }
        }]
    },
    pointsDetail:[{
        type: Number,
        dateModified: mongoose.Schema.Types.Date
    }]
});

const UserProgress = mongoose.model("UserPrgoress",userProgressSchema);

module.exports = [User,UserProgress];