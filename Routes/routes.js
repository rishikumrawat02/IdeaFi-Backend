const dataController = require('../Controllers/dataController');

function initRoutes(app) {
    app.post('/ideafibackend/trademark/addData', dataController().addTrademarkData);
    app.get('/ideafibackend/trademark/addData', dataController().getTradeMarkData);
}

module.exports = initRoutes;