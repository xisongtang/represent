/* global controllers */
var a;
controllers.controller("wrapperController", ['$templateRequest','$timeout','$templateCache', '$scope', '$compile', 
	function($templateRequest, $timeout, $templateCache, $scope, $compile){
  $templateRequest("template/index.html");
	console.log("wrapperController");
	$scope.x = 0;
	$scope.y = 0;
	$scope.panels = [[$("section")]];
	a = $scope;
	var flag = false;
	$scope.$watch("x", function(nx, ox){
		if (nx === ox)
			return;
		$scope.panels[ox][$scope.y].css("display", "none");
		if (!$scope.panels[nx]){
			$scope.panels[nx] = [];
			console.log("compile");
			$scope.panels[nx][0] = $($compile($templateCache.get('section-template'))($scope));
			$(".section-wrapper").append($scope.panels[nx][0]);
		}
		else 
			$scope.panels[nx][0].css("display", "block");
		if ($scope.y != 0)
			flag = true;
		$timeout(function(){
			$scope.y = 0;
			$scope.$digest();
		});
	});
	$scope.$watch("y", function(ny, oy){
		if (flag){
			flag = false;
			return;
		}
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
	$scope.onSaveButtonClick = function(){
		var cont = $("<div>");
		var clearElem = function(elem){
			var ret = $(elem).clone();
			ret.removeAttr("section ng-class class");
			ret.children().removeAttr("ng-class rep-editable rep-img rep-video selectable class contenteditable");
			ret.css("display", "");
			return ret;
		};
		for (var $i = 0; $i < $scope.panels.length; $i++) {
			var col = $scope.panels[$i];
			if (col.length === 1)
				cont.append(clearElem(col[0]));
			else{
				var sec = $("<section>"); 
				for (var $j = 0; $j < col.length; $j++) {
					var elem = col[$j];
					sec.append(clearElem(elem));
				}
				cont.append(sec);
			}
		}
		var str = $templateCache.get("template/index.html")[1];
		str = str.replace("<!-- content -->", cont.html());
		console.log(str);
		var newWindow = window.open();
		newWindow.document.write(str);
	};
}]);