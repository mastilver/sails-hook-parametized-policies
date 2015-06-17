module.exports = function(json){
    return function(req, res, next){
        req.write(JSON.parse(json)[0]);
        next();
    };
};
