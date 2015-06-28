directives.directive('repUploader', ['$rootScope', function($rootScope){
	var  intervalid = null;
	function cancel(){
		$(".overlay").fadeOut(500);
		setTimeout(function(){
			$("#in-fileupload").val("");
			$("#progress-bar").css("width", 0);
			$("success-info").hide(0);
			clearInterval(intervalid);
		}, 500);
	}
		
	var uploaderInit = function (setting){
		var finput = $("#in-fileupload"), form = $("#form-upload"), data;
		finput.change(function(e){
			$("#filename").text(finput[0].files[0].name);
			$("#filename").attr("title", finput[0].files[0].name);
			$(".overlay").fadeIn(500);
		});
		
		form.submit(function(evt){
			var xhr = null;
			evt.preventDefault();
			try {
				xhr = new XMLHttpRequest();
			} catch (error) {
				return false;
			}
			//$("#cancel-btn").hide(0);
			data = new FormData();
			data.append("file", finput[0].files[0]);
			if (setting.appendData)
				setting.appendData(data);
			var progress = 0;
			intervalid = setInterval(function(){
				$("#progress-bar").css("width", progress * 100 + "%");
			}, 200);
			
			xhr.open(form.attr("method"), setting.url, true);
			
			xhr.addEventListener("load", function(evt){
				if (evt.currentTarget.status !== 200){
					$("#success-info").text("上传失败").show(0);
					progress = 0;
					clearInterval(intervalid);
					return;
				}
				progress = 1;
				$("#progress-bar").css("width", progress * 100 + "%");
				$("#success-info").text("上传成功").show(0);
				setTimeout(function(){
					setting.onload(xhr.responseText);
				},500);
				
			});
			xhr.upload.addEventListener("progress", function(evt){
				progress = evt.loaded / evt.total;
				console.log(evt);
			});
			xhr.send(data);
		});
		
		$(".overlay").click(function(e){
			cancel();
			$rootScope.$broadcast("insertEnd", "*");
		});
		$(".upload-div").click(function(e){
			e.stopPropagation();
		});
		$("#cancel-btn").click(function(e){
			cancel();
			$rootScope.$broadcast("insertEnd", "*");
		});
		
		
		var highlightid = +location.hash.substr(1), time = 1000, int = 1000/30;
		if (highlightid){
			$(".row").each(function(i, item){
				var t = $(this);
				if (+t.data("homeworkid") == highlightid || +t.data("fileid") == highlightid){
					t.css("background-color", "rgba(240, 173, 78, 1)");
					setTimeout(function(){
						var curOp = 1;
						var tid = setInterval(function(){
							curOp -= int / time * 1;
							t.css("background-color", "rgba(240, 173, 78, " + curOp + ")");
							if (curOp < 0)
								clearInterval(tid);
						}, int);
					}, 1500);
				}
			});
		}
	};
	return{
		restrict:'A',
		link: function(scope, elem, attrs){
			uploaderInit({
				url:"/server/upload.php",
				onload:function(data){
					data = JSON.parse(data);
					console.log(scope);
					if (scope.inserting === 'image')
						$rootScope.$broadcast("insertImage", data);
					else if (scope.inserting === 'video')
						$rootScope.$broadcast("insertVideo", data);
					else if (scope.inserting === 'bgimage')
						$rootScope.$broadcast("insertBackgroundImage", data);
					else 
						$rootScope.$broadcast("insertBackgroundMusic", data);
				},
				appendData:function(){}
			});
			scope.$on("insertEnd", function(){
				cancel();
			});
		},
		replace:true,
		templateUrl:'template/uploader.html'
	};
}]);
//上传文件组建
//settring{url:"", onload:function(){}, appendData:function(){}} 目标控制器函数

