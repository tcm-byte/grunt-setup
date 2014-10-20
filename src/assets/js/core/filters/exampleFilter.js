angular.module('core.filters.example',[])
    .filter('exampleFilter', function(){

        return function(variable){
            return variable;
        };
    });