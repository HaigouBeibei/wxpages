var payment;
var orderSn;
$(function() {
    //写入订单金额
    $('#payCount').text('￥' + handlePrice(getQueryString('payCount')));
    //初始化默认方式
    payment = $('input[data-am-ucheck]').eq(0).val();
    initCheck();
    //初始化键盘
    initKeyboard();
    //确认支付按钮事件
    initConfirmPayButtonEvent();
});

//支付方式选择框
function initCheck() {
    $('input[data-am-ucheck]').click(function() {
        $('input[data-am-ucheck]').uCheck('uncheck');
        $(this).uCheck('check');
        payment = $(this).val();
        $('#keyboard').modal('close');
    });
}

//确认支付按钮事件
function initConfirmPayButtonEvent() {
    $('#confirmPayButton').click(function() {
        $.ajax({
            url: baseURL + 'action/auth/user/normal/MerchantShopOrderAction/unifiedOrder',
            data: {
                channel: payment,
                ids: getQueryString('ids')
            },
            success: function(data) {
                console.log(data);
                if (data.c == 0) {
                    if (payment == 'balance') {
                        // console.log('keyboard');
                        orderSn = data.d.orderSn
                        $('#keyboard').modal('open');
                        // $('.am-dimmer').removeAttr('style');
                    } else if (payment == 'wechatJsApi') {
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
                                    window.location.href = 'pay_success.html?payCount=' + getQueryString('payCount') + '&mode=wechatJsApi';
                                } else {
                                    //目前不知道什么情况代码会运行到这，但为防万一就写它了
                                    window.location.href = 'pay_fail.html';
                                }
                            },
                            cancel: function(res) {
                                window.location.href = 'pay_fail.html';
                            },
                            fail: function(res) {
                                window.location.href = 'pay_fail.html';
                            }
                        });
                    }
                } else if (data.c == 1) {
                    showError('设置支付密码', '去设置密码>>>', '../i/password.html');
                } else {
                    showError(data.m);
                }
            },
            error: function(data) {
                showError(data.m);
            }
        });
    });
}
//余额支付
function balancePay(orderSn, payPwd) {
    finalPassword = $.md5(orderSn + '000' + $.md5(payPwd));
    $.ajax({
        url: baseURL + 'action/auth/user/normal/MerchantShopOrderAction/balancePayCallBack',
        data: {
            orderSn: orderSn,
            payPwd: finalPassword
        },
        success: function(data) {
            $('#keyboard').modal('close');
            if (data.c == 0) {
                window.location.href = 'pay_success.html?payCount=' + getQueryString('payCount') + '&mode=balance';
            } else {
                showError(data.m);
            }
        },
        error: function(data) {
            $('#keyboard').modal('close');
            showError(data.m);
        }
    });
}

//键盘事件绑定
function initKeyboard() {
    var keyboard = document.querySelector('.keyboard').querySelectorAll('li');
    for (var i = 0; i < keyboard.length; i++) {
        keyboard[i].addEventListener('click', function() {
            set_num(this.innerHTML)
        }, false);
    }

    function set_num(num) {
        var spans = document.querySelector('.password').querySelectorAll('span');
        if (/[0-9]/.test(num)) {
            var index = 0;
            for (var i = 0; i < spans.length; i++) {
                var val = spans[i].innerHTML;
                index = i;
                if (!val) {
                    spans[i].innerHTML = num;
                    spans[i].setAttribute('data-num', num);
                    setTimeout(function() {
                        spans[i].innerHTML = '*';
                    }, 200);
                    break;
                }
            }
            if (index == 5) {
                var password = '';
                for (var j = 0; j < spans.length; j++) {
                    var val = spans[j].getAttribute('data-num');
                    password += val;
                }
                //在这触发
                balancePay(orderSn, password);
                setTimeout(function() {
                    for (var k = 0; k < spans.length; k++) {
                        spans[k].innerHTML = '';
                        spans[k].setAttribute('data-num', '');
                    }
                }, 300);
            }
        } else if (num == '删除') {
            var index = 0;
            for (var i = 0; i < spans.length; i++) {
                var val = spans[i].innerHTML;
                if (val) {
                    index = i;
                }
            }
            spans[index].innerHTML = '';
            spans[index].setAttribute('data-num', '');
        }
    }
}