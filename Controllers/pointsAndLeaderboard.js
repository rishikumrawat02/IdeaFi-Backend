const { default: mongoose } = require('mongoose');
const [User, UserProgress] = require('../Models/user');

function pointsAndLeaderBoardController() {
    return {
        getRanks: async (req, res) => {
            let userId = new mongoose.Types.ObjectId(req.body.userId);
            const rankBasis = req.body.rankBasis;

            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() - 1);

            if (rankBasis === 'W') {
                currentDate.setDate(currentDate.getDate() - 7);
            } else if (rankBasis == 'M') {
                currentDate.setDate(currentDate.getDate() - 30);
            }

            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const day = currentDate.getDate();

            const query = {
                "pointsDetail.dateModified": { $gte: new Date(year, month, day) }
            };

            const aggregate = [
                { $match: query },
                { $unwind: "$pointsDetail" },
                {
                    $group: {
                        _id: "$userId",
                        totalPoints: { $sum: "$pointsDetail.points" },
                    }
                },
                {
                    $sort: { totalPoints: -1 }
                },
                {
                    $lookup: {
                        from: "users", // Assuming your User model is in the "users" collection
                        localField: "_id", // The field from the current collection
                        foreignField: "_id", // The field from the "users" collection
                        as: "user"
                    }
                },
                {
                    $project: {
                        _id: 0,
                        userId: "$user.userId",
                        totalPoints: 1,
                        userName: "$user.userName" // Replace "userName" with the actual field in your User model
                    }
                }
            ];
            

            try {
                let userPointsData = await UserProgress.aggregate(aggregate);
                if (userPointsData.length > 50) {
                    userPointsData = userPointsData.slice(0, 50);
                }

                const userIndex = userPointsData.findIndex(user => user.userId === userId);

                return res.status(200).json({
                    top50UserInfo: userPointsData, userRankandInfo: {
                        currentUserinfo: userPointsData[userIndex], rank: userIndex + 1
                    }
                });
            } catch (err) {
                console.log(err);
                return res.status(400).json('Failed to get ranks');
            }
        },


        addPoints: async (req, res) => {
            const section = req.params.section;
            const lvl = req.params.level;
            const { userId, points, timeStamp } = req.body;

            try {
                const user = await User.findOne({ userId: userId });
                if (!user) {
                    return res.status(404).json({ msg: 'User not found' });
                }

                const userProgressData = await UserProgress.findOne({ userId: user._id });
                if (!userProgressData) {
                    return res.status(404).json({ msg: 'User progress not found' });
                }

                let sectn = null;

                switch (section) {
                    case "Patent":
                        if (userProgressData.patentInfo.levels.length < lvl || lvl <= 0) {
                            return res.status(400).json({ msg: 'Invalid Level' });
                        }
                        userProgressData.patentInfo.levels[lvl - 1].status = "Completed";
                        userProgressData.patentInfo.levels[lvl - 1].pointsEarned = points;
                        break;
                    case "Trademark":
                        if (userProgressData.trademarkInfo.levels.length < lvl || lvl <= 0) {
                            return res.status(400).json({ msg: 'Invalid Level' });
                        }
                        userProgressData.trademarkInfo.levels[lvl - 1].status = "Completed";
                        userProgressData.trademarkInfo.levels[lvl - 1].pointsEarned = points;
                        break;
                    case "Copyright":
                        if (userProgressData.copyrightInfo.levels.length < lvl || lvl <= 0) {
                            return res.status(400).json({ msg: 'Invalid Level' });
                        }
                        userProgressData.copyrightInfo.levels[lvl - 1].status = "Completed";
                        userProgressData.copyrightInfo.levels[lvl - 1].pointsEarned = points;
                        break;
                    case "Design":
                        if (userProgressData.designInfo.levels.length < lvl || lvl <= 0) {
                            return res.status(400).json({ msg: 'Invalid Level' });
                        }
                        userProgressData.designInfo.levels[lvl - 1].status = "Completed";
                        userProgressData.designInfo.levels[lvl - 1].pointsEarned = points;
                        break;
                    default:
                        return res.status(400).json({ msg: 'Invalid Section' });
                }

                const currentDate = new Date();

                const existingPointDetail = userProgressData.pointsDetail.find(detail => areDatesEqual(detail.dateModified, currentDate));

                if (existingPointDetail) {
                    existingPointDetail.points += points;
                } else {
                    userProgressData.pointsDetail.push({
                        points: points,
                        dateModified: currentDate
                    });
                }

                await userProgressData.save();
                return res.status(200).json({ msg: 'Points Added Successfully' });

            } catch (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        }
    }
}

const areDatesEqual = (date1, date2) => {
    const isSameYear = date1.getFullYear() === date2.getFullYear();
    const isSameMonth = date1.getMonth() === date2.getMonth();
    const isSameDay = date1.getDate() === date2.getDate();

    return isSameYear && isSameMonth && isSameDay;
};

module.exports = pointsAndLeaderBoardController;
