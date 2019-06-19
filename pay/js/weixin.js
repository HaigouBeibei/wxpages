var isJsSdkReady = false;

function wxConfig(args) {
	wx.config({
		debug: false,
		appId: args.appId,
		timestamp: args.timestamp,
		nonceStr: args.nonceStr,
		signature: args.signature,
		jsApiList: ['chooseWXPay']
	});
}

function wxReady() {
	wx.ready(function() {
		isJsSdkReady = true;
	});
}

function wxError() {
	wx.error(function(res) {

	});
}

function initJsSdk() {
	$.getJSON(baseURL + "action/auth/user/normal/WeiXinJsSdk/getJsApiConfigArgs", {
		"url": window.location.href
	}, function(data, state, xhr) {
		if(data.c == 0) {
			wxReady();
			wxError();
			wxConfig(data);
		}
	});
}

$(function() {
	initJsSdk();
});