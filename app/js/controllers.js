/// <reference path="../../typings/angularjs/angular.d.ts"/>
'use strick';

var controllers = angular.module('controllers', []);
var a;
controllers.controller('toolController', ['$scope', '$rootScope', function($scope, $rootScope){
	a = $scope;
	$scope.fontFamily = {
		'css' : 'font-family',
		'fixed' : false,
		'button' : false,
		'title': 'Helvetica Neue',
		'chosen': 'Helvetica Neue',
		'default': 'Helvetica Neue',
		'items': ['黑体', '宋体', '楷体', '微软雅黑', 'Helvetica Neue']		
	};
	$scope.fontSize = {
		'css' : 'font-size',
		'fixed' : false,
		'button' : false,
		'title': '18px',
		'chosen': '18px',
		'default': '18px',
		'items': ['18px', '20px', '22px', '24px', '26px', '28px']
	};
//	$scope.listType = {
//		'fixed' : true,
//		'button' : true,
//		'title': 'show-thumbnails-with-lines',
//		'chosen': '',
//		'items': ['无序列表', '有序列表']
//	};
	$scope.lineHeight = {
		'css' : 'line-height',
		'fixed' : true,
		'button' : true,
		'title': 'text-height',
		'chosen': '1',
		'default': '1',
		'items': ['1', '1.5', '2', '2.5', '3']
	};
	$scope.letterSpace = {
		'css' : 'letter-spacing',
		'fixed' : true,
		'button' : true,
		'title' : 'text-width',
		'chosen' : '0px',
		'default': '0px',
		'items' : ['0px', '1px', '2px', '3px', '4px', '5px']
	};
	$scope.singleAnimateType = {
		'css': 'singleAnimateType',
		'fixed' : true,
		'button' : false,
		'title' : '动画效果',
		'chosen' : 'slide',
		'default' : 'slide',
		'items' : ['fade', 'slide', 'convex', 'zoom', 'concave', 'default']
	}
	$scope.singleAnimateTime = {
		'css': 'singleAnimateTime',
		'fixed' : true,
		'button' : false,
		'title' : '动画时间',
		'chosen' : 'default',
		'default' : 'default',
		'items' : ['slow', 'default', 'fast']
	}
	$scope.multiAnimateType = {
		'css': 'multiAnimateType',
		'fixed' : true,
		'button' : false,
		'title' : '动画效果',
		'chosen' : 'slide',
		'default' : 'slide',
		'items' : ['fade', 'slide', 'convex', 'zoom', 'concave', 'default']
	};
	$scope.multiAnimateTime = {
		'css': 'multiAnimateTime',
		'fixed' : true,
		'button' : false,
		'title' : '动画时间',
		'chosen' : 'default',
		'default' : 'default',
		'items' : ['slow', 'default', 'fast']
	};
	$scope.bold = {'css':'font-weight','current':false, 'target':'bold', 'intarget':'normal', func:''};
	$scope.italic = {'css':'font-style', 'current':false, 'target':'italic', 'intarget':'normal'};
	$scope.underline = {'current':false, 'target':'underline', 'css':'text-decoration', 'intarget':'none'};
	$scope.linethrough = {'current':false, 'target':'line-through', 'css':'text-decoration', 'intarget':'none'};
	$scope.superscript = {'current':false, 'target':'super', 'css':'vertical-align', 'intarget':'baseline'};
	$scope.subscript = {'current':false, 'target':'sub', 'css':'vertical-align', 'intarget':'baseline'};
	$scope.color = {'current':'black', 'css':'color', 'target':''};
	$scope.backgroundColor = {'current':"white", 'css':'background-color', 'target':''};
	
	$scope.textAlignLeft = {'current':true,'target':"left", 'css':'text-align', 'intarget':'left'};
	$scope.textAlignRight = {'current':false,'target':"right", 'css':'text-align', 'intarget':'right'};
	$scope.textAlignCenter = {'current':false,'target':"center", 'css':'text-align', 'intarget':'center'};
	$scope.textAlignJustify = {'current':false,'target':"justify", 'css':'text-align', 'intarget':'center'};
	$scope.textIndent = {'current':false, 'target':'2em', 'css':'text-indent', 'intarget':'0'};
	
	$scope.bgcolor = {'current':'white', 'target':'', 'css':'background'};
	//$scope.bdcolor = {'current':'rgba(0,0,0,0)', 'target':'', 'css':'border-color'};
	$scope.zindex = {'current': 0, 'target':'', 'css':'z-index'};
	$scope.$on("selectionStyleChanged", function(e, node, thisnode, blocknode){
		var temp;
		if (!!node){
			$scope.bold.current = angular.element(node).css($scope.bold.css) == $scope.bold.target;
			$scope.italic.current = angular.element(node).css($scope.italic.css) == $scope.italic.target;
			$scope.underline.current = angular.element(node).css($scope.underline.css) == $scope.underline.target;
			$scope.linethrough.current = angular.element(node).css($scope.linethrough.css) == $scope.linethrough.target;
			$scope.superscript.current = angular.element(node).css($scope.superscript.css) == $scope.superscript.target;
			$scope.subscript.current = angular.element(node).css($scope.subscript.css) == $scope.subscript.target;
			$scope.color.current = angular.element(node).css($scope.color.css)?angular.element(node).css($scope.color.css):'black';
			$scope.backgroundColor.current = angular.element(node).css($scope.backgroundColor.css)?angular.element(node).css($scope.backgroundColor.css):'white';
			temp = angular.element(node).css($scope.fontFamily.css);
			while(temp.indexOf("'") !== -1) temp = temp.replace("'", "");
			$scope.fontFamily.chosen = $scope.fontFamily.title = temp?temp:$scope.fontFamily.default;
			temp = angular.element(node).css($scope.fontSize.css);
			$scope.fontSize.chosen = $scope.fontSize.title = temp?temp:$scope.fontSize.default;
		}
		if (!!thisnode){
			temp = angular.element(thisnode).css($scope.textAlignLeft.css);
			$scope.textAlignLeft.current = temp == $scope.textAlignLeft.target || temp == "";
			$scope.textAlignRight.current = angular.element(thisnode).css($scope.textAlignRight.css) == $scope.textAlignRight.target;
			$scope.textAlignCenter.current = angular.element(thisnode).css($scope.textAlignCenter.css) == $scope.textAlignCenter.target;
			$scope.textAlignJustify.current = angular.element(thisnode).css($scope.textAlignJustify.css) == $scope.textAlignJustify.target;
			$scope.textIndent.current = angular.element(thisnode).css($scope.textIndent.css) == $scope.textIndent.target;
			temp = angular.element(thisnode).css($scope.lineHeight.css);
			$scope.lineHeight.chosen = (temp)? temp: $scope.lineHeight.default;
			temp = angular.element(thisnode).css($scope.letterSpace.css);
			$scope.letterSpace.chosen = (temp)? temp: $scope.letterSpace.default;
		}
		if (!!blocknode){
			$scope.zindex.current = angular.element(blocknode).css($scope.zindex.css)?+angular.element(blocknode).css($scope.zindex.css):0;
			$scope.bgcolor.current = angular.element(blocknode).css($scope.bgcolor.css)?angular.element(blocknode).css($scope.bgcolor.css):'white';
		}
	});
	
	$scope.$on("animationStyleChanged", function(e, key, value){
		$scope[key].chosen = value;
	});
	//代码高亮
	//引用
	
	$scope.changeFontStyle = function(a){
		
		//如果是下拉列表类或者是颜色类
		if (!!a.chosen || !a.intarget){
			$rootScope.$broadcast("fontStyleChanged", a.css, a.target);
		}
		else {
			//如果当前状态是激活的
			if (a.current)
				$rootScope.$broadcast("fontStyleChanged", a.css, a.intarget);
			else
				$rootScope.$broadcast("fontStyleChanged", a.css, a.target);
		}
	};
	$scope.changeBlockStyle = function(a){
		$rootScope.$broadcast("blockStyleChanged", a.css, a.target);
	};
	
	$scope.changeParaStyle = function(a){
		$rootScope.$broadcast("paraStyleChanged", a.css, a.target);
	};
	$scope.changeFontSize = function(isLarger){
		$rootScope.$broadcast("changeFontSize", isLarger);
	};
	$scope.clearStyle = function(){
		$rootScope.$broadcast("clearStyle");
	};
}]);

controllers.controller('insertController', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout){
	$scope.inserting = null;
	$scope.textButtonClick = function(){
		$scope.inserting = 'text';
		$rootScope.$broadcast('insertText');
	};
	$scope.$on("insertEnd", function(e, t){
		$scope.inserting = null;
		$scope.$digest();
	});
	$scope.bgColorButtonClick = function(color){
		$rootScope.$broadcast('insertBackgroundColor', color);
	};
}]);