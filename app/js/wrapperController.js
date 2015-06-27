/* global controllers */
controllers.controller("wrapperController", ['$rootScope', '$templateRequest','$timeout','$templateCache', '$scope', '$compile', 
	function($rootScope, $templateRequest, $timeout, $templateCache, $scope, $compile){
  $templateRequest("template/index.html");
	var transitionSpeed = "default", transition = "slide";
	$scope.x = 0;
	$scope.y = 0;
	$scope.panels = [[$("section")]];
	var changeAnimation = function(x, y){
		var temp, elem = $scope.panels[x][y];
		temp = elem.attr("data-transition")?elem.attr("data-transition"):"slide";
		$rootScope.$broadcast("animationStyleChanged", "singleAnimateType", temp);
		temp = elem.attr("data-transition-speed")?elem.attr("data-transition-speed"):"default";
		$rootScope.$broadcast("animationStyleChanged", "singleAnimateTime", temp);
	};
	
	//flag to tell whether y was changed by the change of x
	var flag = false;
	//when x is changed 
	$scope.$watch("x", function(nx, ox){
		if (nx === ox)
			return;
		$scope.panels[ox][$scope.y].css("display", "none");
		if (!$scope.panels[nx]){
			$scope.panels[nx] = [];
			console.log("compile");
			$scope.panels[nx][0] = $($compile($templateCache.get('section-template'))($scope));
			$(".rel-wrapper").append($scope.panels[nx][0]);
		}
		else 
			$scope.panels[nx][0].css("display", "block");
		changeAnimation(nx, 0);
		if ($scope.y != 0)
			flag = true;
		$timeout(function(){
			$scope.y = 0;
			$scope.$digest();
		});
	});
	//when y is changed 
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
			$(".rel-wrapper").append($scope.panels[$scope.x][ny]);
		}
		else
			$scope.panels[$scope.x][ny].css("display", "block");
		changeAnimation($scope.x, ny);
	});
	//save the presentation
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
		str = str.replace("<!-- transition -->", transition);
		str = str.replace("<!-- transitionSpeed -->", transitionSpeed);
		console.log(str);
		var newWindow = window.open();
		newWindow.document.write(str);
	};
	
	$scope.$on("animStyleChanged", function(e, name, value){
		if (name === "multiAnimateType"){
			transition = value;
			$rootScope.$broadcast("animationStyleChanged", name, value);
		} else if (name === "multiAnimateTime"){
			transitionSpeed = value;
			$rootScope.$broadcast("animationStyleChanged", name, value);
		}
	});
}]);