$(function() {
    //初始化默认方式
    var payment = $('input[data-am-ucheck]').eq(0).val();
    initCheck();
    //确认支付按钮事件
    initConfirmPayButtonEvent();
});

//支付方式选择框
function initCheck() {
    $('input[data-am-ucheck]').click(function() {
        $('input[data-am-ucheck]').uCheck('uncheck');
        $(this).uCheck('check');
        payment = $(this).val();
        console.log(payment);
    });
}

//确认支付按钮事件
function initConfirmPayButtonEvent() {
    $(this).click(function() {
        $.ajax({
            url: baseURL + '',
            data: {
                payment: payment,
            },
            success: function(data) {
                if (data.c == 0) {
                    //...
                }
            },
            error: function(data) {
                showError(data.m);
            }
        });
    });
}