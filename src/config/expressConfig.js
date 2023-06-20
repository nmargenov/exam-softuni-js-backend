const cookieParser = require('cookie-parser');
const express = require('express');
const { auth } = require('../middlewares/authMiddleware');

function expressConfig(app){
    app.use(express.static('src'));
    app.use(express.urlencoded({extended:false}));
    app.use(cookieParser());
    app.use(auth);

    app.set('view engine','hbs');
    app.set('views','src/views');
}

module.exports = expressConfig;