const express = require('express');
const app = express();
const PORT = 8000 || process.env.PORT;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

require('./databaseConn')();
require('../Models/patent');
require('../Routes/routes')(app);

const server = app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});