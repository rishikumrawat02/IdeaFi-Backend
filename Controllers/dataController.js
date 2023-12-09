const CopyRightModel = require('../Models/patent');
const DesignModel = require('../Models/patent');
const PatentModel = require('../Models/patent');
const TradeMarkModel = require('../Models/patent');

function dataController(){
    return {
        getTradeMarkData: async(req,res)=>{
            const data = TradeMarkModel.find();
            if(!data){
                return res.status(400).json({msg: 'Failed to retriev data'});
            }
            return data;
        },

        getPatentData: async(req,res)=>{
            const data = PatentModel.find();
            if(!data){
                return res.status(400).json({msg: 'Failed to retriev data'});
            }
            return data;
        },

        getCopyrightData: async(req,res)=>{
            const data = CopyRightModel.find();
            if(!data){
                return res.status(400).json({msg: 'Failed to retriev data'});
            }
            return data;
        },

        getDesignData: async(req,res)=>{
            const data = DesignModel.find();
            if(!data){
                return res.status(400).json({msg: 'Failed to retriev data'});
            }
            return data;
        }
    }
}

module.exports = dataController;