directives.directive('repEditable', ['$rootScope', function($rootScope){
	
	var begoffset, endoffset, 
				begnode, endnode;
	
	var getElemsBetween = function(){
		var res, t, beg, end;
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
	
	$('.section-wrapper, section').bind('mousedown', function(e){
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
				section = $(editdiv), ind0, pind0, ind1, pind1;
			
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
			
			pind0 = section.children().index(pnode0); 
			pind1 = section.children().index(pnode1); 
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
		$rootScope.$broadcast("selectionStyleChanged", begnode, begnode?begnode.parentNode:null, begnode?begnode.parentNode.parentNode:null);
	});
	$rootScope.$watch('thisnode', function(newValue, oldValue){
		$rootScope.$broadcast("thisnodeChanged", newValue);
	});
	return {
		restrict: 'A',
		transclude: true,
		scope:{
			
		},
		link: function(scope, element, attrs){
			console.log("repEditable");
			thisnode = element[0];
			$rootScope.$apply(function(){
				$rootScope.thisnode = element[0];
			});
			scope.current = true;
			scope.selected = false;
			scope.$on('thisnodeChanged', function(e, thisnode){
				scope.current = element[0] === thisnode;
			});
			$(element[0]).bind('mousedown', function(e){
				if ($rootScope.draggable || $rootScope.resizable){
					e.preventDefault();
					return ;
				}
				var ee = e.originalEvent;
				thisnode = element[0];
				$rootScope.selected = $(thisnode);
				$rootScope.$broadcast("selectedEditablesChanged");
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
			scope.$on("blockStyleChanged", function(e, key, value){
				if (element[0] !== thisnode)
					return;
					
				$(begnode).parent().parent().css(key, value);
				$rootScope.$broadcast("selectionStyleChanged", begnode, begnode?begnode.parentNode:null, begnode?begnode.parentNode.parentNode:null);
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
		template:'<div selectable contenteditable="true" class="editablediv" ng-class="{selected:selected, chosen:current}"><p><scan>&#8203;</scan></p></div>'
	};
}]);