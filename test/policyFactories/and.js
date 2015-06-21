
module.exports = function(firstFn, secondFn){

    return function(req, res, next){

        firstFn(req, res, function(){

            secondFn(req, res, next);
        });
    };
};
