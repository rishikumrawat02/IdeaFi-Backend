const [User, UserProgress] = require('../Models/user');

function userController() {
    return {
        addUser: async (req, res) => {
            const { userId, userName, age, email, diceCode } = req.body;
            if (!userId || !userName || !age || !email) {
                return res.status(400).json({ msg: 'All fields are required' });
            }

            const exist = User.find({ $or: [{ email: email }, { userId: userId }] });
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
            return res.status(201).json({ msg: 'User Registered Successfully' });
        },

        getUserInfo: async (req, res) => {
            const userId = req.body.userId;
            const data = await User.find({ userId: userId });
            if (!data) {
                return res.status(404).json({ msg: 'User not found' });
            }
            return res.status(200).json({ UserInfo: data });
        }
    }
};

module.exports = userController;