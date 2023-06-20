const { AUTH_COOKIE } = require('../config/config');
const { register, login } = require('../managers/userManager');
const { mustBeAuth, mustBeGuest } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorHelper');

const router = require('express').Router();

router.get('/login', mustBeGuest,(req, res) => {
    res.status(302).render('users/login');
});

router.post('/login',mustBeGuest,async(req,res)=>{
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();

    try{
        const token = await login(email,password);
        res.cookie(AUTH_COOKIE,token);
        res.redirect('/');
    }
    catch(err){
        const error = getErrorMessage(err);
        res.status(400).render('users/login',{error,email});
    }
})

router.get('/register', mustBeGuest,(req, res) => {
    res.status(302).render('users/register');
});

router.post('/register',mustBeGuest,async(req,res)=>{
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();
    const rePassword = req.body.rePassword?.trim();

    try{
        const token = await register(email,password,rePassword);
        res.cookie(AUTH_COOKIE,token);
        res.redirect('/');
    }catch(err){
        const error = getErrorMessage(err);
        res.status(400).render('users/register',{error,email});
    }
});

router.get('/logout',mustBeAuth,(req,res)=>{
    res.clearCookie(AUTH_COOKIE);
    res.redirect('/');
});
module.exports = router;