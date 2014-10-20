angular.module('core.factories.example',[])
    .factory('exampleFactory', function(){
        var functions = {};

        functions.doSomething = function(){
            return 'something';
        };

        return functions;
    });