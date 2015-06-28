directives.directive('section', ['$compile','$rootScope', function($compile, scope){
	var dragging = false, resizing = false, dragbegX, dragbegY, selected, element, range = 6;
	scope.draggable = false;
	scope.resizable = false;
	scope.resizeCorner = undefined;
	$(".rel-wrapper").bind("mousemove", function(e){
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
	$(".rel-wrapper").bind("mousedown", function(e){
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
			
	$(".rel-wrapper").bind("mouseup", function(e){
		if (dragging)
			dragging = false;
		else if (resizing)
			resizing = false;
	});
	$(document).bind("keydown", function(e){
		//console.log(scope.thisnode);
		if (scope.thisnode && e.keyCode === 46){
			$(scope.thisnode).remove();
			scope.thisnode = null;
			scope.$digest();
		}
	});
	return {
		restrict: 'A',
		scope:true,
		link:function($scope, elem, attrs){
			$scope.lx = $scope.$parent.x;
			$scope.ly = $scope.$parent.y;
			scope.insertingText = false;
			scope.$on("insertText", function(){
				if ($scope.lx == $scope.$parent.x && $scope.ly == $scope.$parent.y)
					scope.insertingText = true;
			});
			scope.$on("insertImage", function(e, image){
				console.log("insertImage");
				if ($scope.lx == $scope.$parent.x && $scope.ly == $scope.$parent.y){
					$(elem).append($compile("<img rep-img src='" + image + "'/>")(scope));
					scope.$broadcast("insertEnd", "image");
				}
			});
			scope.$on("insertVideo", function(e, video){
				console.log("insertVideo");
				if ($scope.lx == $scope.$parent.x && $scope.ly == $scope.$parent.y){
					$(elem).append($compile("<video rep-video src='" + video + "' controls></video>")(scope));
					scope.$broadcast("insertEnd", "video");
				}	
			});
			
			scope.$on("insertBackgroundMusic", function(e, music){
				console.log("insertBackgroundMusic");
				if ($scope.lx == $scope.$parent.x && $scope.ly == $scope.$parent.y){
					$(elem).attr("data-background-audio", music);
					scope.$broadcast("insertEnd", "bgmusic");
				}
			});
			scope.$on("insertBackgroundColor", function(e, color){
				console.log("insertBackgroundColor");
				if ($scope.lx == $scope.$parent.x && $scope.ly == $scope.$parent.y){
					$(elem).css("background-color", color);	
					scope.$broadcast("insertEnd", "bgcolor");
				}
			});
			scope.$on("insertBackgroundImage", function(e, image){
				console.log("insertBackgroundImage");
				if ($scope.lx == $scope.$parent.x && $scope.ly == $scope.$parent.y)
					$(elem).css("background", "url(" + image + ") 0 0 /100% 100% no-repeat");
					scope.$broadcast("insertEnd", "bgimage");
			});
			scope.$on("animStyleChanged", function(e, name, value){
				if ($scope.lx == $scope.$parent.x && $scope.ly == $scope.$parent.y){
					if (name === "singleAnimateType"){
						$(elem).attr("data-transition", value);
						scope.$broadcast("animationStyleChanged", name, value);
					} else if (name === "singleAnimateTime"){
						$(elem).attr("data-transition-speed", value);
						scope.$broadcast("animationStyleChanged", name, value);
					}
				}
			});
		},
	};
}]);