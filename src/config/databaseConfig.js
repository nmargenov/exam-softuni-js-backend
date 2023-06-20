const mongoose = require('mongoose');
const { URI } = require('./config');

async function connectDatabase(){
    await mongoose.connect(URI);
}

module.exports = connectDatabase;
