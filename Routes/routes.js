const usercontroller = require('../Controllers/userController');
const dataController = require('../Controllers/dataController');
const pointsController = require('../Controllers/pointsAndLeaderboard');
const pointsAndLeaderBoardController = require('../Controllers/pointsAndLeaderboard');
const userController = require('../Controllers/userController');

function initRoutes(app) {
    app.get('/', (req, res) => {
        return res.status(200).json({ msg: 'Welcom to the Idea-Fi' });
    });

    // Add level data
    app.post('/ideafibackend/data/addData/:section', dataController().addLevelData);

    // Get level data
    app.get('/ideafibackend/data/getData/ipr/:level', dataController().getIPRData);
    app.get('/ideafibackend/data/getData/patent/:level', dataController().getPatentData);
    app.get('/ideafibackend/data/getData/trademark/:level', dataController().getTradeMarkData);
    app.get('/ideafibackend/data/getData/copyright/:level', dataController().getCopyrightData);
    app.get('/ideafibackend/data/getData/design/:level', dataController().getDesignData);

    // Get Level Name and Info
    app.get('/ideafibackend/data/getData/getLevelInfo', dataController().getLevelNameAndPoints);


    // Register User and Get User Info
    app.post('/ideafibackend/user/register', usercontroller().addUser);
    app.get('/ideafibackend/user/userInfo', usercontroller().getUserInfo);
    app.get('/ideafibackend/user/getUserProgress', usercontroller().getUserProgress);

    // Add points of the user
    app.post('/ideafibackend/user/addPoints/:section/:level', pointsController().addPoints);

    // Get ranks
    app.get('/ideafibackend/rank/getRanks', pointsController().getRanks);

    // Add Streak
    app.post('/ideafibackend/user/streakComplete', pointsController().streakComplete);

    // Statics 
    app.post('/ideafibackend/user/addStatics', pointsController().addStatics);

    // Badges
    app.post('/ideafibackend/user/addBadges', pointsController().addBadges);
    app.get('/ideafibackend/user/getBadges', pointsController().getBadges);

    // Certification
    app.post('/ideafibackend/user/certification', pointsController().certificationComplete);
    app.get('/ideafibackend/user/getCertificate', pointsController().getCertificate);

    // Module Progress
    app.get('/ideafibackend/user/getUserModuleProgress', userController().getUserModuleProgress);

    // Streak Logic
    app.get('/ideafibackend/user/getStreakInfo', userController().getStreakInfo);
    app.post('/ideafibackend/addData/streakData', dataController().addStreakData);
    app.get('/ideafibackend/getData/streakData', dataController().getStreakData);
}

module.exports = initRoutes;