var esprima = require('esprima');



module.exports = function(sails){
    return {

        defaults: {
            paths: {
                policiesFactories: '/api/policiesFactories',
            }
        },

        configure: function(){
            sails.config.policies = this.parsePolicies(sails.config.policies);
        },

        parsePolicies: parsePolicies,
        parsePolicy: parsePolicy,
    };
}


/*
    input [Any]
*/
function parsePolicies(input){
    var type = typeof input;

    if(type === 'object'){
        for(var i in input){
            input[i] = this.parsePolicies(input[i]);
        }

        return input;
    }


    if(type === 'string'){

        var functionMatches = input.match(/^(.*)\((.*)\)$/);


        // the policy is a function
        if(functionMatches !== null){

            var parsed = esprima.parse(functionMatches[0]);

            var functionName = parsed.body[0].expression.callee.name;
            var args = parsed.body[0].expression.arguments.map(function(arg){
                return arg.value;
            });


            var policyFactory = require(sails.config.paths.policiesFactories + '/' + functionName);

            var policy = policyFactory.apply(this, args);

            return policy;
        }
    }


    return input;
}


/*
    input [Esprima Object]
*/
function parsePolicy(input){

}
