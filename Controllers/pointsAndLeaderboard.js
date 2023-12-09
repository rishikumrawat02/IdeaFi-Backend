const [User, UserProgress] = require('../Models/user');

function pointsAndLeaderBoardController() {
    return {
        getRanks: async (req, res) => {
            const userId = req.body.userId;
            const rankBasis = req.body.rankBasis;

            let xDaysAgo = Date.now() - 1 * 24 * 60 * 60 * 1000;

            if (rankBasis === 'W') {
                xDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
            } else if (rankBasis == 'M') {
                xDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
            }

            const query = {
                "pointsDetail.dateModified": { $gte: xDaysAgo }
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
                        from: "User",
                        localField: "userId",
                        foreignField: "userId",
                        as: "user"
                    }
                },
                {
                    $project: {
                        userId: 1,
                        totalPoints: 1,
                        userName: 1
                    }
                }
            ];

            try {
                let userPointsData = await UserProgress.aggregate(aggregate);
                userPointsData = userPointsData.slice(0, 50);

                const userIndex = userPointsData.findIndex(user => user.userId === userId);            

                return res.status(200).json({
                    top50UserInfo: userPointsData, userRankandInfo: {
                        currentUserinfo: userPointsData[userIndex], rank: userIndex+1
                    }
                });
            } catch (err) {
                console.log(err);
                return res.status(400).json('Failed to get ranks');
            }
        }
    }
}

module.exports = pointsAndLeaderBoardController;
