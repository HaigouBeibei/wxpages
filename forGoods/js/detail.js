var skus = null;
var selectedSpecs = [];
$(function() {
    initGoods();
    initBuy();
    confirmButtonEvent();
});
// 初始化Banner
function initGoods() {
    // 请求数据
    $.ajax({
        url: baseURL + "action/auth/user/normal/PurchasingAreaGoodsAction/get",
        data: {
            id: getQueryString("id")
        },
        error: function(data) {
            showError(data.m);
        },
        success: function(data) {
            console.log(data);
            if (data.c == 0) {
                var datas = data.d;
                //轮播图
                skus = data.d.skus;
                initSlide(datas);
                initGoodsInfo(datas);
            } else {
                showError(data.m);
            }
        }
    });
}

//初始化轮播图
function initSlide(data) {
    var appendContent = '';
    if (!isStringEmpty(data.videoDetailPage)) {
        appendContent += '<li><video id="my-video" class="video-js" controls playsinline="true" webkitPlaysinline="true" width="' + $(window).width() + '">';
        appendContent += '<source src="' + baseURL + data.videoDetailPage + '" type="video/mp4">';
        appendContent += '<p class="vjs-no-js">你的设备不支持播放视频</p>';
        appendContent += '</video></li>';
    }
    var datas = data.imgsDetailPage.split(",");
    // 写入页面
    // 清空内容
    $("#Banner .am-slides").empty();
    for (const key in datas) {
        if (datas.hasOwnProperty(key)) {
            appendContent += '<li><img src="' + baseURL + datas[key] + '" /></li>';
        }
    }
    $("#Banner .am-slides").append(appendContent);
    // 生效
    var $slider = $("#Banner").flexslider({
        easing: "swing",
        slideshow: false,
        touch: true,
        smoothHeight: true
    });

    if (!isStringEmpty(data.videoDetailPage)) {
        var player = videojs('my-video', {
            autoplay: 'muted'
        });
        // or
        player.autoplay('muted');
    }
}
//初始化商品信息
function initGoodsInfo(datas) {
    //title
    $("#goods_title").text(datas.name);
    //price
    $('.price').html('<strong>￥' + handlePrice(datas.price) + '</strong>');
    //content
    var content = "";
    for (key in datas.imgsDetailPageCotent) {
        if (datas.imgsDetailPageCotent.hasOwnProperty(key)) {
            content += '<img src="' + baseURL + datas.imgsDetailPageCotent[key].path + '" class="am-img-responsive am-center" />';
        }
    }
    $("#content").empty().append(content);

    $('#sku_count_input').attr('max-value', datas.stockQuantity);
    $('#sku_count_input').attr('min-value', datas.minimumPiecesPerOrder);
    $('#sku_count_input').val(datas.minimumPiecesPerOrder);
    $('#max-value').text('库存：' + datas.stockQuantity);
    $('#min-value').text('最少进货量：' + datas.minimumPiecesPerOrder);
    $('#confirmButton').attr('goodsId', datas.id);
    initPlusReduce();
}

//加入购物车   或   立即购买
function initBuy() {
    $('#joinCart,#buyNow').click(function() {
        if ($(this).attr('id') == 'joinCart') {
            $('#confirmButton').attr('action', 'joinCart');
        } else if ($(this).attr('id') == 'buyNow') {
            $('#confirmButton').attr('action', 'buyNow');
        }
        $('#my-actions').modal();
    });
}
//最终确定按钮
function confirmButtonEvent() {
    $('#confirmButton').click(function() {
        that = $(this);
        if (that.attr('action') == 'joinCart') {
            if (that.attr('skuid') != null && that.attr('skuid') != '') {
                if (parseInt($('#sku_count_input').val()) > 0) {
                    $.ajax({
                        url: baseURL + "action/auth/user/normal/MerchantShopCartAction/add",
                        data: {
                            skuId: that.attr('skuid'),
                            count: $('#sku_count_input').val()
                        },
                        error: function(data) {
                            showError(data.m);
                        },
                        success: function(data) {
                            console.log(data);
                            if (data.c == 0) {
                                $('#my-actions').modal('close');
                                alert('加入购物车成功！');
                            } else {
                                $('#my-actions').modal('close');
                                alert(data.m);
                            }
                        }
                    });
                } else {
                    alert('该件商品库存不足');
                }
            } else {
                $('#my-actions').modal('close');
                alert('请选择规格');
            }

        } else if ($(this).attr('action') == 'buyNow') {
            if (that.attr('goodsId') != null && that.attr('goodsId') != '') {
                if (parseInt($('#sku_count_input').val()) > 0) {
                    goodsId = that.attr('goodsId');
                    console.log(goodsId);
                    count = $('#sku_count_input').val();
                    console.log(count);
                    note = $('#buyContent').val();
                    console.log(note);

                    $.ajax({
                        url: baseURL + 'action/auth/user/normal/PurchasingAreaGoodsOrderWholesaleAction/orderGenerate',
                        data: {
                            goodsId: goodsId,
                            count: count,
                            note: note
                        },
                        success: function(data) {
                            console.log(data);
                            if (data.c == 0) {
                                window.location.href = 'pay.html?order_id=' + data.d.orderId + '&payCount=' + data.d.amount + '&isWhose=' + '1';
                            } else {
                                showError(data.m);
                            }
                        },
                        error: function(data) {
                            showError(data.m);
                        }
                    });

                    //检测收货地址
                    // myAddress = getMyAddress();
                    // var addressID = '';
                    // console.log(myAddress);
                    // if (myAddress.list != null && myAddress.list != '') {
                    //     //for (const x in myAddress.list) {
                    //     //if (myAddress.list.hasOwnProperty(x)) {
                    //     //if (myAddress.list[x].isDefault == "1") {
                    //     addressID = myAddress.list[0].id;
                    //     //}
                    //     //}
                    //     //}
                    //     window.location.href = baseURL + 'wxpages/classify/orderPreview.html?skuID=' + skuID + '&count=' + count + '&deliveryAddressId=' + addressID + '&type=goodsDetail';
                    // } else {
                    //     $('#my-actions').modal('close');
                    //     $('#address-prompt').modal({
                    //         onConfirm: function(e) {
                    //             window.location.href = baseURL + 'wxpages/i/wh-myAddress.html';
                    //         }
                    //     });
                    // }

                } else {
                    alert('该件商品库存不足');
                }
            } else {
                $('#my-actions').modal('close');
                alert('请选择规格');
            }
        }
    });
}


//加减号
function initPlusReduce() {
    //加号按钮
    $("#sku_count_plus").click(function() {
        console.log('plus');
        var countValue = parseInt($(this).prev().val());
        var maxValue = parseInt($(this).prev().attr("max-value"));
        console.log(maxValue);
        var newValue = parseInt(countValue) + 1;
        var pop = $(this).prev().popover({
            theme: "danger sm"
        });
        pop.popover("setContent", "已超过最大购买数");
        if (newValue > maxValue) {
            pop.popover("open");
        } else {
            pop.popover("close");
            $(this).prev().val(newValue);
        }
        setTimeout(function() {
            pop.popover('close');
        }, 2000);
    });
    //减号按钮
    $("#sku_count_reduce").click(function() {
        var countValue = parseInt($(this).next().val());
        var minValue = parseInt($(this).next().attr("min-value"));
        var newValue = parseInt(countValue) - 1;
        var pop = $(this).next().popover({
            theme: "danger sm"
        });
        pop.popover("setContent", "至少购买" + minValue + "件商品");
        if (newValue < minValue) {
            pop.popover("open");
        } else {
            pop.popover("close");
            $(this).next().val(newValue);
        }
        setTimeout(function() {
            pop.popover('close');
        }, 2000);
    });
}