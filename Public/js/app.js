var appid = "wxf950c87150710871";
var baseURL = "https://tongmeng.haigoubeibei.com/hiGou/";

$.ajaxSetup({
    cache: false,
    xhrFields: {
        withCredentials: true
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
    if (r != null) return unescape(r[2]);
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
function showError(showMessage) {
    var errorForm = "";
    errorForm += '<div class="am-modal am-modal-confirm" tabindex="-1" id="errorForm">';
    errorForm += '<div class="am-modal-dialog">';
    errorForm += '<div class="am-modal-hd">嗨购贝贝</div>';
    errorForm += '<div class="am-modal-bd">';
    errorForm += showMessage;
    errorForm += "</div>";
    errorForm += '<div class="am-modal-footer">';
    errorForm += '<span class="am-modal-btn" data-am-modal-cancel>返回上一页</span>';
    errorForm += '<span class="am-modal-btn" style="background-color:#f0250f;color:white" data-am-modal-confirm>刷新页面</span>';
    errorForm += "</div></div></div>";
    $("body").append(errorForm);
    $("#errorForm").modal({
        relatedTarget: this,
        onConfirm: function(options) {
            window.location.reload();
        },
        onCancel: function() {
            history.back(-1);
        }
    });
}

function handlePrice(price) {
    return Math.floor(parseInt(price)) / 100;
}