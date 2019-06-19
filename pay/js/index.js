var payment;
$(function() {
    //初始化默认方式
    payment = $('input[data-am-ucheck]').eq(0).val();
    initCheck();
    //确认支付按钮事件
    $("#confirmPayButton").click(function() {
        initConfirmPayButtonEvent();
    })
});

//支付方式选择框
function initCheck() {
    $('input[data-am-ucheck]').click(function() {
        $('input[data-am-ucheck]').uCheck('uncheck');
        $(this).uCheck('check');
        payment = $(this).val();
    });
}
// alert(JSON.toString(data))

var paymentSuccessCallback = function(data) {};
var paymentFailCallback = function(data) {};
var paymentCancelCallback = function(data) {};

//确认支付按钮事件
function initConfirmPayButtonEvent() {
    $(this).click(function() {
        $.ajax({
            url: baseURL + 'action/auth/user/normal/MerchantShopOrderAction/unifiedOrder',
            data: {
                channel: 'wechatJsApi',
                ids: getQueryString('ids')
            },
            success: function(data) {
                if (data.c == 0) {
                    wx.chooseWXPay({
                        // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                        timestamp: data.d.timeStamp,
                        // 支付签名随机串，不长于 32 位
                        nonceStr: data.d.nonceStr,
                        // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                        package: data.d.package,
                        // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                        signType: data.d.signType,
                        // 支付签名
                        paySign: data.d.paySign,
                        success: function(res) {
                            if (res.errMsg == "chooseWXPay:ok") {
                                // 使用以上方式判断前端返回,微信团队郑重提示：res.errMsg将在用户支付成功后返回
                                // chooseWXPay:ok，但并不保证它绝对可靠。
                                paymentSuccessCallback(data);
                            } else {
                                //目前不知道什么情况代码会运行到这，但为防万一就写它了
                                paymentFailCallback(data);
                            }
                        },
                        cancel: function(res) {
                            paymentCancelCallback(data);
                        },
                        fail: function(res) {
                            paymentFailCallback(data);
                        }
                    });
                }
            },
            error: function(data) {
                showError(data.m);
            }
        });
    });
}