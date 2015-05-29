'use strick';

var controllers = angular.module('controllers', []);

controllers.controller('fontController', function($scope){
	
});

controllers.controller('toolController', ['$scope', '$rootScope', function($scope, $rootScope){
	$scope.fontFamily = {
		'fixed' : false,
		'button' : false,
		'title': 'Helvetica Neue',
		'chosen': 'Helvetica Neue',
		'items': ['黑体', '宋体', '楷体', '微软雅黑', 'Helvetica Neue']		
	};
	$scope.fontSize = {
		'fixed' : false,
		'button' : false,
		'title': '20',
		'chosen': '20',
		'items': [20, 22, 24, 26, 28]
	};
	$scope.listType = {
		'fixed' : true,
		'button' : true,
		'title': 'show-thumbnails-with-lines',
		'chosen': '',
		'items': ['无序列表', '有序列表']
	};
	$scope.lineHeight = {
		'fixed' : true,
		'button' : true,
		'title': 'text-height',
		'chosen': '1',
		'items': ['1', '1.5', '2', '2.5', '3']
	};
	$scope.letterSpace = {
		'fixed' : true,
		'button' : true,
		'title' : 'text-width',
		'chosen' : '0px',
		'items' : ['0px', '1px', '2px', '3px', '4px', '5px']
	};
	$scope.singleAnimType = {
		'fixed' : true,
		'button' : false,
		'title' : '动画效果',
		'chosen' : 'None',
		'items' : ['None', 'Fade', 'Slide', 'Convex', 'Zoom']
	}
	$scope.singleAnimTime = {
		'fixed' : true,
		'button' : false,
		'title' : '动画时间',
		'chosen' : '普通',
		'items' : ['缓慢', '普通', '快速']
	}
	$scope.multiAnimType = {
		'fixed' : true,
		'button' : false,
		'title' : '动画效果',
		'chosen' : 'None',
		'items' : ['None', 'Fade', 'Slide', 'Convex', 'Zoom']
	}
	$scope.multiAnimTime = {
		'fixed' : true,
		'button' : false,
		'title' : '动画时间',
		'chosen' : '普通',
		'items' : ['缓慢', '普通', '快速']
	}
	$scope.bold = {'css':['font-weight'],'current':false, 'target':['bold']};
	$scope.italic = {'css':['font-style'], 'current':false, 'target':['italic']};
	$scope.underline = {'current':false, 'target':['underline'], 'css':['text-decoration']};
	$scope.linethrough = {'current':false, 'target':['lineThrough'], 'css':['text-decoration']};
	$scope.superscript = {'current':false, 'target':['super', 'smaller'], 'css':['vertical-algn', 'font-size']};
	$scope.subscript = {'current':false, 'target':['sub', 'smaller'], 'css':['vertical-algn', 'font-size']};//superscript or subscript
	$scope.color = {'current':'black', 'css':'color'};
	$scope.backgroundColor = {'current':"white", 'css':'background-color'};
	$scope.textAlignLeft = {'current':true,'target':"left", 'css':'text-align'};
	$scope.textAlignRight = {'current':false,'target':"right", 'css':'text-align'};
	$scope.textAlignCenter = {'current':false,'target':"center", 'css':'text-align'};
	$scope.textAlignJustify = {'current':false,'target':"justify", 'css':'text-align'};
	$scope.textIndent = {'current':false, 'target':'2em', 'css':'text-indent'};
	$scope.$on("selectionStyleChanged", function(node){
		console.log(node);
	});
	//代码高亮
	//引用
	
	$scope.changeFontStyle = function(a){
		$rootScope.$broadcast("fontStyleChanged", a.css, a.target);
	}
	$scope.changeParaStyle = function(a){
		$rootScope.$broadcast("paraStyleChanged", a.css, a.target);
	}
}]);