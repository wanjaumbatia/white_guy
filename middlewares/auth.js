/**
 * @desc protects author routes from being accessed without logging in
 */
exports.authMiddleware = (req, res, next) => {   
    if(req.session.userid !== null && req.session.userid != undefined  ){
        next();
    }else{        
        return res.redirect('/auth/login');
    }
}

