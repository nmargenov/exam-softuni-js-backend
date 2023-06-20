const Animal = require("../models/Animal");

function getAllAnimals(){
    return Animal.find();
}

function getLatestThreeAnimals(){
    return Animal.find().sort({_id:-1}).limit(3);
}

function createAnimal(name,years,kind,image,need,location,description,owner){
    const animal = {
        name,
        years,
        kind,
        image,
        need,
        location,
        description,
        owner
    };

    return Animal.create(animal);
}

function getAnimalById(animalId){
    return Animal.findById(animalId);
}

function deleteAnimalById(animalId){
    return Animal.findByIdAndDelete(animalId);
}

function editAnimal(animalId,name,years,kind,image,need,location,description){
    const animal = {
        name,
        years,
        kind,
        image,
        need,
        location,
        description
    };

    return Animal.findByIdAndUpdate(animalId,animal,{runValidators:true});
}

function donate(animal,animalId,userId){
    if(checkIfUserAlreadyDonated(animal,userId)){
        throw new Error("You already donated!");
    }
    return Animal.findByIdAndUpdate(animalId,{$push:{donations:userId}});
}

function checkIfUserAlreadyDonated(animal,userId){
    return animal.donations.map(a=>a.toString()).includes(userId);
}

module.exports ={
    getAllAnimals,
    getLatestThreeAnimals,
    createAnimal,
    getAnimalById,
    deleteAnimalById,
    editAnimal,
    checkIfUserAlreadyDonated,
    donate,
}