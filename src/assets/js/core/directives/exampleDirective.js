angular.module('core.directives.example', [])
    .directive('exampleDirective', function(){
        return {
            scope: {},
            templateUrl: "partials/exampleTemplate.phtml",
            replace: true,
            restrict: "EAC",
            controller: function($scope, $element, $attrs){

            },
            link: function($scope, $element, $attrs){
            }
        };
    });
