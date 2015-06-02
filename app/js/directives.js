/// <reference path="../../typings/jquery/jquery.d.ts"/>
'use strict';
var directives = angular.module('directives', []);

directives.directive('repDropdown', ['$rootScope', function($rootScope){
	return {
		restrict: 'A',
		scope: {
			'attr':'=repDropdown'
		},
		controller:function($scope){
			$scope.chooseStyle = function(ff){
				if ($scope.attr.css === 'font-size' || $scope.attr.css === 'font-family'){
					$rootScope.$broadcast("fontStyleChanged", $scope.attr.css, ff);
				} else {
					$rootScope.$broadcast("paraStyleChanged", $scope.attr.css, ff);
				}
			};
		},
		link: function(scope, element, attrs){
		},
		replace:true,
		templateUrl: 'template/dropdown.html'
	};
}]);

directives.directive('repNodefault', ['$rootScope', function($rootScope){
	return {
		restrict: 'A',
		link: function(scope, elem, attrs){
			elem.on('mousedown mousemove', function(e){
				e.preventDefault();
			});
		}
	};
}]);

directives.directive('selectable', ['$rootScope', function($rootScope){
	return {
		restrict:"A",
		link:function(scope, element, attr){
			scope.$on("selectRectangleChanged", function(e, left, top, width, height){
				var elem = $(element[0]);
				var y = +elem.css("top").slice(0, -2), x = +elem.css("left").slice(0, -2),
					h = +elem.css("height").slice(0, -2), w = +elem.css("width").slice(0, -2), ind = $rootScope.selected.index(elem);
				if (y >= top && x >= left && height + top >= y + h && width + left >= w + x){
					if (ind === -1){
						$rootScope.selected.push(elem[0]);
						$rootScope.$broadcast("selectedEditablesChanged");
					}
				}
				else {
					if (ind !== -1){
						$rootScope.selected.splice(ind, 1);
						$rootScope.$broadcast("selectedEditablesChanged");
					}
				}
			});
			scope.$on("selectedEditablesChanged", function(e){
				var ind = $rootScope.selected.index(element[0]);
				scope.$apply(function(){
						scope.selected = ind !== -1;
				});
			});
		}
	};
}]);