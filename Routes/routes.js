const usercontroller = require('../Controllers/userController');
const dataController = require('../Controllers/dataController');
const pointsController = require('../Controllers/pointsAndLeaderboard');

function initRoutes(app) {
    app.get('/', (req, res) => {
        return res.status(200).json({ msg: 'Welcom to the Idea-Fi' });
    });

    // Add level data
    app.post('/ideafibackend/data/addData/:section', dataController().addLevelData);

    // Get level data
    app.get('/ideafibackend/data/getData/patent/:level',dataController().getPatentData);
    app.get('/ideafibackend/data/getData/trademark/:level',dataController().getTradeMarkData);
    app.get('/ideafibackend/data/getData/copyright/:level',dataController().getCopyrightData);
    app.get('/ideafibackend/data/getData/design/:level',dataController().getDesignData);

    // Get Level Name and Info
    app.get('/ideafibackend/data/getData/getLevelInfo',dataController().getLevelNameAndPoints);


    // Register User and Get User Info
    app.post('/ideafibackend/user/register', usercontroller().addUser);
    app.get('/ideafibackend/user/userInfo', usercontroller().getUserInfo);
    app.get('/ideafibackend/user/getUserProgress', usercontroller().getUserProgress);

    // Add points of the user
    app.post('/ideafibackend/user/addPoints/:section/:level',pointsController().addPoints);

    // Get ranks
    app.get('/ideafibackend/rank/getRanks',pointsController().getRanks);

}

module.exports = initRoutes;