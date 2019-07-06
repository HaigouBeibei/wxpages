var _format = {
	"_force_hybrid": /^[0-9a-zA-Z]*$/, //需要单独JS脚本执行判断的混合内容
	"_hybrid": /^[0-9a-zA-Z]*$/, //混合的
	"_jdbc_url": /^[0-9a-zA-Z:\/\.\(\)\{\}\=\@_\-\s]*$/, //JDBC_URL
	"_class": /^[0-9a-zA-Z\._]*$/, //类路径，比如com.hyxt.Test
	"_sql": /^[0-9a-zA-Z\.\*\(\)\s]*$/, //sql语句
	"_number": /^[-0-9]{1}\d*\.{0,1}\d*$/, //数字
	"_money": /^(0|([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, //用于验证价格
	"_integer": /^[-0-9]{1}\d*$/, //整数
	"_positiveIntegerZero": /^(0|[1-9]\d*)$/, //非负整数
	"_positiveInteger": /^([1-9]\d*)$/, //正整数
	"_chinese": /^[\u0391-\uFFE5]+$/, //汉字
	"_mobile": /^((0\d{2,3}-\d{7,8})|(1[35784]\d{9}))$/, //电话 新型手机号
	"_idcard": /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d|x|X)$/, //身份证号
	"_postal": /^[1-9]\d{5}$/, //邮政编码
	"_maintext": /^[^!@#\$%\^&\*\\\[\]\{\}\-\?\/]+$/, //正文
	"_login_name": /^[0-9a-zA-Z]*$/, //登录名
	"_mail": /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/, //邮箱
	"_password": /^[0-9a-zA-Z!@#\$%\^&\*\\\[\]\{\}\-\?\/]*$/, //登录密码
	"_date": /^(^(\d{4}|\d{2})(\-|\/|\.)\d{1,2}\3\d{1,2}$)|(^\d{4}年\d{1,2}月\d{1,2}日$)$/, //日期
	"_qq": /[1-9][0-9]{4,13}$/, //qq
	"_phone": /^1[35784]\d{9}$/ //手机号
};

$(function() {
	$("body").delegate("input[format],textarea[format],select[format]", "change", function() {
		formatCheck(this);
	});
	$("body").delegate("input[focusSelect]", "focus", function() {
		$(this).select();
	});
});

function formatCheck(o) {
	var state = true;
	if(typeof($(o).attr("format")) != "undefined") {
		if(!_format[$(o).attr("format")].test($(o).val())) {
			state = false;
		} else if($(o).attr("format") == "_force_hybrid") {
			if(!/[0-9]+/.test($(o).val()) || !/[a-z]+/.test($(o).val()) || !/[A-Z]+/.test($(o).val())) {
				state = false;
			}
		}
	}
	return state;
}
/**
 * <input title="手机号码" format="_mobile" nonempty vlength="11" />
 * <input  title="登录密码" format="_force_hybrid" nonempty vlength="6,20" />
 * @returns {___anonymous594_595}
 */
var _en_ = false;

function _check() {
	var rtn = {};
	rtn["state"] = true;
	rtn["msg"] = "";
	rtn["id"] = ""; 
	var eachFlg = true;
	$("input[nonempty],textarea[nonempty],select[nonempty]").each(function(i, o) {
		if(eachFlg) {
			if(eachFlg) {
				var v = $(o).val();
				if(v == null || v == "") {
					if(_en_) {
						rtn["msg"] += "[" + $(o).attr("title") + "] is required;";
					} else {
						rtn["msg"] += "[" + $(o).attr("title") + "]是必填项";
					}
					eachFlg = false;
					rtn["state"] = false;
					return rtn;
				}
			}
			if(!formatCheck(o)) {
				if(_en_) {
					rtn["msg"] += "[" + $(o).attr("title") + "] invalid format;";
				} else {
					rtn["msg"] += "[" + $(o).attr("title") + "]格式错误";
				}
				rtn["state"] = false;
				eachFlg = false;
				return rtn;
			}
		}
	});

	$("input[vlength],textarea[vlength],select[vlength]").each(function(i, o) {
		if(eachFlg) {
			var v = $(o).val();
			if(v != null && v != "") {
				var l = $(o).attr("vlength");
				if(l != null && l != undefined && l != "") {
					if(!formatCheck(o)) {
						rtn["state"] = false;
						eachFlg = false;
						return rtn;
					}
					var minmaxl = l.split(",");
					if(minmaxl.length == 1) {
						if(v.length != minmaxl[0]) {
							if(_en_) {
								rtn["msg"] += "[" + $(o).attr("title") + "] Length must be " + minmaxl[0] + ";";
							} else {
								rtn["msg"] += "[" + $(o).attr("title") + "]长度必须为" + minmaxl[0] + "位";
							}
							eachFlg = false;
							rtn["state"] = false;
						}
					} else if(minmaxl.length == 2) {
						if(v.length < minmaxl[0] || v.length > minmaxl[1]) {
							if(_en_) {
								rtn["msg"] += "[" + $(o).attr("title") + "] The length between " + minmaxl[0] + " and " + minmaxl[1] + ";";
							} else {
								rtn["msg"] += "[" + $(o).attr("title") + "]长度必须在" + minmaxl[0] + "至" + minmaxl[1] + "位之间";
							}
							eachFlg = false;
							rtn["state"] = false;
						}
					}
				}
			}
		}
	});

	return rtn;
}

function _check_(ContainerSelecter) {
	var rtn = {};
	rtn["state"] = true;
	var eachFlg = true;
	rtn["msg"] = "";
	$(ContainerSelecter + " input[nonempty]," + ContainerSelecter + " textarea[nonempty]," + ContainerSelecter + " select[nonempty]").each(function(i, o) {
		if(eachFlg) {
			if(eachFlg) {
				var v = $(o).val();
				if(v == null || v == "") {
					if(_en_) {
						rtn["msg"] += "[" + $(o).attr("title") + "] is required;";
					} else {
						rtn["msg"] += "[" + $(o).attr("title") + "]是必填项";
					}
					eachFlg = false;
					rtn["state"] = false;
					return rtn;
				}
			}
			if(!formatCheck(o)) {
				if(_en_) {
					rtn["msg"] += "[" + $(o).attr("title") + "] invalid format;";
				} else {
					rtn["msg"] += "[" + $(o).attr("title") + "]格式错误";
				}
				rtn["state"] = false;
				eachFlg = false;
				return rtn;
			}
		}
	});

	$(ContainerSelecter + " input[vlength]," + ContainerSelecter + " textarea[vlength]," + ContainerSelecter + " select[vlength]").each(function(i, o) {
		if(eachFlg) {
			var v = $(o).val();
			if(v != null && v != "") {
				var l = $(o).attr("vlength");
				if(l != null && l != undefined && l != "") {
					if(!formatCheck(o)) {
						rtn["state"] = false;
						eachFlg = false;
						return rtn;
					}
					var minmaxl = l.split(",");
					if(minmaxl.length == 1) {
						if(v.length != minmaxl[0]) {
							if(_en_) {
								rtn["msg"] += "[" + $(o).attr("title") + "] Length must be " + minmaxl[0] + ";";
							} else {
								rtn["msg"] += "[" + $(o).attr("title") + "]长度必须为" + minmaxl[0] + "位";
							}
							eachFlg = false;
							rtn["state"] = false;
						}
					} else if(minmaxl.length == 2) {
						if(v.length < minmaxl[0] || v.length > minmaxl[1]) {
							if(_en_) {
								rtn["msg"] += "[" + $(o).attr("title") + "] The length between " + minmaxl[0] + " and " + minmaxl[1] + ";";
							} else {
								rtn["msg"] += "[" + $(o).attr("title") + "]长度必须在" + minmaxl[0] + "至" + minmaxl[1] + "位之间";
							}
							eachFlg = false;
							rtn["state"] = false;
						}
					}
				}
			}
		}

	});

	return rtn;
}