var core = angular.module('core', [
    'ngRoute',
    'ngTouch',
    'ngSanitize',
    'ngResource',
    'core.controllers',
    'core.constants',
    'core.directives',
    'core.services',
    'core.factories',
    'core.filters',
    'template-precache'
    ]);

angular.module('core.controllers',[
    'core.controllers.example'
]);

angular.module('core.constants', [
    'core.constants.example'
]);

angular.module('core.directives', [
    'core.directives.example'
]);

angular.module('core.services', [
    'core.services.example'
]);

angular.module('core.factories', [
    'core.factories.example'
]);

angular.module('core.filters', [
    'core.filters.example'
]);