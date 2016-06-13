# sails-hook-parametized-policies [![Build Status](https://travis-ci.org/mastilver/sails-hook-parametized-policies.svg?branch=master)](https://travis-ci.org/mastilver/sails-hook-parametized-policies) [![Coverage Status](https://coveralls.io/repos/mastilver/sails-hook-parametized-policies/badge.svg?branch=master)](https://coveralls.io/r/mastilver/sails-hook-parametized-policies?branch=master)

## Install

`$ npm install --save sails-hook-parametized-policies`

## Setup

add your factories inside `api/policyFactories` or in the folder you defined on `sails.config.paths.policyFactories`

example: `is.js`

```
module.exports = function(userType){

    return function(req, res, next){

        var roles = req.user.roles;

        if(roles.indexOf(userType) > 0){
            return next();
        }

        res.forbidden('You must be an ' + userType + ' to access this resource');
    };
};
```

or a more complex one: `or.js`

<a href="https://gist.github.com/1nstinct/12399f8adc4e5cfd6e88" target="_blank">example of OR policy with a num of arguments</a>

## Usage

in your `config/policies.js`

```
{
    ProfileController: {
        edit: 'isLoggedIn'
        create: ['or(is(\'Admin\'), is(\'SubAdmin\'))', 'isLoggedIn'],
        delete: ['is(\'Admin\')', 'isLoggedIn'],
    }
}
```
