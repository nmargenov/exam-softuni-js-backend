const handlebars = require('express-handlebars');

function handlebarsConfig(app){
    app.engine('hbs',handlebars.engine({
        extname:'hbs'
    }));
}

module.exports = handlebarsConfig;