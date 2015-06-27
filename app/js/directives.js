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
			console.log("repDropdown");
			$scope.chooseStyle = function(ff){
				if ($scope.attr.css === 'font-size' || $scope.attr.css === 'font-family'){
					$rootScope.$broadcast("fontStyleChanged", $scope.attr.css, ff);
				} else if ($scope.attr.css === 'line-height' || $scope.attr.css === 'letter-spacing'){
					$rootScope.$broadcast("paraStyleChanged", $scope.attr.css, ff);
				} else {
					$rootScope.$broadcast("animStyleChanged", $scope.attr.css, ff);
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
			console.log('repNodefault');
			elem.on('mousedown mousemove', function(e){
				e.preventDefault();
				return false;
			});
		}
	};
}]);

directives.directive('selectable', ['$rootScope', function($rootScope){
	if (!$rootScope.selected)
		$rootScope.selected = $([]);
	return {
		restrict:"A",
		link:function(scope, element, attr){
			console.log('selectable')
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

directives.directive('repImg', ['$rootScope', function($rootScope){
	return {
		transclude:true,
		restrict: 'A',
		scope: {
		},
		link: function(scope, elem, attrs){
			console.log('repImg');
			elem = $(elem[0]);
			elem.bind('mousedown', function(e){
				if ($rootScope.draggable || $rootScope.resizable){
					e.preventDefault();
					return;
				}
				$rootScope.selected = $(elem);
				$rootScope.$broadcast("selectedEditablesChanged");
				$rootScope.$broadcast("selectionStyleChanged", null, null, elem[0]);
				$rootScope.$apply(function(){
					$rootScope.thisnode = elem[0];
				});
				e.stopPropagation();
			});
			scope.$on("blockStyleChanged", function(e, key, value){
				if (elem[0] !== $rootScope.thisnode)
					return;
					
				$(elem[0]).css(key, value);
				$rootScope.$broadcast("selectionStyleChanged", null, null, elem[0]);
			});
		},
		replace: true,
		template:"<img selectable ng-class='{selected:selected}'/>"
	};
}]);

directives.directive('repVideo', ['$rootScope', function($rootScope){
	return {
		restrict: 'A',
		transclude:true,
		scope: {
		},
		link: function(scope, elem, attrs){
			console.log('repVideo');
			elem = $(elem[0]);
			elem.bind('mousedown', function(e){
				if ($rootScope.draggable || $rootScope.resizable){
					e.preventDefault();
					return;
				}
				$rootScope.selected = $(elem);
				$rootScope.$broadcast("selectedEditablesChanged");
				$rootScope.$broadcast("selectionStyleChanged", null, null, elem[0]);
				$rootScope.$apply(function(){
					$rootScope.thisnode = elem[0];
				});
				e.stopPropagation();
			});
			scope.$on("blockStyleChanged", function(e, key, value){
				if (elem[0] !== $rootScope.thisnode)
					return;
					
				$(elem[0]).css(key, value);
				$rootScope.$broadcast("selectionStyleChanged", null, null, elem[0]);
			});
		},
		replace:true,
		template:"<video selectable ng-class='{selected:selected}'/>"
	};
}]);