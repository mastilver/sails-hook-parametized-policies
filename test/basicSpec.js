require('should');
var request = require('supertest');

var Sails = require('sails').Sails;


describe('parametized policies hook - basic', function(){

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
                'GET /ok': 'MainController.ok',
                'GET /user': 'MainController.user',
                'GET /admin': 'MainController.admin',
                'GET /multiple': 'MainController.multiple',
                'GET /json': 'MainController.json',
            },
            policies: {
                'MainController': {
                    'admin': ['is(\'Admin\')'],
                    'user': 'is(\'User\')',
                    'ok': 'accept',
                    'multiple': 'multiple(1, \'one\')',
                    'json': 'json(\'["json"]\')',
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

    it('should not modify non function policies', function(done){
        request(sails.hooks.http.app)
            .get('/ok')
            .expect(200, done);
    });

    it('should parse function policy', function(done){
        request(sails.hooks.http.app)
            .get('/user')
            .expect('User', done);
    });

    it('should parse function policy into an array', function(done){
        request(sails.hooks.http.app)
            .get('/admin')
            .expect('Admin', done);
    });

    it('should handle multiple arguments policy', function(done){
        request(sails.hooks.http.app)
            .get('/multiple')
            .expect('1-one', done);
    });

    it('should handle json', function(){
        request(sails.hooks.http.app)
            .get('/json')
            .expect('json', done);
    })
})
