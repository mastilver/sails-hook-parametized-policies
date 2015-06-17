
module.exports = function(firstFn, secondFn){

    return function(req, res, next){

        var firstFnCalled = false;


        console.log('calling first')

        firstFn(req, res, function(){

            console.log('first called');

            firstFnCalled = true;
            next();
        });

        if(!firstFnCalled){
            console.log('calling second');
            secondFn(req, res, next);
        }
    };
};
