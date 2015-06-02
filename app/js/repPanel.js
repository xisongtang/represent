
directives.directive('panel', ['$compile', function($compile){
	return {
		restrict: 'E',
		link:function(scope, elem, attrs){
			var dragging = false, dragbegX, dragbegY, selected, element;
			scope.draggable = false;
			$(elem).bind("mousemove", function(e){
				var endX, endY;
				if (!dragging){
					if (scope.selected){
						console.log("draggable");
						selected = scope.selected;
						scope.$apply(function(){
							scope.draggable = false;
						});
						for (var index = 0; index < selected.length; index++) {
							element = selected[index];
							var x = +element.style.left.slice(0, -2), y = +element.style.top.slice(0, -2), width = +element.style.width.slice(0, -2), 
								height = +element.style.height.slice(0, -2), curX = e.pageX - panelX,	curY = e.pageY - panelY;
							if (x < curX && width + x > curX && y - 4 < curY && y + 4 > curY
								|| x < curX && width + x > curX && y + height - 4 < curY && y + height + 4 > curY
								|| x - 4 < curX && x + 4 > curX && y < curY && y + height > curY
								|| x + width - 4 < curX && x + width + 4 > curX && y < curY && y + height > curY){
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
						element.css("left", (+element.css("left").slice(0, -2)) + endX - dragbegX);
						element.css("top", (+element.css("top").slice(0, -2)) + endY - dragbegY);
					}
					dragbegX = endX;
					dragbegY = endY;
				}
			});
			
			$(elem).bind("mousedown", function(e){
				if (!scope.draggable || scope.insertingText)
					return;
				dragging = true;
				dragbegX = e.pageX - panelX;
				dragbegY = e.pageY - panelY;
			});
			
			$(elem).bind("mouseup", function(e){
				if (!dragging)
					return;
				dragging = false;
			});
			
			registerCreateDiv(
				elem[0], false,
				function(){
					return scope.insertingText;
				},
				function(){
					var thisnode = $($compile('<div rep-editable></div>')(scope));
					scope.$apply();
					return thisnode;
				}
			);
			
			registerCreateDiv(
				elem[0], true,
				function(){
					return !scope.insertingText && !scope.draggable;
				},
				function(){
					return $('<div class="select-helper"></div>');
				},
				function(thisnode, x, y, width, height){
					scope.$broadcast("selectRectangleChanged", x, y, width, height);
				},
				function(x, y){
					scope.$broadcast("selectRectangleChanged", x, y, 0, 0);
				}
			);
			
			function registerCreateDiv(elem, destroy, cond, createfunc, changefunc, mdfunc){
				var begoffsetX = null, begoffsetY = null, thisnode = null;// indexZ = 0;
				
				elem = $(elem);
				elem.bind('mousedown', function(e){
					if (!cond())
						return false;
					begoffsetX = e.offsetX;
					begoffsetY = e.offsetY; 
					if (!!mdfunc)
						mdfunc(begoffsetX, begoffsetY);
				});
				
				elem.bind('mousemove', function(e){
					e.originalEvent.stopPropagation();
					if (begoffsetX === null || begoffsetY === null)
						return;
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
				
				elem.bind('mouseup',function(e){
					if (begoffsetX === null)
						return;
					scope.insertingText = false;
					if (!destroy)
						thisnode = null;
					else if (!!thisnode){
						thisnode.remove();
					}
					begoffsetX = null;
					begoffsetY = null;
					scope.$broadcast("insertTextEnd");
				});
			}
			
			scope.insertingText = false;
			scope.$on("insertText", function(){
				scope.insertingText = true;
			});
		}
	};
}]);