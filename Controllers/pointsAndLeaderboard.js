const { default: mongoose } = require('mongoose');
const [User, UserProgress] = require('../Models/user');
const generatePDF = require('./pdfLogic');
const pdfModel = require('../Models/pdfModel');


function pointsAndLeaderBoardController() {
    return {
        getRanks: async (req, res) => {
            const uid = req.body.userId;

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
                const userIndex = userPointsData.findIndex(user => user.userId[0] === uid);

                if (userPointsData.length > 50) {
                    userPointsData = userPointsData.slice(0, 50);
                }

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
        },

        streakComplete: async (req, res) => {
            let userId = req.body.userId;
            try {
                const user = await User.findOne({ userId: userId });
                if (!user) {
                    return res.status(404).json({ msg: 'Invalid User Id' });
                }

                const uid = user._id;
                let userProgress = await UserProgress.findOne({ userId: uid });

                const today = new Date();
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);

                if (!userProgress.streakInfo) {
                    userProgress.streakInfo = {
                        longest: 0,
                        current: 0,
                        lastModified: yesterday,
                    };

                    userProgress = await userProgress.save();
                }


                const lastModifiedDate = userProgress.streakInfo.lastModified || yesterday;

                if (lastModifiedDate.getDate() == today.getDate() && lastModifiedDate.getMonth() == today.getMonth() && lastModifiedDate.getFullYear() == today.getFullYear()) {
                    return res.status(200).json({ msg: 'Already updated streak' });
                }

                if (lastModifiedDate.getDate() !== yesterday.getDate() || lastModifiedDate.getMonth() !== yesterday.getMonth() || lastModifiedDate.getFullYear() !== yesterday.getFullYear()
                ) {
                    userProgress.streakInfo.current = 1;
                } else {
                    userProgress.streakInfo.current += 1;
                }

                userProgress.streakInfo.longest = Math.max(
                    userProgress.streakInfo.longest,
                    userProgress.streakInfo.current
                );

                userProgress.streakInfo.lastModified = today;

                await userProgress.save();
                return res.status(200).json({ msg: 'User streak updated ', streakData: { curreStreak: userProgress.streakInfo.current, longestStreak: userProgress.streakInfo.longest } });

            } catch (error) {
                console.error('Error while completing streak:', error);
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        },

        addStatics: async (req, res) => {
            const userId = req.body.userId;
            const { timeSpent, correctAns, wrongAns } = req.body; // Use object destructuring directly for the userId
            try {
                const user = await User.findOne({ userId: userId });

                if (!user) {
                    return res.status(404).json({ msg: 'Invalid User Id' });
                }

                let userProgress = await UserProgress.findOne({ userId: user._id });

                if (!userProgress) {
                    return res.status(404).json({ msg: 'UserProgress Not Found' });
                }

                if (!userProgress.statics) {
                    userProgress.statics = {
                        timeSpent: 0,
                        correctAns: 0,
                        wrongAns: 0,
                    };
                }

                if (timeSpent) {
                    userProgress.statics.timeSpent += timeSpent;
                }

                if (correctAns) {
                    userProgress.statics.correctAns += correctAns;
                }

                if (wrongAns) {
                    userProgress.statics.wrongAns += wrongAns;
                }

                await userProgress.save();

                return res.status(200).json({ msg: 'Statistics Updated Successfully' });

            } catch (error) {
                console.error('Error while adding user statistics:', error);
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        },

        addBadges: async (req, res) => {
            let userId = req.body.userId;
            const badgeId = req.body.badgeId;

            try {
                const user = await User.findOne({ userId: userId });
                if (!user) {
                    return res.status(404).json({ msg: 'Invalid User Id' });
                }

                let userProgress = await UserProgress.findOne({ userId: user._id });
                if (!userProgress) {
                    return res.status(404).json({ msg: 'UserProgress Not Found' });
                }

                if (!userProgress.badges) {
                    userProgress.badges = [];
                }

                const idx = userProgress.badges.indexOf(badgeId);

                if (idx === -1) {
                    userProgress.badges.push(badgeId);
                }

                await userProgress.save();

                return res.status(200).json({ msg: 'Successfully Added Badge' });
            } catch (error) {
                console.error('Error while adding badge:', error);
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        },

        certificationComplete: async (req, res) => {
            const userId = req.body.userId;

            try {
                const user = await User.findOne({ userId: userId });

                if (!user) {
                    return res.status(404).json({ error: 'User not found with the provided Id' });
                }

                const exist = await pdfModel.findOne({ userId: userId });
                if (exist) {
                    return res.status(200).json({ msg: 'Certification Already Done' });
                }

                const pdfBuffer = await generatePDF(user.userName);

                const pdfData = pdfBuffer.toString('base64');

                // Save the PDF data along with other information to MongoDB
                await pdfModel.create({
                    userId: userId,
                    pdfData: pdfData,
                });

                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=certificate.pdf');

                // Send the PDF as the response
                return res.status(200).send(pdfBuffer);
            } catch (error) {
                console.error('Error while generating certificate:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        },

        getCertificate: async (req, res) => {
            const userId = req.body.userId;
            const pdfBuffer = await getPdfFromMongoDB(userId);
            if (!pdfBuffer) {
                return res.status(404).json({ msg: 'Invalid userId or User not completed certification' });
            }
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=certificate.pdf');

            // Send the PDF as the response
            return res.status(200).send(pdfBuffer);
        }
    }
}

async function getPdfFromMongoDB(userId) {
    try {
        // Find the document by userName
        const pdfDocument = await pdfModel.findOne({ userId: userId });

        if (!pdfDocument) {
            console.log('PDF not found in MongoDB for userName:', userName);
            return null;
        }

        // Convert base64 string back to buffer
        const pdfBuffer = Buffer.from(pdfDocument.pdfData, 'base64');

        return pdfBuffer;
    } catch (error) {
        console.error('Error while retrieving PDF from MongoDB:', error);
        return null;
    }
}


const areDatesEqual = (date1, date2) => {
    const isSameYear = date1.getFullYear() === date2.getFullYear();
    const isSameMonth = date1.getMonth() === date2.getMonth();
    const isSameDay = date1.getDate() === date2.getDate();

    return isSameYear && isSameMonth && isSameDay;
};

module.exports = pointsAndLeaderBoardController;
