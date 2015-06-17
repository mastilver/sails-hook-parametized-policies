var esprima = require('esprima');



module.exports = function(sails){
    return {

        defaults: {
            paths: {
                policiesFactories: '/api/policiesFactories',
            }
        },

        configure: function(){
            sails.config.policies = this.parse(sails.config.policies);
        },

        parse: function(obj){

            var type = typeof obj;

            if(type === 'object'){
                for(var i in obj){
                    obj[i] = this.parse(obj[i]);
                }

                return obj;
            }


            if(type === 'string'){

                var functionMatches = obj.match(/^(.*)\((.*)\)$/);


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


            return obj;
        }
    };



}
