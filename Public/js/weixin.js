var isJsSdkReady = false;

function wxConfig(args) {
	wx.config({
		debug: false,
		appId: args.appId,
		timestamp: args.timestamp,
		nonceStr: args.nonceStr,
		signature: args.signature,
		jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'translateVoice', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem',
			'showAllNonBaseMenuItem', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard'
		]
	});
}

function wxReady() {
	wx.ready(function() {
		isJsSdkReady = true;
		//wxShare();
	});
}

function wxError() {
	wx.error(function(res) {

	});
}

function wxShare() {
	if(isJsSdkReady) {
		// 分享到朋友圈
		wx.onMenuShareTimeline({
			title: _title, // 分享标题
			link: _link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: _imgUrl, // 分享图标
			success: function() {
				// 用户确认分享后执行的回调函数
				if(isProductPage) {
					sharedCommission(_productId);
				}
			},
			cancel: function() {
				// 用户取消分享后执行的回调函数
			}
		});
		// 分享给朋友
		wx.onMenuShareAppMessage({
			title: _title, // 分享标题
			desc: _desc, // 分享描述
			link: _link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: _imgUrl, // 分享图标
			type: '', // 分享类型,music、video或link，不填默认为link
			dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
			success: function() {
				// 用户确认分享后执行的回调函数
				if(isProductPage) {
					sharedCommission(_productId);
				}
			},
			cancel: function() {
				// 用户取消分享后执行的回调函数
			}
		});
		// 分享到QQ
		wx.onMenuShareQQ({
			title: _title, // 分享标题
			desc: _desc, // 分享描述
			link: _link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: _imgUrl, // 分享图标
			success: function() {
				// 用户确认分享后执行的回调函数
				if(isProductPage) {
					sharedCommission(_productId);
				}
			},
			cancel: function() {
				// 用户取消分享后执行的回调函数
			}
		});
		// 分享到腾讯微博
		wx.onMenuShareWeibo({
			title: _title, // 分享标题
			desc: _desc, // 分享描述
			link: _link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: _imgUrl, // 分享图标
			success: function() {
				// 用户确认分享后执行的回调函数
				if(isProductPage) {
					sharedCommission(_productId);
				}
			},
			cancel: function() {
				// 用户取消分享后执行的回调函数
			}
		});
		// 分享到QQ空间
		wx.onMenuShareQZone({
			title: _title, // 分享标题
			desc: _desc, // 分享描述
			link: _link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: _imgUrl, // 分享图标
			success: function() {
				// 用户确认分享后执行的回调函数
				if(isProductPage) {
					sharedCommission(_productId);
				}
			},
			cancel: function() {
				// 用户取消分享后执行的回调函数
			}
		});
	}
}

function initJsSdk() {
	$.getJSON(__requestUrl + "action/auth/admin/WeiXinJsSdk/getJsApiConfigArgs", {
		"url": window.location.href
	}, function(data, state, xhr) {
		if(data.state) {
			wxReady();
			wxError();
			wxConfig(data);
		}
	});
}

$(function() {
	initJsSdk();
});