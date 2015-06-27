/* global controllers */
var a;
controllers.controller("wrapperController", ['$timeout','$templateCache', '$scope', '$compile', 
	function($timeout, $templateCache, $scope, $compile){
	console.log("wrapperController");
	$scope.x = 0;
	$scope.y = 0;
	$scope.panels = [[$("section")]];
	a = $scope;
	$scope.$watch("x", function(nx, ox){
		if (nx === ox)
			return;
		$scope.panels[ox][$scope.y].css("display", "none");
		if (!$scope.panels[nx]){
			$scope.panels[nx] = [];
			console.log("compile");
			$scope.panels[nx][0] = $($compile($templateCache.get('section-template'))($scope));
			$(".section-wrapper").append($scope.panels[nx][0]);
			$timeout(function(){$scope.y = 0;});
		}
		else 
			$scope.panels[nx][0].css("display", "block");
		console.log("append");
	});
	$scope.$watch("y", function(ny, oy){
	if (ny == oy)
		return;
		$scope.panels[$scope.x][oy].css("display", "none");
		if (!$scope.panels[$scope.x][ny]){
			$scope.panels[$scope.x][ny] = $($compile($templateCache.get('section-template'))($scope));
			$(".section-wrapper").append($scope.panels[$scope.x][ny]);
		}
		else
			$scope.panels[$scope.x][ny].css("display", "block");
	});
}]);