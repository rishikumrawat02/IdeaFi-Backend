const mongoose = require('mongoose');
const connString = process.env.MONGO_URI;

const dataConn = () => {
    try {
        mongoose.connect(connString);
        console.log('Database connected successfully');
    } catch (err) {
        console.log('Database Connection Failed');
        console.log(err);
    }

    const db = mongoose.connection;
    db.on('error', err=>{
        console.log(err);
    });
    db.once('open', () => {
        console.log('Connected to MongoDB Atlas!');
    });
}

module.exports = dataConn;
