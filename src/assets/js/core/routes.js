core.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'exampleController'
        })
        .otherwise({ redirectTo: '/' });
}]);
