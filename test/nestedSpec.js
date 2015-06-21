require('should');
var request = require('supertest');

var Sails = require('sails').Sails;


describe('parametized policies hook - nested factories', function(){

    var sails;

    before(function(done){


        this.timeout(11000);

        Sails().lift({
            hooks: {
                'parametized-policies': require('../'),
                grunt: false,
            },
            log: {
                level: 'error'
            },
            paths: {
                controllers: __dirname + '/controllers',
                policies: __dirname + '/policies',
                policiesFactories: __dirname + '/policiesFactories',
            },
            routes: {
                'GET /policies-args': 'NestedController.policiesArgs',
                'GET /mixed-args': 'NestedController.mixedArgs',
                'GET /factories-args': 'NestedController.factoriesArgs',
            },
            policies: {
                'NestedController': {
                    'policiesArgs': ['and(isAdmin, accept)'],
                    'mixedArgs': 'and(isAdmin, is(\'User\'))',
                    'factoriesArgs': 'and(is(\'Admin\'), is(\'User\'))',
                }
            }
        }, function(err, _sails){

            if(err) return done(err);

            sails = _sails;

            return done();
        });
    });

    after(function(done){

        if(sails){
            sails.lower(done);
        }

    });

    it('should start the sails server', function(){
        return true;
    });

    it('should handle factory with policies as arguments', function(done){
        request(sails.hooks.http.app)
            .get('/policies-args')
            .expect('Admin', done);
    });

    it('should handle factory with mixed arguments', function(done){
        request(sails.hooks.http.app)
            .get('/mixed-args')
            .expect('AdminUser', done);
    });

    it('should handle factory with factories as arguments', function(done){
        request(sails.hooks.http.app)
            .get('/factories-args')
            .expect('AdminUser', done);
    });
})
