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


directives.directive('repEditable', ['$rootScope', function($rootScope){
	
	var begoffset, endoffset, 
				begnode, endnode;
	
	var getElemsBetween = function(){
		var res, t, beg, end, sel = window.getSelection();
		if (begnode === endnode && begoffset === endoffset){
//			begnode.childNodes[0].splitText(begoffset);
//			t = "<span>" + $(begnode.childNodes[0]).remove().text() + "</span>";
//			$(begnode).before(t);
//			$(begnode.childNodes[0]).before("&#8203;");
//			t = "<span>" + $(begnode.childNodes[1]).remove().text() + "</span>";
//			$(begnode).after(t);
//			var range = sel.getRangeAt(0);
//			range.setStart(begnode.childNodes[0], 0);
//			range.setEnd(begnode.childNodes[0], 0);
//			sel.removeAllRanges();
//			sel.addRange(range);
			return $();
		}
		if (begnode.childNodes[0].textContent.length > begoffset && begoffset != 0){
			if (begnode === endnode)
				endoffset -= begoffset;
			begnode.childNodes[0].splitText(begoffset);
			t = $(begnode).clone(true).text($(begnode.childNodes[0]).remove().text());
			$(begnode).before(t);
		}
		if (endnode.childNodes[0].textContent.length > endoffset){
			endnode.childNodes[0].splitText(endoffset);
			t = $(endnode).clone(true).text($(endnode.childNodes[1]).remove().text());
			$(endnode).after(t);
		}
		res = $(begnode).parent().parent().find("span");
		beg = res.index(begnode);
		end = res.index(endnode);
		return res.slice(beg, end + 1);	
	};
	
	var getParasBetween = function(){
		var beg, end, res;
		res = $(begnode).parent().parent().find("p");
		beg = res.index(begnode.parentNode);
		end = res.index(endnode.parentNode);
		return res.slice(beg, end + 1);
	};
	var thisnode = null;
	
	$('.panel-wrapper, panel').bind('mousedown', function(e){
		thisnode = null;
		begnode = endnode = null;
		$rootScope.$apply(function(){
			$rootScope.begnode = begnode;
			$rootScope.thisnode = thisnode;
		});
	});
	
	$(document).bind('keyup mouseup', function(e){
		if (thisnode == null)
			return ;
		var editdiv = thisnode, sel = window.getSelection(), hashmul = 1000;//the value to multiply for hash
		if ( $(thisnode).find("span").length === 0 ){
			var range, sp;
			try{
				range = sel.getRangeAt(0);
			}catch(e){
				return;
			}
			sp = $("<p><span>&#8203;</span></p>")[0];
			$(thisnode).empty();
			range.insertNode(sp);
			range.setStart(sp.childNodes[0], 0);
			range.setEnd(sp.childNodes[0], 0);
			sel.removeAllRanges();
			sel.addRange(range);
		}
		setTimeout(function(){
			var offset0 = sel.anchorOffset,	node0 = $(sel.anchorNode).parent(), pnode0 = node0.parent(),
				offset1 = sel.focusOffset, node1 = $(sel.focusNode).parent(), pnode1 = node1.parent(), 
				panel = $(editdiv), ind0, pind0, ind1, pind1;
			
			if (sel.anchorNode.nodeName == 'P'){
				node0 = pnode0 = $(sel.anchorNode);
			}
			if (sel.focusNode.nodeName == 'P'){
				node1 = pnode1 = $(sel.focusNode);
			}
			
			if (node0[0].nodeName === 'P'){
				pnode0 = node0;
				node0 = $(sel.anchorNode);
				offset0 = 0;
			}
			ind0 = pnode0.children().index(node0);
			if (node1[0].nodeName === 'P'){
				pnode1 = node1;
				node1 = $(sel.focusNode);
				offset1 = 0;
			}
			ind1 = pnode1.children().index(node1); 
			
			pind0 = panel.children().index(pnode0); 
			pind1 = panel.children().index(pnode1); 
			if (pind0 * hashmul * hashmul + ind0 * hashmul + offset0
				<= pind1 * hashmul * hashmul + ind1 * hashmul + offset1){
				begnode = pnode0.children()[ind0];
				endnode = pnode1.children()[ind1];
				begoffset = offset0;
				endoffset = offset1;
			}
			else {
				begnode = pnode1.children()[ind1];
				endnode = pnode0.children()[ind0];
				begoffset = offset1;
				endoffset = offset0;
			}
			$rootScope.$apply(function(){
				$rootScope.begnode = begnode;
			});
		}, 200);
	});
	
	$rootScope.$watch('begnode', function(newValue, oldValue){
		$rootScope.$broadcast("selectionStyleChanged", begnode, begnode?begnode.parentNode:null);
	});
	$rootScope.$watch('thisnode', function(newValue, oldValue){
		$rootScope.$broadcast("_thisnodeChanged", newValue);
	});
	$rootScope.selected = $([]);
	return {
		restrict: 'A',
		scope:{
			
		},
		link: function(scope, element, attrs){
			thisnode = element[0];
			$rootScope.$apply(function(){
				$rootScope.thisnode = element[0];
			});
			scope.current = true;
			scope.selected = false;
			scope.$on('_thisnodeChanged', function(e, thisnode){
				scope.current = element[0] === thisnode;
			});
			$(element[0]).bind('mousedown', function(e){
				var ee = e.originalEvent;
				thisnode = element[0];
				$rootScope.$apply(function(){
					$rootScope.thisnode = element[0];
				});
				ee.stopPropagation();
			});
			scope.$on("fontStyleChanged", function(e, key, value){
				if (element[0] !== thisnode)
					return;
				getElemsBetween().css(key, value);
				$rootScope.$broadcast("selectionStyleChanged", begnode, begnode?begnode.parentNode:null);
			});
			scope.$on("paraStyleChanged", function(e, key, value){
				if (element[0] !== thisnode)
					return;
					
				getParasBetween().css(key, value);
				$rootScope.$broadcast("selectionStyleChanged", begnode, begnode?begnode.parentNode:null);
			});
			scope.$on("clearStyle", function(e){
				if (element[0] !== thisnode)
					return;
					
				var elems = getElemsBetween();
				for (var i = elems.length - 1; i >= 0; --i)
					for (var key in elems[i].style)
						elems[i].style[key] = "";
				$rootScope.$broadcast("selectionStyleChanged", begnode, begnode?begnode.parentNode:null);
			});
			scope.$on("changeFontSize", function(e, isLarger){
				if (element[0] !== thisnode)
					return;
					
				var elems = getElemsBetween();
				if (isLarger && elems.length > 0)
					elems.css('font-size', Math.ceil(elems.css('font-size').slice(0,-2) * 1.1));
				else
					elems.css('font-size', Math.ceil(elems.css('font-size').slice(0,-2) * 0.9));
				$rootScope.$broadcast("selectionStyleChanged", begnode, begnode?begnode.parentNode:null);
			});
		},
		replace:true,
		template:'<div selectable contenteditable="true" class="editablediv" ng-class="{chosen:current, selected:selected}"><p><scan>&#8203;</scan></p></div>'
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

directives.directive('panel', ['$compile', function($compile){
	return {
		restrict: 'E',
		link:function(scope, elem, attrs){
			var draggable, dragging = false, dragbegX, dragbegY ;
			$(elem).bind("mousemove", function(e){
				var endX, endY;
				if (!dragging){
					if (scope.selected){
						var selected = scope.selected;
						draggable = false;
						for (var index = 0; index < selected.length; index++) {
							var element = selected[index], x = +element.style.left.slice(0, -2), y = +element.style.top.slice(0, -2), 
								width = +element.style.width.slice(0, -2), height = +element.style.height.slice(0, -2), curX = e.pageX - panelX,
								curY = e.pageY - panelY;
							if (x < curX && width + x > curX && y - 4 < curY && y + 4 > curY
								|| x < curX && width + x > curX && y + height - 4 < curY && y + height + 4 > curY
								|| x - 4 < curX && x + 4 > curX && y < curY && y + height > curY
								|| x + width - 4 < curX && x + width + 4 > curX && y < curY && y + height > curY){
								draggable = true;
								break;
							}
						}
					}
				} else {
					endX = e.pageX - panelX;
					endY = e.pageY - panelY;
					var selected = scope.selected;
					for (var index = 0; index < selected.length; index++) {
						var element = $(selected[index]);
						element.css("left", (+element.css("left").slice(0, -2)) + endX - dragbegX);
						element.css("top", (+element.css("top").slice(0, -2)) + endY - dragbegY);
					}
					dragbegX = endX;
					dragbegY = endY;
				}
			});
			
			$(elem).bind("mousedown", function(e){
				if (!draggable || scope.insertingText)
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
					console.log("Eee");
					var thisnode = $($compile('<div rep-editable></div>')(scope));
					console.log("Eee12");
					scope.$apply();
					return thisnode;
				}
			);
			
			registerCreateDiv(
				elem[0], true,
				function(){
					return !scope.insertingText && !draggable;
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

directives.directive('selectable', ['$rootScope', function($rootScope){
	return {
		restrict:"A",
		link:function(scope, element, attr){
			scope.$on("selectRectangleChanged", function(e, left, top, width, height){
				var elem = $(element[0]);
				var y = +elem.css("top").slice(0, -2), x = +elem.css("left").slice(0, -2),
					h = +elem.css("height").slice(0, -2), w = +elem.css("width").slice(0, -2), ind = $rootScope.selected.index(elem);
				if (y >= top && x >= left && height + top >= y + h && width + left >= w + x){
					if (ind === -1)
						$rootScope.selected.push(elem[0]);
				}
				else {
					if (ind !== -1)
						$rootScope.selected.splice(ind, 1);
				}
				ind = $rootScope.selected.index(elem);
				scope.$apply(function(){
						scope.selected = ind !== -1;
				});
			});
		}
	}
}]);

directives.directive('draggable', ['$rootScope', function($rootScope){
	
}]);