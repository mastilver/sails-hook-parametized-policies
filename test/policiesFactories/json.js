module.exports = function(json){
    return function(req, res, next){
        res.write(JSON.parse(json)[0]);
        next();
    };
};
