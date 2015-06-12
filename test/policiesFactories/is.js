module.exports = function(userType){

    return function(req, res, next){
        res.write(userType);
        next();
    };
};
