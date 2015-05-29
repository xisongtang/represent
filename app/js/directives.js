'use strict';
var directives = angular.module('directives', []);

directives.directive('repDropdown', function(){
	return {
		restrict: 'A',
		scope: {
			'attr':'=repDropdown'
		},
		link: function(scope, element, attrs){
		},
		replace:true,
		templateUrl: 'template/dropdown.html'
	};
});

directives.directive('repEditable', ['$rootScope', function($rootScope){
	
	var begoffset, endoffset, 
				begnode, endnode;
	
	var getElemsBetween = function(){
		var res, t, beg, end;
		if (begnode.childNodes[0].textContent.length > begoffset){
			begnode.childNodes[0].splitText(begoffset);
			t = "<span>" + $(begnode.childNodes[0]).remove().text() + "</span>";
			$(begnode).before(t);
		}
		if (endnode.childNodes[0].textContent.length > endoffset){
			endnode.childNodes[0].splitText(endoffset);
			t = "<span>" + $(endnode.childNodes[1]).remove().text() + "</span>";
			$(endnode).after(t);
		}
		res = $(begnode).parent().parent().find("span");
		beg = res.index(begnode);
		end = res.index(endnode);
		return res.slice(beg, end + 1);	
	};
	
	$rootScope.thisnode = null;
	
	$('.panel-wrapper').bind('mousedown', function(e){
		e = e.originalEvent;
		//console.log(e);
		for (var i = e.path.length - 1; i >= 0; --i){
			if (e.path[i].className === "editablediv"){
				$rootScope.thisnode = e.path[i];
				return;			
			} 
		}
		$rootScope.thisnode = null;
	});
	
	$(document).bind('keyup mouseup', function(e){
		var thisnode = $rootScope.thisnode;
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
				ind0 = offset0;
				offset0 = 0;
			}
			else
				ind0 = pnode0.children().index(node0);
			if (node1[0].nodeName === 'P'){
				pnode1 = node1;
				ind1 = offset1;
				offset1 = 0;
			}
			else
				ind1 = pnode1.children().index(node1); 
			
			pind0 = panel.children().index(pnode0); 
			pind1 = panel.children().index(pnode1); 
			console.log(offset0 + ":" + ind0 + ":" + pind0); 
			console.log(offset1 + ":" + ind1 + ":" + pind1);
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
		}, 200);
	});
	
	$rootScope.$watch('thisnode', function(newValue, oldValue){
		$rootScope.$broadcast("selectionStyleChanged", $rootScope.thisnode);
	});
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			scope.$on("fontStyleChanged", function(e, key, value){
				console.log($rootScope.thisnode);
				console.log(element[0]);
				if (element[0] !== $rootScope.thisnode)
					return;
				
				console.log("fontStyleChanged");
				getElemsBetween().css(key, value);
				$rootScope.$broadcast("selectionStyleChanged", $rootScope.thisnode);
			});
			scope.$on("paraStyleChanged", function(e, key, value){
				if (element[0] !== $rootScope.thisnode)
					return;
					
				console.log("paraStyleChanged")
				$($rootScope.thisnode).css(key, value);
				$rootScope.$broadcast("selectionStyleChanged", $rootScope.thisnode);
			});
		},
		replace:true,
		template:'<div id="panel" contenteditable="true" class="editablediv"><p><scan>&#8203;</scan></p></div>'
	};
}]);