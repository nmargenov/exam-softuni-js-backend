const mongoose = require('mongoose');
const imageRegex = /^https?:\/\//;

const animalSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required!'],
        minLength:[2,'Name must be at least 2 characters long!']
    },
    years:{
        type:Number,
        required:[true,'Years are required!'],
        min:[1,'Years must be between 1 and 100!'],
        max:[100,'Years must be between 1 and 100!']
    },
    kind:{
        type:String,
        required:[true,'Kind is required!'],
        minLength:[3,'Kind must be at least 3 characters long!'],
    },
    image:{
        type:String,
        required:[true,'Image is required!'],
        validate:{
            validator: function(value){
                return imageRegex.test(value);
            },
            message:'Invalid image URL!'
        }
    },
    need:{
        type:String,
        required:[true,'Need is required!'],
        minLength:[3,'Need must be between 3 and 20 characters long!'],
        maxLength:[20,'Need must be between 3 and 20 characters long!']
    },
    location:{
        type:String,
        required:[true,'Location is required!'],
        minLength:[5,'Location must be between 5 and 15 characters long!'],
        maxLength:[15,'Location must be between 5 and 15 characters long!']
    },
    description:{
        type:String,
        required:[true,'Description is required!'],
        minLength:[5,'Description must be between 5 and 50 characters long!'],
        maxLength:[50,'Description must be between 5 and 50 characters long!']
    },
    donations:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
});

const Animal = mongoose.model('Animal',animalSchema);

module.exports = Animal;