const { getAllAnimals, createAnimal, getAnimalById, deleteAnimalById, editAnimal, donate, checkIfUserAlreadyDonated } = require('../managers/animalManager');
const { mustBeAuth } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorHelper');

const router = require('express').Router();

router.get('/dashboard',async(req,res)=>{
    try{
        const animals = await getAllAnimals().lean();
        const hasAnimals = animals.length>0;
        res.status(302).render('animals/dashboard',{animals,hasAnimals});
    }catch(err){
        res.status(404).render('404');
    }
});

router.get('/add',mustBeAuth,(req,res)=>{
    res.status(302).render('animals/create');
});

router.post('/add',mustBeAuth,async(req,res)=>{
    const name = req.body.name?.trim();
    const years = req.body.years;
    const kind = req.body.kind?.trim();
    const image = req.body.image?.trim();
    const need = req.body.need?.trim();
    const location = req.body.location?.trim();
    const description = req.body.description?.trim();

    const owner = req.user._id;

    try{
        await createAnimal(name,years,kind,image,need,location,description,owner);
        res.redirect('/animals/dashboard');
    }catch(err){
        const error = getErrorMessage(err);
        res.status(400).render('animals/create',{error,name,years,kind,image,need,location,description})
    }
});

router.get('/:animalId/details',async(req,res)=>{
    try{
        const animalId = req.params.animalId;
        const animal = await getAnimalById(animalId).lean();
        if(!animal){
            throw new Error("Invalid animal!")
        }
        const loggedUser = req.user?._id;
        const isOwner = loggedUser && loggedUser == animal.owner;
        const hasDonated = loggedUser && checkIfUserAlreadyDonated(animal,loggedUser);
        res.status(302).render('animals/details',{animal,loggedUser,isOwner,hasDonated});
    }catch(err){
        res.status(404).render('404');
    }
});

router.get('/:animalId/delete',mustBeAuth,async(req,res)=>{
    try{
        const animalId = req.params.animalId;
        const loggedUser = req.user._id;
        const animal = await getAnimalById(animalId);
        if(!animal || animal.owner != loggedUser){
            throw new Error("Invalid request!");
        }
        await deleteAnimalById(animalId);
        res.redirect('/animals/dashboard');
    }catch(err){
        res.status(404).render('404');
    }
});

router.get('/:animalId/edit',mustBeAuth,async(req,res)=>{
    try{
        const animalId = req.params.animalId;
        const loggedUser = req.user._id;
        const animal = await getAnimalById(animalId).lean();
        if(!animal || animal.owner != loggedUser){
            throw new Error("Invalid request!");
        }
        res.status(302).render('animals/edit',{animal});
    }catch(err){
        res.status(404).render('404');
    }
});

router.post('/:animalId/edit',mustBeAuth,async(req,res)=>{
    const name = req.body.name?.trim();
    const years = req.body.years;
    const kind = req.body.kind?.trim();
    const image = req.body.image?.trim();
    const need = req.body.need?.trim();
    const location = req.body.location?.trim();
    const description = req.body.description?.trim();

    const animal = {name, years, kind, image, need, location, description};
    try{
        const animalId = req.params.animalId;
        const animal = await getAnimalById(animalId).lean();
        const loggedUser = req.user._id;
        if(!animal || animal.owner != loggedUser){
            throw new Error("Invalid request!");
        }
        await editAnimal(animalId,name,years,kind,image,need,location,description);
        res.redirect(`/animals/${animalId}/details`);
    }catch(err){
        const error = getErrorMessage(err);
        res.status(400).render('animals/edit',{error,animal});
    }
});

router.get('/:animalId/donate',mustBeAuth,async(req,res)=>{
    try{
        const animalId = req.params.animalId;
        const loggedUser = req.user._id;
        const animal = await getAnimalById(animalId);
        if(!animal || animal.owner == loggedUser){
            throw new Error("Invalid request!");
        }
        await donate(animal,animalId,loggedUser);
        res.redirect(`/animals/${animalId}/details`);
    }catch(err){
        res.status(404).render('404');
    }
});

router.get('/search',async(req,res)=>{
    const search = req.query.search;
    try{
        let animals = await getAllAnimals().lean();
        if(search){
            animals = animals.filter(a=>a.location.toLowerCase().includes(search.toLowerCase().trim()));
        }
        const hasAnimals = animals.length>0;
        res.status(302).render('animals/search',{animals,hasAnimals,search})
    }catch(err){
        res.status(404).render('404');
    }
});

module.exports = router;