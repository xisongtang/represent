function registerCreateDiv(elem, destroy, cond, createfunc, changefunc, mdfunc, endfunc){
	var begoffsetX = null, begoffsetY = null, thisnode = null;// indexZ = 0;
	var wrapper = $(elem.parentNode);
	elem = $(elem);
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
}

directives.directive('section', ['$compile','$rootScope', function($compile, scope){
	return {
		restrict: 'A',
		scope:{
			
		},
		link:function($scope, elem, attrs){
			$scope.x = $scope.$parent.x;
			$scope.y = $scope.$parent.y;
			var dragging = false, resizing = false, dragbegX, dragbegY, selected, element, range = 6;
			scope.draggable = false;
			scope.resizable = false;
			scope.resizeCorner = undefined;
			$(elem[0].parentNode).bind("mousemove", function(e){
				var endX, endY;
				if (!dragging && !resizing){
					if (scope.selected){
						selected = scope.selected;
						scope.$apply(function(){
							scope.draggable = false;
							scope.resizable = false;
							scope.resizeCorner = undefined;
						});
						for (var index = 0; index < selected.length; index++) {
							element = selected[index];
							var x = +element.style.left.slice(0, -2), y = +element.style.top.slice(0, -2), 
								width = +$(element).css("width").slice(0, -2), 
								height = +$(element).css("height").slice(0, -2), 
								curX = e.pageX - panelX,	curY = e.pageY - panelY;
							if (x - range < curX && x + range > curX && y - range < curY && y + range > curY){
								scope.resizable = true;
								scope.resizeCorner = "leftup";
								scope.$digest();
								break;
							}else if (x + width - range < curX && x + width + range > curX && y - range < curY && y + range > curY){
								scope.resizable = true;
								scope.resizeCorner = "rightup";
								scope.$digest();
								break;
							}else if (x + width - range < curX && x + width + range > curX && y + height - range < curY && y + height + range > curY){
								scope.resizable = true;
								scope.resizeCorner = "rightbottom";
								scope.$digest();
								break;
							}else if (x - range < curX && x + range > curX && y + height - range < curY && y + height + range > curY){
								scope.resizable = true;
								scope.resizeCorner = "leftbottom";
								scope.$digest();
								break;
							}else if ((element.tagName === 'IMG' || element.tagName === 'VIDEO' || element.tagName === 'AUDIO')&& 
								x - range < curX && x + width + range > curX && 
								y - range < curY && y + height + range > curY){
								scope.draggable= true;
								scope.$digest();
							}
							else if (x < curX && width + x > curX && y - range < curY && y + range > curY
								|| x < curX && width + x > curX && y + height - range < curY && y + height + range > curY
								|| x - range < curX && x + range > curX && y < curY && y + height > curY
								|| x + width - range < curX && x + width + range > curX && y < curY && y + height > curY){
								scope.draggable = true;
								scope.$digest();
								break;
							}
						}
					}
				} else {
					endX = e.pageX - panelX;
					endY = e.pageY - panelY;
					selected = scope.selected;
					for (var index = 0; index < selected.length; index++) {
						element = $(selected[index]);
						if (dragging){
							element.css("left", (+element.css("left").slice(0, -2)) + endX - dragbegX);
							element.css("top", (+element.css("top").slice(0, -2)) + endY - dragbegY);
						} else {
							if (scope.resizeCorner == "leftup"){
								element.css("left", (+element.css("left").slice(0, -2)) + endX - dragbegX);
								element.css("width", (+element.css("width").slice(0, -2)) - endX + dragbegX);
								element.css("top", (+element.css("top").slice(0, -2)) + endY - dragbegY);
								element.css("height", (+element.css("height").slice(0, -2)) - endY + dragbegY);
							} else if (scope.resizeCorner == "rightup"){
								element.css("width", (+element.css("width").slice(0, -2)) + endX - dragbegX);
								element.css("top", (+element.css("top").slice(0, -2)) + endY - dragbegY);
								element.css("height", (+element.css("height").slice(0, -2)) - endY + dragbegY);
							} else if (scope.resizeCorner == "rightbottom"){
								element.css("width", (+element.css("width").slice(0, -2)) + endX - dragbegX);
								element.css("height", (+element.css("height").slice(0, -2)) + endY - dragbegY);
							}	else if (scope.resizeCorner == "leftbottom"){
								element.css("left", (+element.css("left").slice(0, -2)) + endX - dragbegX);
								element.css("height", (+element.css("height").slice(0, -2)) + endY - dragbegY);
								element.css("width", (+element.css("width").slice(0, -2)) - endX + dragbegX);
							}
						}
					}
					dragbegX = endX;
					dragbegY = endY;
				}
			});
			
			//insertText Div
			registerCreateDiv(
				elem[0], false,
				function(){
					return scope.insertingText;
				},
				function(){
					var thisnode = $($compile('<div rep-editable></div>')(scope));
					scope.$apply();
					return thisnode;
				},
				null, null, 
				function(){
					scope.insertingText = false;
					scope.$broadcast("insertTextEnd");
				}
			);
			
			//selete helper Div
			registerCreateDiv(
				elem[0], true,
				function(){
					return !scope.insertingText && !scope.draggable && !scope.resizable;
				},
				function(){
					return $('<div class="select-helper"></div>');
				},
				function(thisnode, x, y, width, height){
					scope.$broadcast("selectRectangleChanged", x, y, width, height);
				},
				function(x, y){
					scope.$broadcast("selectRectangleChanged", x, y, 0, 0);
				}, null
			);
			
			$(elem[0].parentNode).bind("mousedown", function(e){
				if (!scope.draggable && !scope.resizable || scope.insertingText)
					return;
				if (scope.draggable)
					dragging = true;
				else if (scope.resizable)
					resizing = true;
				console.log(dragging, resizing);
				dragbegX = e.pageX - panelX;
				dragbegY = e.pageY - panelY;
			});
			
			$(elem[0].parentNode).bind("mouseup", function(e){
				if (dragging)
					dragging = false;
				else if (resizing)
					resizing = false;
			});
			
			scope.insertingText = false;
			scope.$on("insertText", function(){
				if ($scope.x == $scope.$parent.x && $scope.y == $scope.$parent.y)
					scope.insertingText = true;
			});
			scope.$on("insertImage", function(e, image){
				console.log("insertImage");
				if ($scope.x == $scope.$parent.x && $scope.y == $scope.$parent.y)
					$(elem).append($compile("<img rep-img src='" + image + "'/>")(scope));
			});
			scope.$on("insertVideo", function(e, video){
				console.log("insertVideo");
				if ($scope.x == $scope.$parent.x && $scope.y == $scope.$parent.y)
					$(elem).append($compile("<video rep-video src='" + video + "' controls></video>")(scope));
			});
			
			scope.$on("insertBackgroundMusic", function(e, music){
				console.log("insertBackgroundMusic");
				if ($scope.x == $scope.$parent.x && $scope.y == $scope.$parent.y){
					$(elem).find("audio").remove();
					$(elem).append("<audio autoplay src='" + music + "' controls style='display:none'></audio>");
				}
			});
			scope.$on("insertBackgroundColor", function(e, color){
				console.log("insertBackgroundColor");
				if ($scope.x == $scope.$parent.x && $scope.y == $scope.$parent.y){
					$(elem).css("background-color", color);	
				}
			});
			scope.$on("insertBackgroundImage", function(e, image){
				console.log("insertBackgroundImage");
				if ($scope.x == $scope.$parent.x && $scope.y == $scope.$parent.y)
					$(elem).css("background", "url(" + image + ") 0 0 /100% 100% no-repeat");
			});
		},
	};
}]);