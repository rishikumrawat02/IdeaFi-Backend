const [User, UserProgress] = require('../Models/user');
const PatentModel = require('../Models/patent');
const TradeMarkModel = require('../Models/trademark');
const CopyRightModel = require('../Models/copyright');
const DesignModel = require('../Models/design');
const mongoose = require('mongoose');

function userController() {
    return {
        addUser: async (req, res) => {
            const { userId, userName, age, email, diceCode } = req.body;
            if (!userId || !userName || !age || !email) {
                return res.status(400).json({ msg: 'All fields are required' });
            }
            try {
                const exist = await User.findOne({ $or: [{ email: email }, { userId: userId }] });
                if (exist) {
                    return res.status(400).json({ msg: 'Email or UserId already registered' });
                }

                const newUser = new User({
                    userId: userId,
                    userName: userName,
                    age: age,
                    email: email,
                    diceCode: diceCode
                });

                const savedUser = await newUser.save();
                if (!savedUser) {
                    return res.status(400).json({ msg: 'Failed to register user' });
                }

                const obj = await creatUserProgress(savedUser._id)
                console.log(obj);

                const saveUserProgress = await UserProgress.create(obj);
                if (!saveUserProgress) {
                    console.log('Failed to create User Progress');
                }

                return res.status(201).json({ msg: 'User Registered Successfully' });

            } catch (error) {
                console.error('Error while adding user:', error);
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        },

        getUserInfo: async (req, res) => {
            const userId = req.body.userId;
            try {
                const data = await User.findOne({ userId: userId });
                if (!data) {
                    return res.status(404).json({ msg: 'User not found' });
                }
                return res.status(200).json({ UserInfo: data });
            } catch (error) {
                console.error('Error while geting userInfo:', error);
                return res.status(500).json({ msg: 'Internal Server Error' });
            }

        },

        getUserProgress: async (req, res) => {
            const userId = new mongoose.Types.ObjectId(req.body.userId);

            try {
                const data = await UserProgress.find({ userId: userId });
                if (!data) {
                    return res.status(404).json({ msg: 'User Not Found' });
                }
                return res.status(200).json({ data: data[0] });
            } catch (error) {
                console.error('Error while geting user progress:', error);
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        }
    }
};

async function creatUserProgress(userId) {
    const userProgressObj = { userId: userId, pointsEarned: 0 };

    userProgressObj.patentInfo = { levels: await createLevel(PatentModel) };
    userProgressObj.trademarkInfo = { levels: await createLevel(TradeMarkModel) };
    userProgressObj.copyrightInfo = { levels: await createLevel(CopyRightModel) };
    userProgressObj.designInfo = { levels: await createLevel(DesignModel) };

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    userProgressObj.streakInfo = {
        longest: 0,
        current: 0,
        lastModified: yesterday
    }

    return userProgressObj;
}

async function createLevel(model) {
    try {
        const data = await model.find();
        const size = data[0].levels.length;
        return Array.from({ length: size }, () => ({ status: 'Incomplete', pointsEarned: 0 }));
    } catch (error) {
        console.error('Error creating level:', error);
        return;
    }
}

module.exports = userController;