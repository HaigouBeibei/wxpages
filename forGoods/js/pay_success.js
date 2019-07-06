$(function() {
    if (getQueryString('mode') == 'balance') {
        $('#payMode').text('支付方式：钱包余额支付');
    } else if (getQueryString('mode') == 'wechatJsApi') {
        $('#payMode').text('支付方式：微信支付');
    }
    $('#payCount').text('支付金额：￥' + handlePrice(getQueryString('payCount')));
});