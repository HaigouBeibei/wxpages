var appid = "wxf950c87150710871";
var baseURL = "https://tongmeng.haigoubeibei.com/hiGou/";
var myAddress;
$.ajaxSetup({
    cache: false,
    xhrFields: {
        withCredentials: true
    },
    beforeSend: function() {
        loadingModal = loading();
        loadingModal.modal();
    },
    complete: function(XMLHttpRequest, textStatus) {
        var sessionstatus = XMLHttpRequest.getResponseHeader("sessionstatus");
        if (sessionstatus == "TIMEOUT") {
            var win = window;
            while (win != win.top) {
                win = win.top;
            }
            getCode();
        }
        loadingModal.modal('close');
    }
});
//获取CODE
function getCode() {
    //记忆地址以
    //开头---6个/
    //结尾---8个/
    var jummpURL = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + "&redirect_uri=" + encodeURIComponent(baseURL + "wxpages/doAuth.html" + "?toURL=//////" + window.location.href + "////////") + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
    window.location.href = jummpURL;
}

// 获取地址栏参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    // if (r != null) return unescape(r[2]); //中文会乱码
    if (r != null) return decodeURI(r[2]);
    return null;
}
// 判断是否微信浏览器
function isWeiXin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}

//显示错误信息
function showError(showMessage, tipsMessage = '刷新页面', toURL = 'reload') {
    var errorForm = "";
    errorForm += '<div class="am-modal am-modal-confirm" tabindex="-1" id="errorForm">';
    errorForm += '<div class="am-modal-dialog">';
    errorForm += '<div class="am-modal-hd">嗨购贝贝</div>';
    errorForm += '<div class="am-modal-bd">';
    errorForm += showMessage;
    errorForm += "</div>";
    errorForm += '<div class="am-modal-footer">';
    errorForm += '<span class="am-modal-btn" data-am-modal-cancel>返回上一页</span>';
    errorForm += '<span class="am-modal-btn" style="background-color:#f0250f;color:white" data-am-modal-confirm>' + tipsMessage + '</span>';
    errorForm += "</div></div></div>";
    $("body").append(errorForm);
    $("#errorForm").modal({
        relatedTarget: this,
        closeViaDimmer: false,
        onConfirm: function(options) {
            if (toURL == 'reload') {
                window.location.reload();
            } else {
                window.location.href = toURL;
            }
        },
        onCancel: function() {
            history.back(-1);
        }
    });
}

//处理价格
function handlePrice(price) {
    var value = Math.floor(parseInt(price)) / 100;
    var xsd = value.toString().split(".");
    if (xsd.length == 1) {
        value = value.toString() + ".00";
        return value;
    }
    if (xsd.length > 1) {
        if (xsd[1].length < 2) {
            value = value.toString() + "0";
        }
        return value;
    }
}

//重写alert
function alert(content) {
    my_alert = $('#my-alert');
    if (my_alert.length != 0) {
        my_alert.remove();
    }
    appendContent = '';
    appendContent += '<div class="am-modal am-modal-alert" tabindex="-1" id="my-alert">';
    appendContent += '<div class="am-modal-dialog">';
    appendContent += '<div class="am-modal-hd">嗨购贝贝</div>';
    appendContent += '<div class="am-modal-bd">';
    appendContent += content;
    appendContent += '</div>';
    appendContent += '<div class="am-modal-footer">';
    appendContent += '<span class="am-modal-btn">确定</span>';
    appendContent += '</div>';
    appendContent += '</div>';
    appendContent += '</div>';
    $('body').append(appendContent);
    $('#my-alert').modal();
    $('.am-modal-btn').modal('close');
}
//loading动画
function loading() {
    my_alert = $('#my-modal-loading');
    if (my_alert.length != 0) {
        my_alert.remove();
    }
    appendContent = '';
    appendContent += '<div class="am-modal am-modal-loading am-modal-no-btn" tabindex="-1" id="my-modal-loading">';
    appendContent += '<div class="am-modal-dialog">';
    appendContent += '<div class="am-modal-hd">loading...</div>';
    appendContent += '<div class="am-modal-bd">';
    appendContent += '<span class="am-icon-spinner am-icon-spin"></span>';
    appendContent += '</div>';
    appendContent += '</div>';
    appendContent += '</div>';
    $('body').append(appendContent);
    return $('#my-modal-loading');
}

//获取我的收货地址
function getMyAddress() {
    $.ajax({
        url: baseURL + 'action/auth/user/normal/HxCsUserDeliveryAddressAction/listOfMine',
        async: false,
        success: function(data) {
            myAddress = data.d;
        }
    });
    return myAddress;
}

function isStringEmpty(string) {
    var isEmpty = false;
    if (typeof string == "undefined" || string == null || string == "") {
        isEmpty = true;
    }
    return isEmpty;
}