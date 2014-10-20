angular.module('template-precache', ['partials/exampleTemplate.phtml']);

angular.module("partials/exampleTemplate.phtml", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/exampleTemplate.phtml",
    "<h1>Example Partial</h1>");
}]);
