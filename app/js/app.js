'use strict';

var panelX = ((+$(".panel-wrapper").css("left").slice(0, -2)) + (+$(".panel-wrapper").css("padding-left").slice(0, -2)) + 
						(+$("panel").css("margin-left").slice(0, -2))),
						panelY = ((+$(".panel-wrapper").css("top").slice(0, -2)) + (+$(".panel-wrapper").css("padding-top").slice(0, -2)) + 
						(+$("panel").css("margin-top").slice(0, -2)));
            
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
