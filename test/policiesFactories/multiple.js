module.exports = function(first, second){
    return function(req, res, next){
        res.write(first + '-' + second);
        next();
    }
};
