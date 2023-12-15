const PatentModel = require('../Models/patent');
const TradeMarkModel = require('../Models/trademark');
const CopyRightModel = require('../Models/copyright');
const DesignModel = require('../Models/design');

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

                // Adding true-false question
                if (cont.trueFalse) {
                    newObj.trueFalse = cont.trueFalse.map(tF => ({
                        quest: tF.quest,
                        ans: tF.ans,
                        points: tF.points
                    }));
                    maxScore += newObj.trueFalse.reduce((acc, tF) => acc + Number(tF.points), 0);
                }

                // Adding Text-MCQ question
                if (cont.txtmcq) {
                    newObj.txtmcq = cont.txtmcq.map(tM => ({
                        quest: tM.quest,
                        options: tM.options,
                        answer: tM.answer,
                        points: tM.points
                    }));
                    maxScore += newObj.txtmcq.reduce((acc, tM) => acc + Number(tM.points), 0);
                }

                // Addimg Img-MCQ question
                if (cont.imgmcq) {
                    newObj.imgmcq = cont.imgmcq.map(IM => ({
                        questLink: IM.questLink,
                        optionsLink: IM.optionsLink,
                        answerLink: IM.answerLink,
                        points: IM.points
                    }));
                    maxScore += newObj.imgmcq.reduce((acc, IM) => acc + Number(IM.points), 0);
                }

                newObject.content.push(newObj);
            }

            newObject.maxScore = maxScore;

            try {
                let savedObj;

                switch (section) {
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
                const data = await PatentModel.find();

                if (!data || data.length === 0 || data.length<lvl || lvl==0) {
                    return res.status(404).json({ msg: 'No data found' });
                }

                return res.status(200).json({ data: data[lvl-1] });
            } catch (error) {
                console.error('Error while retrieving patentData:', error);
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        },


        getTradeMarkData: async (req, res) => {
            try {
                const lvl = req.params.level;
                const data = await TradeMarkModel.find();

                if (!data || data.length === 0 || data.length<lvl || lvl==0) {
                    return res.status(404).json({ msg: 'No data found' });
                }

                return res.status(200).json({ data: data[lvl-1] });
            } catch (error) {
                console.error('Error while retrieving trademarkData:', error);
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        },


        getCopyrightData: async (req, res) => {
            try {
                const lvl = req.params.level;
                const data = await CopyRightModel.find();

                if (!data || data.length === 0 || data.length<lvl || lvl==0) {
                    return res.status(404).json({ msg: 'No data found' });
                }

                return res.status(200).json({ data: data[lvl-1] });
            } catch (error) {
                console.error('Error while retrieving copyrightData:', error);
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        },


        getDesignData: async (req, res) => {
            try {
                const lvl = req.params.level;
                const data = await DesignModel.find();

                if (!data || data.length === 0 || data.length<lvl || lvl==0) {
                    return res.status(404).json({ msg: 'No data found' });
                }

                return res.status(200).json({ data: data[lvl-1] });
            } catch (error) {
                console.error('Error while retrieving designData:', error);
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        }

    }
}

function mapLevelData(data) {
    return data ? data.levels.map(level => ({ levelTitle: level.title, maxScore: level.maxScore })) : [];
}

module.exports = dataController;