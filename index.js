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
        parseEsprima: parseEsprima,
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
        var parsedString = esprima.parse(input).body[0].expression;
        return this.parseEsprima(parsedString);
    }


    return input;
}


/*
    input [Esprima Object]
    fromFactory [Boolean] set to true the result will be interpreted by a factory
*/
function parseEsprima(input, fromFactory){

    var type = input.type;

    if(type === esprimaType.value){
        return input.value;
    }


    if(type === esprimaType.policy){

        var policyName = input.name;

        if(fromFactory){
            return require(sails.config.paths.policies + '/' + policyName);
        }
        
        return policyName;
    }


    if(type === esprimaType.factory){

        var factoryName = input.callee.name;

        var factory = require(sails.config.paths.policiesFactories + '/' + factoryName);

        var args = input.arguments.map(function(arg){
            return this.parseEsprima(arg, true);
        }, this);

        return factory.apply(this, args);
    }


    throw new Error('esprima type unhandled: ' + type);
}


var esprimaType = {
    value: 'Literal',
    policy: 'Identifier',
    factory: 'CallExpression',
}
