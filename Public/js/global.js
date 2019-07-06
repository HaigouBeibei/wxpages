var contentIsRoot = false;

function gbp() {
	if(contentIsRoot)
		return "/"; // 如果工程部署的到根目录，则直接return "/";
	try {
		var webroot = document.location.href;
		webroot = webroot.substring(webroot.indexOf('//') + 2, webroot.length);
		webroot = webroot.substring(webroot.indexOf('/') + 1, webroot.length);
		webroot = webroot.substring(0, webroot.indexOf('/'));
		var rootpath = "/" + webroot;
		return rootpath;
	} catch(exception) {
		alert("不能获取上下文路径！");
	}
	return "";
}

/*******************************************************************************
 * Get Current Millisecond
 */
function gt() {
	return(new Date()).getTime();
}

/*******************************************************************************
 * Get URL Parameters
 */
function gp() {
	var ps = {};
	var p = window.location.href;
	var begin = p.indexOf("?");
	var end = (p.indexOf("#") > -1) ? (p.indexOf("#")) : p.length;
	if(begin > -1) {
		p = p.substring(begin + 1, end);
		var pp = p.split("&");
		for(var i = 0; i < pp.length; i++) {
			var v = pp[i].split("=");
			ps[v[0]] = v[1];
		}
	}
	return ps;
}

/*******************************************************************************
 * Add Context Path For URL
 */
function _url(ncurl) {
	if(contentIsRoot) {
		if(ncurl.indexOf("/") == 0) {
			return ncurl;
		} else {
			return "/" + ncurl;
		}
	}
	if(ncurl.indexOf("/") == 0) {
		return __requestUrl + ncurl;
	} else {
		return __requestUrl + "/" + ncurl;
	}
}

/*******************************************************************************
 * Add Timestamp Parameter For URL
 */
function _at(ncurl) {
	if(ncurl.indexOf("?") == -1) {
		ncurl += "?_=" + gt();
	} else {
		ncurl += "&_=" + gt();
	}
	return ncurl;
}

/*******************************************************************************
 * Add Parameter For URL
 */
function _ap(ncurl, param) {
	if(ncurl.indexOf("?") == -1) {
		ncurl += "?" + param;
	} else {
		ncurl += "&" + param;
	}
	return ncurl;
}

/*******************************************************************************
 * Add Timestamp Parameter And Context Path For URL
 */
function _url_at(ncurl) {
	return _url(_at(ncurl));
}

/*******************************************************************************
 * Show Message By Element(messageShowSelector)
 */
var clearShowMsg = null;

function showMsg(msg, showTime) {
	var _showTime = 2000;
	if(showTime) {
		_showTime = showTime;
	}
	layer.open({
		content: msg,
		skin: 'msg',
		time: _showTime/1000
	});
}

/*******************************************************************************
 * Show URL Content By Open A Window ,
 */
function openWin(url, callBack) {
	var win = window.open(url, "_win_", "width=" + window.screen.width + ",height=" + window.screen.height + ",channelmode=yes,fullscreen=yes,location=no,menubar=no,resizable=yes,status=no,titlebar=no,toolbar=no,scrollbars=yes,top=0,left=0", true);
	win.onunload = function() {
		try {
			callBack();
		} catch(err) {
			window.alert(err.message);
		}
	}
}

// Unified Disable Cache For AJAX
$.ajaxSetup({
	cache: false,
	type: "POST",
	xhrFields: {
		withCredentials: true
	},
	complete: function(XMLHttpRequest, textStatus) {
		var sessionstatus = XMLHttpRequest.getResponseHeader("sessionstatus");
		if(sessionstatus == "TIMEOUT") {
			var win = window;
			while(win != win.top) {
				win = win.top;
			}
			win.location.href = XMLHttpRequest.getResponseHeader("CONTEXTPATH");
		}
	}
});
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function(fmt) {
	if(fmt == null) {
		fmt = "yyyy-MM-dd hh:mm:ss";
	}
	var o = {
		"M+": this.getMonth() + 1, // 月份
		"d+": this.getDate(), // 日
		"h+": this.getHours(), // 小时
		"m+": this.getMinutes(), // 分
		"s+": this.getSeconds(), // 秒
		"q+": Math.floor((this.getMonth() + 3) / 3), // 季度
		"S": this.getMilliseconds()
		// 毫秒
	};
	if(/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};
String.prototype.replaceAll = function(s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2);
}

function jsonConcat(o1, o2) {
	for (var key in o2) {
		o1[key] = o2[key];
	}
	return o1;
}