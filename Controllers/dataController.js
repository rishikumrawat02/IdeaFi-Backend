const CopyRightModel = require('../Models/patent');
const DesignModel = require('../Models/patent');
const PatentModel = require('../Models/patent');
const TradeMarkModel = require('../Models/patent');

function dataController() {
    return {
        addTrademarkLevel: async (req, res) => {
            const { title, content } = req.body;
            let newObject = {
                title: title,
                content: []
            };

            let maxScore = 0;
            for (cont of content) {
                let newObj = {};
                newObj.para = cont.para || null;
                newObj.imgLink = cont.imgLink || null;
                newObj.link = cont.link || null;

                // Adding true-false question
                if (cont.trueFalse) {
                    newObj.trueFalse = [];
                    for (tF of cont.trueFalse) {
                        newObj.trueFalse.push({
                            quest: tF.quest,
                            ans: tF.ans,
                            points: tF.points
                        })
                        maxScore += tF.points;
                    }
                }


                // Adding Text-MCQ question
                newObj
                for (tM of cont.trueFalse) {
                    newObject.trueFalse.push({
                        quest: tF.quest,
                        ans: tF.ans,
                        points: tF.points
                    })
                    maxScore += tF.points;
                }


            }



        },

        getTradeMarkData: async (req, res) => {
            const data = TradeMarkModel.find();
            if (!data) {
                return res.status(400).json({ msg: 'Failed to retriev data' });
            }
            return data;
        },

        getPatentData: async (req, res) => {
            const data = PatentModel.find();
            if (!data) {
                return res.status(400).json({ msg: 'Failed to retriev data' });
            }
            return data;
        },

        getCopyrightData: async (req, res) => {
            const data = CopyRightModel.find();
            if (!data) {
                return res.status(400).json({ msg: 'Failed to retriev data' });
            }
            return data;
        },

        getDesignData: async (req, res) => {
            const data = DesignModel.find();
            if (!data) {
                return res.status(400).json({ msg: 'Failed to retriev data' });
            }
            return data;
        }
    }
}

module.exports = dataController;