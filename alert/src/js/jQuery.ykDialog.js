/*
 * @Author: yankang
 * @Date:   2017-03-02 16:43:46
 * @Last Modified by:   yankang
 * @Last Modified time: 2017-03-08 17:06:47
 */
;
(function($) {
	'use strict';
	var Dialog = function(config) { //config为传递的配置对象
		var _this_ = this;
		//默认参数配置
		this.config = {
			//按钮组
			buttons: null,
			//皮肤
			skin: 1,
			//图标类型
			type: "ok",
			//多少秒关闭
			delay: null,
			//描述标题
			title: null,
			//描述文字
			content: null,
			//消息提示
			msg: null,
			//自定义content样式
			style: null,
			//表单类型
			inputType: null,
			//表单占位文字
			placeholder: null,
			//尺寸
			width: "auto",
			//对话框遮罩层透明度
			maskOpacity: null,
			//点击遮罩关闭弹窗
			maskClose: false,
			//动画
			animate: null,
			delayCallback: null,
		};
		if (config && $.isPlainObject(config)) {
			$.extend(this.config, config);
		} else {
			this.isConfig = true
		};
		//创建Dom
		this.body = $("body")
		//创建遮罩层
		if(this.config.skin == 2){
			this.mask = $('<div class="yk2-dialog-container">')
		}else{
			this.mask = $('<div class="yk1-dialog-container">')
		}
		this.win = $('<div class="dialog-window">')
		this.winHeader = $('<div class="dialog-header"></div>')
		this.winContent = $('<div class="dialog-content" style="'+ this.config.style +'"></div>')
		this.winMsg = $('<div class="dialog-msg"></div>')
		this.input = $('<input class="dialog-input"/>')
		this.winFooter = $('<div class="dialog-footer">')
		this.create()
	};
	//默认参数扩展
	Dialog.zIndex = 10000;
	Dialog.prototype = {
		tips: function(msg){
			this.config.content = msg || null
		},
		animate: function() {
			var _this_ = this;
			this.win.css("-webkit-transform", "scale(0,0)");
			setTimeout(function() {
				_this_.win.css("-webkit-transform", "scale(1,1)")
			}, 100);
		},
		create: function() {
			var _this_ = this,
				config = this.config,
				win = this.win,
				mask = this.mask,
				header = this.winHeader,
				content = this.winContent,
				msg = this.winMsg,
				input = this.input,
				footer = this.winFooter,
				body = this.body;
			Dialog.zIndex++;
			this.mask.css("z-index", Dialog.zIndex);
			//如果没有传递参数，就弹出一个图标
			if (this.isConfig) {
				//弹框类型
				win.append(header.addClass("warning"));
				this.animate();
				mask.append(win);
				body.append(mask);
			} else {
				//弹框类型
				header.addClass(config.type);
				//添加文本信息
				if(config.title){
					win.append(header.html(config.title))
				}
				if (config.content)
					win.append(content.html(config.content))
				if (config.msg)
					win.append(msg.html(config.msg))
				//添加文本样式
				if (config.style){
					header.css(config.style)
				}
				//插入输入框
				if(config.inputType){
					win.append(input.attr('type', config.inputType).attr('placeholder', config.placeholder))
				}
				//插入按钮
				if (config.buttons) {
					_this_.createButtons(footer, config.buttons)
					win.append(footer)
				}
				//宽度
				if (config.width != "auto") {
					win.width(config.width)
				}
				//透明度
				if (config.maskOpacity) {
					mask.css("backgroundColor", "rgba(0,0,0," + config.maskOpacity + ")")
				}
				//设置弹出框弹出多久关闭
				if (config.delay && config.delay != 0) {
					setTimeout(function(e) {
						_this_.close()
						if (config.delayCallback) {
							config.delayCallback();
						}
					}, parseFloat(config.delay) * 1000)
				}
				if (config.animate) {
					_this_.animate()
				}
				if (config.maskClose){
					mask.on('click', function(e) {
						if($(e.target).closest('.dialog-window').length == 0){
							_this_.close()
						}
					})
				}
				mask.append(win)
				body.append(mask)
			}
		},
		close: function() {
			this.mask.remove()
		},

		createButtons: function(footer, buttons) {
			var _this_ = this
			$(buttons).each(function() {
				var type = this.type ? " class='" + this.type + "'" : ""

				var btnText = this.text;
				var button = $("<button" + type + ">" + btnText + "</button>")

				var callback = this.callback ? this.callback : null;
				if (callback && typeof(callback) === 'function'){
					button.on('click', function() {
						var inputVal = _this_ .input.val()
						var isClose
						if(inputVal){
							isClose = callback(inputVal)
						}else{
							isClose = callback()
						}
						if (isClose){
							_this_.close();
						}
					})
				}
				footer.append(button)
			})
		}
	}
	window.Dialog = Dialog;
	$.dialog = function(config) {
		if(typeof Dialog.instance == 'object'){
			return Dialog.instance
		}
		Dialog.instance = this;
		return new Dialog(config)
	}
})(jQuery);