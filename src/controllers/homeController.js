const { getLatestThreeAnimals } = require('../managers/animalManager');

const router = require('express').Router();

router.get(['/','/index'],async(req,res)=>{
    try{
        const animals = await getLatestThreeAnimals().lean();
        const hasAnimals = animals.length>0;
        res.status(302).render('home',{animals,hasAnimals});
    }catch(err){
        res.status(404).render('404');
    }
});

module.exports = router;