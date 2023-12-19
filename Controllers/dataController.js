const PatentModel = require('../Models/patent');
const TradeMarkModel = require('../Models/trademark');
const CopyRightModel = require('../Models/copyright');
const DesignModel = require('../Models/design');
const IPModel = require('../Models/basicIP');
const StreakModel = require('../Models/streakModel');

function dataController() {
    return {
        addLevelData: async (req, res) => {
            const section = req.params.section;
            const { title, content } = req.body;
            let newObject = {
                title: title,
                content: []
            };

            let maxScore = 0;
            for (const cont of content) {
                let newObj = {
                    para: cont.para || null,
                    imgLink: cont.imgLink || null,
                    link: cont.link || null
                };

                // Adding True-False
                if (cont.trueFalse) {
                    newObj.trueFalse = {
                        quest: cont.trueFalse.quest,
                        ans: cont.trueFalse.ans,
                        points: cont.trueFalse.points
                    };
                    maxScore += cont.trueFalse.points;
                }

                // Adding Text-MCQ question
                if (cont.txtmcq) {
                    newObj.txtmcq = {
                        quest: cont.txtmcq.quest,
                        options: cont.txtmcq.options,
                        answer: cont.txtmcq.answer,
                        points: cont.txtmcq.points
                    };
                    maxScore += cont.txtmcq.points;
                }

                // Addimg Img-MCQ question
                if (cont.imgmcq) {
                    newObj.imgmcq = {
                        questLink: cont.imgmcq.questLink,
                        optionsLink: cont.imgmcq.optionsLink,
                        answerLink: cont.imgmcq.answerLink,
                        points: cont.imgmcq.points
                    };
                    maxScore += cont.imgmcq.points;
                }

                newObject.content.push(newObj);
            }

            newObject.maxScore = maxScore;

            try {
                let savedObj;

                switch (section) {
                    case 'ipr':
                        savedObj = await IPModel.findOne();
                        break;
                    case "Trademark":
                        savedObj = await TradeMarkModel.findOne();
                        break;
                    case "Patent":
                        savedObj = await PatentModel.findOne();
                        break;
                    case "Design":
                        savedObj = await DesignModel.findOne();
                        break;
                    case "Copyright":
                        savedObj = await CopyRightModel.findOne();
                        break;
                    default:
                        return res.status(400).json({ msg: 'Invalid section specified' });
                }

                if (!savedObj) {
                    return res.status(400).json({ msg: 'Failed to Add Data' });
                }

                savedObj.levels.push(newObject);
                savedObj = await savedObj.save();

                if (!savedObj) {
                    return res.status(400).json({ msg: 'Failed to Add Data' });
                }

                return res.status(201).json({ msg: 'Successfully Added Data' });
            } catch (error) {
                console.error('Error while adding levelInfo:', error);
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        },


        getLevelNameAndPoints: async (req, res) => {
            try {
                const patentData = await PatentModel.findOne();
                const tradeMarkData = await TradeMarkModel.findOne();
                const copyRightData = await CopyRightModel.findOne();
                const designData = await DesignModel.findOne();

                const response = {
                    patentLevelInfo: mapLevelData(patentData),
                    tradeLevelInfo: mapLevelData(tradeMarkData),
                    copyLevelInfo: mapLevelData(copyRightData),
                    designLevelInfo: mapLevelData(designData)
                };

                return res.status(200).json({ data: response });
            } catch (error) {
                console.error('Error while retrieving levelInfo:', error);
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        },


        getPatentData: async (req, res) => {
            try {
                const lvl = req.params.level;
                const data = await PatentModel.findOne();

                if (!data || data.length === 0 || !data.levels || data.levels.length < lvl || lvl == 0) {
                    return res.status(404).json({ msg: 'No data found' });
                }

                let response = {};
                response.title = data.levels[lvl - 1].title;
                response.maxScore = data.levels[lvl - 1].maxScore;
                response.content = [];

                for (let cont of data.levels[lvl - 1].content) {
                    if (cont.para != null) {
                        response.content.push(cont.para);
                    }
                    if (cont.imgLink != null) {
                        response.content.push(cont.imgLink);
                    }
                    if (cont.link != null) {
                        response.content.push(cont.link);
                    }
                    if (cont.trueFalse) {
                        response.cont.push(trueFalse);
                    }
                    if (cont.txtmcq.quest) {
                        response.cont.push(cont.txtmcq);
                    }
                    if (cont.imgmcq.questLink) {
                        response.cont.push(cont.imgmcq);
                    }
                }

                return res.status(200).json({ level: response });
            } catch (error) {
                console.error('Error while retrieving patentData:', error);
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        },


        getTradeMarkData: async (req, res) => {
            try {
                const lvl = req.params.level;
                const data = await TradeMarkModel.findOne();

                if (!data || data.length === 0 || !data.levels || data.levels.length < lvl || lvl == 0) {
                    return res.status(404).json({ msg: 'No data found' });
                }

                let response = {};
                response.title = data.levels[lvl - 1].title;
                response.maxScore = data.levels[lvl - 1].maxScore;
                response.content = [];

                for (let cont of data.levels[lvl - 1].content) {
                    const obj = {};
                    if (cont.para != null && cont.imgLink != null) {
                        obj.type = 'paraImg';
                        obj.para = cont.para;
                        obj.imgLink = cont.imgLink;
                    } else if (cont.para != null) {
                        obj.type = 'para';
                        obj.para = cont.para;
                    } else if (cont.trueFalse.quest) {
                        obj.type = 'trueFalse';
                        obj.tF.trueFalse = cont.trueFalse;
                    } else {
                        obj.type = 'textMcq';
                        obj.tM.txtmcq = cont.txtmcq;
                    }
                    response.content.push(obj);
                }

                return res.status(200).json({ level: response });
            } catch (error) {
                console.error('Error while retrieving trademarkData:', error);
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        },


        getCopyrightData: async (req, res) => {
            try {
                const lvl = req.params.level;
                const data = await CopyRightModel.find();

                if (!data || data.length === 0 || !data.levels || data.levels.length < lvl || lvl == 0) {
                    return res.status(404).json({ msg: 'No data found' });
                }

                return res.status(200).json({ level: data.levels[lvl - 1] });
            } catch (error) {
                console.error('Error while retrieving copyrightData:', error);
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        },


        getDesignData: async (req, res) => {
            try {
                const lvl = req.params.level;
                const data = await DesignModel.find();

                if (!data || data.length === 0 || !data.levels || data.levels.length < lvl || lvl == 0) {
                    return res.status(404).json({ msg: 'No data found' });
                }

                return res.status(200).json({ level: data.levels[lvl - 1] });
            } catch (error) {
                console.error('Error while retrieving designData:', error);
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        },

        addStreakData: async (req, res) => {
            const obj = req.body;
            try {
                const saved = await StreakModel.create(obj);
                return res.status(200).json({ msg: 'Streak Data Added Successfully' });
            } catch (error) {
                console.error('Error while adding streak data:', error);
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        },

        getStreakData: async (req, res) => {
            try {
                const data = await StreakModel.findOne();
                const response = {};
                response.quest = data.quest;
                response.options = data.options;
                response.answer = data.answer;
                return res.status(200).json({ response });
            } catch (error) {
                console.error('Error while fetching streak data:', error);
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        }
    }
}

function mapLevelData(data) {
    return data ? data.levels.map(level => ({ levelTitle: level.title, maxScore: level.maxScore })) : [];
}

module.exports = dataController;