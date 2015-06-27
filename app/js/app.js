'use strict';

var panelX = ((+$(".rel-wrapper").css("margin-left").slice(0, -2)) + (+$(".rel-wrapper").css("padding-left").slice(0, -2)) + 
						(+$("section").css("margin-left").slice(0, -2))),
		panelY = ((+$(".rel-wrapper").prop("offsetTop")) + (+$(".rel-wrapper").css("padding-top").slice(0, -2)) + 
						(+$("section").css("margin-top").slice(0, -2)));
            
// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.version',
  'controllers',
  'directives'
]);
//config(['$routeProvider', function($routeProvider) {
//  $routeProvider.otherwise({redirectTo: '/'});
//}]);
