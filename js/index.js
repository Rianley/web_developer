$(function() {
	//		评价页面的品星
	$(".div_form textarea").focus(function() {
		if($(".div_form textarea").text().trim() == "请输入心愿文字，最多输入60个文字") {
			$(".div_form textarea").text("");
		}
	});
	$(".div_form textarea").blur(function() {
		if($(".div_form textarea").text().trim() == "") {
			$(".div_form textarea").text("请输入心愿文字，最多输入60个文字");
		}
	});

	var file = {
		upload: function(e) {
			var file = e.target.files[0];
			var type = file.type.split('/')[0];
			if(type != 'image') {
				$(".img_holder").html("<span style='color:#ec534f;font-size:0.24rem'>请上传图片格式，最大不能超过3M！</span>")
	
				return;
			}
			var size = Math.floor(file.size / 1024 / 1024);
			if(size > 3) {
				$(".img_holder").html("<span style='color:#ec534f;font-size:0.24rem'>图片最大不能超过3M！</span>")
	
				return;
			};
			var reader = new FileReader();
			console.log(file);
			console.log(reader);
			// reader.readAsBinaryString(file);
			// reader.readAsArrayBuffer(file);
			// reader.abort(file);
			// reader.readAsText(file);
			reader.readAsDataURL(file);
			reader.onloadstart = function() {
				console.log('start');
			};
			reader.onprogress = function(e) {
				var p = '已完成：' + Math.round(e.loaded / e.total * 100) + '%';
				$(".file_upload").find(".progress").html(p);
				// console.log(e);
				console.log('uploading');
			};
			reader.onabort = function() {
				console.log('abort');
			};
			reader.onerror = function() {
				console.log('error');
			};
			reader.onload = function() {
				console.log('load complete');
			};
			reader.onloadend = function(e) {
				// console.log(e);
				var dataURL = reader.result;
				var image = '<img src="' + dataURL + '"/>';
				var text = '<span>"' + dataURL + '"</span>';
				// console.log(dataURL);
				//file里面存放有文件的名字(name)、格式(type)、大小(size)、上传时间(time)等等
				var name = file.name,
					size = Math.round(file.size / 1024),
					time = new Date(file.lastModified);
				time = time.getFullYear() + '年' + Math.floor(time.getMonth() + 1) + '月' + time.getDate() + '日';
				var div = '';
				var imglist = '<div class="img_box"><span class="delete">X</span>' + image + div + '</div>';
				$(".img_holder").html(imglist);
				$(".file_uploader").hide();
				//异步提交数据
				$(".upload_bt").click(function() {
					if($("#upload").val() == '') {
						$(".img_holder").html("<span style='color:#ec534f;font-size:0.24rem'>请上传图片格式，最大不能超过3M</span>")
	
						return;
					};
					var para = {
						name: name,
						url: dataURL
					};
					$.ajax({
						url: 'http://www.baidu.com',
						type: 'post',
						data: para,
						success: function(data) {
							if(data) {
								alert('success');
							} else {
								alert('failure');
							}
						},
						err: function() {
							alert('error');
						}
					})
				});
			};
		},
		m_upload: function(e) {
			var m_file = e.target.files;
			//file里面存放有文件的名字(name)、格式(type)、大小(size)、上传时间(time)等等
			var name = '',
				div = '',
				image = '';
			for(var i = 0; i < m_file.length; i++) {
				var z = m_file[i];
				// var type = z.type.split('/')[0];
				// if (type !='image') {
				// 	alert('请上传图片');
				// 	return;
				// }
				var reader = new FileReader(); //这里可能会有坑
				reader.readAsDataURL(z);
				// console.log(z.name);
				reader.onloadend = (function(i) {
					return function() {
						console.log();
						console.log(i);
						div = '';
						image = '<img src="' + this.result + '"/>';
						var imglist = '<div class="img_box"><span class="delete">X</span>' + image + div + '</div>';
						$(".m_img_holder").append(imglist);

						$(".file_uploader").hide();
					};
				})(z);
			};
		},
		event: function() {
			$("#upload").change(function(e) {
				$(".progress").removeClass("none");
				file.upload(e);
			});
			$("#m_upload").change(function(e) {
				file.m_upload(e);
			});
			//删除文件
			$(".div_form").delegate(".delete", "click", function() {
				var o = $(this);
				o.parents(".img_box").remove(); //并没有清空input里面的值
				$(".progress").addClass("none");
				$("#upload,#m_upload").val(''); //这下就删除了

				$(".file_uploader").show();
			})
		},
		init: function() {
			this.event();
		}
	}
	file.init();

	$("#back").bind("click", function() {
		window.history.go(-1);
	})
})

//表单验证
function check() {
	var name = document.getElementById("name");
	var wish = document.getElementById("texts");
	var img = document.getElementById("upload");
	var recipient = document.getElementById("recipient");
	var phone = document.getElementById("phone");
	var adrs = document.getElementById("adrs");

	var arrary = [name, wish, recipient, phone, adrs];

	var result, result1, result2;
	for(i = 0; i < arrary.length; i++) {
		result = checknull(arrary[i]);
	}

	if(wish.value == "" || wish.value == "请输入心愿文字，最多输入60个文字") {
		wish.className = "error";
		wish.focus();
		result = false;
	} else {
		result = true;
	}

	result1 = isphone(phone.value);
	result2 = isimg(img);

	//验证通过，可以提交生成图片
	if(result == true && result1 == true && result2 == true) {
		//window.location.href = "confirm.shtml";//生成图片此处屏蔽掉
		///在此写函数...

	}

}
//校验文本是否为空
function checknull(field) {
	if(field.value == "" || field.value == undefined) {

		field.focus();
		field.className = "error";
		return false;
	} else {
		field.className = "";
		return true;
	}

}

//手机号码
function isphone(str) {
	if(!(/^1[34578]\d{9}$/.test(str))) {
		phone.className = "error";
		return false;
	} else {
		phone.className = "";
		return true;
	}
}

//照片
function isimg(imgid) {
	if(imgid.value == "" || imgid.value == null) {
		$(".img_holder").html("<span style='color:#ec534f;font-size:0.24rem'>请上传祝福图片，最大不能超过3M！</span>")
	} else {
		if($("#upload").value!="")
		{
			
		}
		else{
			$(".img_holder").html("");
		}
		
		return true;
	}
}