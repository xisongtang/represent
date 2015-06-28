function registerCreateDiv(destroy, cond, createfunc, changefunc, mdfunc, endfunc){
	var begoffsetX = null, begoffsetY = null, thisnode = null, elem = null;// indexZ = 0;
	var wrapper = $(".rel-wrapper");
	wrapper.bind('mousedown', function(e){
		if (!cond())
			return true;
		begoffsetX = e.pageX - panelX;
		begoffsetY = e.pageY - panelY;
		if (!!mdfunc)
			mdfunc(begoffsetX, begoffsetY);
	});
	
	wrapper.bind('mousemove', function(e){
		e.originalEvent.stopPropagation();
		if (begoffsetX === null || begoffsetY === null){
			return false;
		}
		var startX, startY, width, height, endX, endY;
		
		endX = e.pageX - panelX;
		endY = e.pageY - panelY;
		if (Math.abs(endX - begoffsetX) < 2 || Math.abs(endY - begoffsetY) < 2 ){
			if (thisnode !== null){
				thisnode.remove();
				thisnode = null;
			}
			return;
		}
		startX = endX < begoffsetX ? endX : begoffsetX;
		startY = endY < begoffsetY ? endY : begoffsetY;
		width = Math.abs(endX - begoffsetX);
		height = Math.abs(endY - begoffsetY);
		if (!thisnode){
			thisnode = $(createfunc());
			elem.append(thisnode);
		}
		thisnode.css("top", startY.toString() + "px");
		thisnode.css("left", startX.toString() + "px");
		thisnode.css("height", height.toString() + "px");
		thisnode.css("width", width.toString() + "px");
		if (!!changefunc)
			changefunc(thisnode, startX, startY, width, height);
	});
	
	wrapper.bind('mouseup',function(e){
		if (begoffsetX === null)
			return;
		if (!destroy)
			thisnode = null;
		else if (!!thisnode){
			thisnode.remove();
		}
		begoffsetX = null;
		begoffsetY = null;
		if (!!endfunc)
			endfunc();
	});
	var funcs = {};
	funcs.changeElem = function(e){
		elem = e;
	};
	return funcs;
};

controllers.controller("wrapperController", ['$rootScope', '$templateRequest','$timeout','$templateCache', '$scope', '$compile', 
	function($rootScope, $templateRequest, $timeout, $templateCache, $scope, $compile){
  $templateRequest("template/index.html");
	var transitionSpeed = "default", transition = "slide", helperfuncs, insertfuncs;
	$scope.x = 0;
	$scope.y = 0;
	$scope.panels = [[$("section")]];
	$scope.audio = "#";
	
	$scope.$on("insertBackgroundMusic", function(e, music){
		$scope.audio = music;
	});
	//broadcast that the panel has changed
	var changeAnimation = function(x, y){
		var temp, elem = $scope.panels[x][y];
		temp = elem.attr("data-transition")?elem.attr("data-transition"):"slide";
		$rootScope.$broadcast("animationStyleChanged", "singleAnimateType", temp);
		temp = elem.attr("data-transition-speed")?elem.attr("data-transition-speed"):"default";
		$rootScope.$broadcast("animationStyleChanged", "singleAnimateTime", temp);
		temp = elem.attr("data-background-audio");
		$scope.audio = temp? temp: "#";
		console.log($scope.audio);
	};
	
	//flag to tell whether y was changed by the change of x
	var flag = false, lock = false;
	//when x is changed 
	$scope.$watch("x", function(nx, ox){
		var left, startLeft;
		if (nx === ox)
			return;
		if (nx > ox){
			left = "-50%";
			startLeft = "50%";
		}else{
			left = "50%";
			startLeft = "-50%";
		}
		lock = true;		
		$scope.panels[ox][$scope.y].animate({
			left:left,
			opacity:0.5
		}, "fast", function(){
			$scope.panels[ox][$scope.y].css("display", "none");
			if (!$scope.panels[nx]){
				$scope.panels[nx] = [];
				console.log("compile");
				$scope.panels[nx][0] = $($compile($templateCache.get('section-template'))($scope));
				$scope.panels[nx][0].attr("style", $scope.panels[ox][$scope.y].attr("style"));
				$(".rel-wrapper").append($scope.panels[nx][0]);
			}
			$scope.panels[nx][0].css("left", startLeft);
			$scope.panels[nx][0].css("opacity", "0");
			$scope.panels[nx][0].css("top", "0");
			$scope.panels[nx][0].css("display", "block");
			helperfuncs.changeElem($scope.panels[nx][0]);
			insertfuncs.changeElem($scope.panels[nx][0]);
			$scope.panels[nx][0].animate({
				left:0,
				opacity:1
			}, "fast", function(){lock = false;}
			);
			changeAnimation(nx, 0);
			if ($scope.y != 0)
				flag = true;
			$timeout(function(){
				$scope.y = 0;
				$scope.$digest();
			});
		});
			
		
	});
	//when y is changed 
	$scope.$watch("y", function(ny, oy){
		var top, startTop;
		if (flag){
			flag = false;
			return;
		}
		if (ny == oy)
			return;
			
		if (ny > oy){
			top = "-50%";
			startTop = "50%";
		}else{
			top = "50%";
			startTop = "-50%";
		}
		lock = true;
		$scope.panels[$scope.x][oy].animate({
			top:top,
			opacity:0
		}, "fast", function(){
			$scope.panels[$scope.x][oy].css("display", "none");
			if (!$scope.panels[$scope.x][ny]){
				$scope.panels[$scope.x][ny] = $($compile($templateCache.get('section-template'))($scope));
				$scope.panels[$scope.x][ny].attr("style", $scope.panels[$scope.x][oy].attr("style"));
				$(".rel-wrapper").append($scope.panels[$scope.x][ny]);
			}
			$scope.panels[$scope.x][ny].css("top", startTop);
			$scope.panels[$scope.x][ny].css("opacity", "0");
			$scope.panels[$scope.x][ny].css("left", "0");
			$scope.panels[$scope.x][ny].css("display", "block");
			helperfuncs.changeElem($scope.panels[$scope.x][ny]);
			insertfuncs.changeElem($scope.panels[$scope.x][ny]);
			$scope.panels[$scope.x][ny].animate({
				top:0,
				opacity:1
			}, "fast", function(){lock = false;}
			);
			changeAnimation($scope.x, ny);
		});
	});
	
	//insertText Div
	insertfuncs = registerCreateDiv(
		false,
		function(){
			return $rootScope.insertingText;
		},
		function(){
			var thisnode = $($compile('<div rep-editable></div>')($scope));
			return thisnode;
		},
		null, null, 
		function(){
			$rootScope.insertingText = false;
			$rootScope.$broadcast("insertTextEnd");
		}
	);
	insertfuncs.changeElem($scope.panels[0][0]);
	
	//selete helper Div
	helperfuncs = registerCreateDiv(
		true,
		function(){
			return !$rootScope.insertingText && !$rootScope.draggable && !$rootScope.resizable;
		},
		function(){
			return $('<div class="select-helper"></div>');
		},
		function(thisnode, x, y, width, height){
			$rootScope.$broadcast("selectRectangleChanged", x, y, width, height);
		},
		function(x, y){
			$rootScope.$broadcast("selectRectangleChanged", x, y, 0, 0);
		}, null
	);
	helperfuncs.changeElem($scope.panels[0][0]);
	
	//buttonClickActions
	$scope.leftButton = function(){
		if (lock)
			return;
		$scope.x -= 1;
	};
	$scope.rightButton = function(){
		if (lock)
			return;
		$scope.x += 1;
	};
	$scope.upButton = function(){
		if (lock)
			return;
		$scope.y -= 1;
	};
	$scope.downButton = function(){
		if (lock)
			return;
		$scope.y += 1;
	};
	//preview the presentation
	$scope.onPreviewButtonClick = function(){
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