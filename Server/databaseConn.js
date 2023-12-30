const mongoose = require('mongoose');
const connString = `mongodb+srv://rishabhkumrawat02:Ideafi%4012345@idea-fi.4an7gor.mongodb.net/Idea-Fi?retryWrites=true&w=majority`;

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
