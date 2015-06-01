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
			}
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
	
	$('.panel-wrapper').bind('mousedown', function(e){
		e = e.originalEvent;
		for (var i = e.path.length - 1; i >= 0; --i){
			if (e.path[i].className === "editablediv"){
				thisnode = e.path[i];
				return;			
			} 
		}
		thisnode = null;
		begnode = endnode = null;
		$rootScope.$digest();
	});
	
	$(document).bind('keyup mouseup', function(e){
		if (thisnode == null)
			return ;
		var editdiv = thisnode, sel = window.getSelection(), hashmul = 1000;//the value to multiply for hash
		if ( $(thisnode).find("span").length === 0 ){
			$(thisnode).empty();
			var range = sel.getRangeAt(0), sp = $("<p><span>&#8203;</span></p>")[0];
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
			$rootScope.begnode = begnode;
			$rootScope.$digest();
		}, 200);
	});
	
	$rootScope.$watch('begnode', function(newValue, oldValue){
		$rootScope.$broadcast("selectionStyleChanged", begnode, begnode?begnode.parentNode:null);
	});
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
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
		template:'<div id="panel" contenteditable="true" class="editablediv"><p><scan>&#8203;</scan></p></div>'
	};
}]);

directives.directive('repButton', ['$rootScope', function($rootScope){
	return {
		restrict: 'A',
		link: function(scope, elem, attrs){
			elem.on('mousedown mousemove', function(e){
				e.preventDefault();
			});
		}
	};
}]);