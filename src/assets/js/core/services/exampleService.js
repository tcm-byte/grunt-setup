angular.module('core.services.example',[])
    .service('exampleService', function(){
        this.doSomething = function(){
            return 'something';
        };
    });