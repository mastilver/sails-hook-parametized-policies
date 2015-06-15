



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

                var functionMatches = obj.match(/(.*)\((.*)\)/);


                // the policy is a function
                if(functionMatches !== null){

                    var functionName = functionMatches[1];
                    var args = JSON.parse('[' + functionMatches[2].replace(/'/g, '"') + ']');

                    var policyFactory = require(sails.config.paths.policiesFactories + '/' + functionName);

                    var policy = policyFactory.apply(this, args);

                    return policy;
                }
            }


            return obj;
        }
    };



}
