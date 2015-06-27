'use strict';

var panelX = ((+$(".section-wrapper").css("left").slice(0, -2)) + (+$(".section-wrapper").css("padding-left").slice(0, -2)) + 
						(+$("section").css("margin-left").slice(0, -2))),
						panelY = ((+$(".section-wrapper").css("top").slice(0, -2)) + (+$(".section-wrapper").css("padding-top").slice(0, -2)) + 
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
