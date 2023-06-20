const { MongooseError } = require('mongoose');

exports.getErrorMessage = (err) => {
    let error = "";
    if (err instanceof MongooseError) {
        error = Object.values(err.errors)[0];
    } else {
        error = err.message;
    }
    return error;
}