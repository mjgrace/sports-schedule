const mongoose = require('mongoose');

const connectDB = () => {
    console.log('mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME);
    mongoose.connect('mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
    console.log('MongoDB connected!');
    // Now proceed with your code to save data to the database.
    }).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    });
}

module.exports = connectDB;