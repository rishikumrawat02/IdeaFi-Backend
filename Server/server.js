const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT  || 8000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

require('./databaseConn')();
require('../Routes/routes')(app);

const server = app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
