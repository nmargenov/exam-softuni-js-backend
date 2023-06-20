const { SECRET, AUTH_COOKIE } = require("../config/config");
const { verify } = require("../lib/jwt");

exports.auth = async(req,res,next)=>{
    const token = req.cookies[AUTH_COOKIE];
    
    if(token){
        try{
            const decodedToken = await verify(token,SECRET);

            req.user = decodedToken;
            res.locals.isLogged = true;
            res.locals.user = decodedToken;

            next();
        }catch(err){
            res.clearCookie(AUTH_COOKIE);
            
            res.redirect('/login');
        }
    }else{
        next();
    }
};

exports.mustBeAuth = (req,res,next)=>{
    if(!req.user){
        return res.redirect('/login');
    }
    next();
};

exports.mustBeGuest = (req,res,next)=>{
    if(req.user){
        return res.redirect('/');
    }
    next();
}