$(function() {
    initGoodsInfo();
    initPlusReduce();
});

function initGoodsInfo() {
    $.ajax({
        url: baseURL + 'action/auth/user/normal/PurchasingAreaGoodsOrderWholesaleAction/get',
        data: {
            id: getQueryString('wholesaleOrderId')
        },
        success: function(data) {
            console.log(data);
            if (data.c == 0) {
                $('#goodsThumb').attr('src', baseURL + data.d.goodsImg);
                $('#goodsTitle').text(data.d.goodsName);
                $('#price').text('￥' + handlePrice(data.d.pricePerUnit));
                $('#stock').text('库存：' + data.d.countRemain);
                $('#stockInput').attr('max-value', data.d.countRemain);
                confirmButtonEvent();
            } else {
                showError(data.m);
            }
        },
        error: function(data) {
            showError(data.m);
        }
    });
}

//加减号
function initPlusReduce() {
    //加号按钮
    $("#sku_count_plus").click(function() {
        console.log('plus');
        var countValue = parseInt($('#stockInput').val());
        var maxValue = parseInt($('#stockInput').attr("max-value"));
        console.log(maxValue);
        var newValue = parseInt(countValue) + 1;
        var pop = $('#stockInput').popover({
            theme: "danger sm"
        });
        pop.popover("setContent", "已超过最大购买数");
        if (newValue > maxValue) {
            pop.popover("open");
        } else {
            pop.popover("close");
            $('#stockInput').val(newValue);
        }
        setTimeout(function() {
            pop.popover('close');
        }, 2000);
    });
    //减号按钮
    $("#sku_count_reduce").click(function() {
        var countValue = parseInt($('#stockInput').val());
        var newValue = parseInt(countValue) - 1;
        var pop = $('#stockInput').popover({
            theme: "danger sm"
        });
        pop.popover("setContent", "至少购买1件商品");
        if (newValue < 1) {
            pop.popover("open");
        } else {
            pop.popover("close");
            $('#stockInput').val(newValue);
        }
        setTimeout(function() {
            pop.popover('close');
        }, 2000);
    });
}

function confirmButtonEvent() {
    $('#confirmButton').click(function() {
        count = $('#stockInput').val();
        wholesaleOrderId = getQueryString('wholesaleOrderId');
        $.ajax({
            url: baseURL + 'action/auth/user/normal/PurchasingAreaGoodsOrderRetailAction/getPayArgs',
            data: {
                wholesaleOrderId: wholesaleOrderId,
                count: count
            },
            success: function(data) {
                if (data.c == 0) {
                    //confirm(1112)
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
                                //alert('恭喜，购买成功！');
                                $.ajax({
                                    url: baseURL + 'action/auth/user/normal/PurchasingAreaGoodsOrderRetailAction/get',
                                    data: {
                                        id: data.d.retailOrderId
                                    },
                                    success: function(d) {
                                        //console.log(d);
                                        appendContent = '';
                                        appendContent += '<p class="am-margin-0">商品名称：' + d.d.goodsName + '</p>';
                                        appendContent += '<p class="am-margin-0">购买数量：' + d.d.count + '</p>';
                                        appendContent += '<p class="am-margin-0">总金额：￥' + handlePrice(d.d.amount) + '</p>';
                                        appendContent += '<p class="am-text-success am-text-center am-margin-xs"><span class="am-text-danger"><strong>请将此页面展示给店主</strong></span></p>';
                                        appendContent += '<img src="' + baseURL + d.d.goodsImg + '" class="am-img-responsive am-u-sm-6 am-u-sm-offset-3">';
                                        appendContent += '<p class="am-u-sm-12 am-text-center am-text-primary am-text-sm am-margin-xs">长按下方二维码关注公众号，获取更多优惠资讯</p>';
                                        appendContent += '<img src="images/qr.jpg" class="am-img-responsive am-u-sm-6 am-u-sm-offset-3">';
                                        appendContent += '<div class="am-cf"></div>';
                                        $('#goodsInfo').empty().append(appendContent);
                                        $('#success-popup').modal('open');
                                    }
                                });
                            } else {
                                //目前不知道什么情况代码会运行到这，但为防万一就写它了
                                showError('购买失败！');
                            }
                        },
                        cancel: function(res) {
                            //confirm(JSON.stringify(res))
                            showError('支付失败！您已取消支付！请刷新页面重新支付！');
                        },
                        fail: function(res) {
                            //confirm(JSON.stringify(res))
                            showError('支付失败！请刷新页面重新支付！');
                        }
                    });

                } else {
                    showError(data.m);
                }
            },
            error: function() {
                showError(data.m);
            }
        });
    });
}