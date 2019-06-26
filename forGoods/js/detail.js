var skus = null;
var selectedSpecs = [];
$(function() {
    initGoods();
    initPlusReduce();
    initBuy();
    confirmButtonEvent();
});
// 初始化Banner
function initGoods() {
    // 请求数据
    $.ajax({
        url: baseURL + "action/MerchantGoodsAction/getGoodsDetail",
        data: {
            id: getQueryString("gid")
        },
        error: function(data) {
            showError("唔。。。服务器开了个小差，导致页面载入失败，放心，当你看到这个提示的时候，那个可怜的程序员小哥哥又被扣钱了，嘻嘻。");
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
                //showError("唔。。。服务器开了个小差，导致页面载入失败，放心，当你看到这个提示的时候，那个可怜的程序员小哥哥又被扣钱了，嘻嘻。");
            }
        }
    });
}

//初始化轮播图
function initSlide(data) {
    var datas = data.imgsDetailPage.split(",");
    // 写入页面
    // 清空内容
    $("#Banner .am-slides").empty();
    for (const key in datas) {
        if (datas.hasOwnProperty(key)) {
            $("#Banner .am-slides").append('<li><img src="' + baseURL + datas[key] + '" /></li>');
        }
    }
    // 生效
    var $slider = $("#Banner").flexslider({
        easing: "swing",
        touch: true,
        smoothHeight: true
    });
}
//初始化商品信息
function initGoodsInfo(datas) {
    //title
    $("#goods_title").text(datas.name);
    //price
    $('.price').html('<strong>￥' + handlePrice(datas.minPrice) + ' <span class="am-icon-minus"></span>￥' + handlePrice(datas.maxPrice) + '</strong>');
    //content
    var content = "";
    for (key in datas.imgsDetailPageCotent) {
        if (datas.imgsDetailPageCotent.hasOwnProperty(key)) {
            content += '<img src="' + baseURL + datas.imgsDetailPageCotent[key].path + '" class="am-img-responsive am-center" />';
        }
    }
    $("#content").empty().append(content);
    //sku
    $('#sku_goods_img').prop('src', baseURL + datas.imgListPage);
    $('#sku_price').text('￥' + handlePrice(datas.minPrice));
    $('#sku_stock').text('库存：请选择规格');
    var skuContent = '';
    for (key in datas.specs) {
        if (datas.specs.hasOwnProperty(key)) {
            skuContent += '<div class="am-g am-margin-top-xs">';
            skuContent += '<p class="am-text-sm am-text-left am-padding-left-sm am-margin-bottom-xs"><strong>' + datas.specs[key].groupName + '</strong></p>';
            skuContent += '</div>';
            skuContent += '<div class="am-g specsArea">'
            var specsValueData = datas.specs[key].values;
            for (k in specsValueData) {
                if (specsValueData.hasOwnProperty(k)) {
                    skuContent += '<button type="button" class="am-btn am-btn-default am-round am-btn-xs" spec_id="' + specsValueData[k].id + '">' + specsValueData[k].item + '</button>'
                }
            }
            skuContent += '</div>';
        }
    }
    $('#skuButtonsArea').empty().append(skuContent);
    //sku Event
    skuButtonsEvent();
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
            if (that.attr('skuid') != null && that.attr('skuid') != '') {
                if (parseInt($('#sku_count_input').val()) > 0) {
                    skuID = that.attr('skuid');
                    count = $('#sku_count_input').val();
                    //检测收货地址
                    myAddress = getMyAddress();
                    var addressID = '';
                    console.log(myAddress);
                    if (myAddress.list != null && myAddress.list != '') {
                        //for (const x in myAddress.list) {
                        //if (myAddress.list.hasOwnProperty(x)) {
                        //if (myAddress.list[x].isDefault == "1") {
                        addressID = myAddress.list[0].id;
                        //}
                        //}
                        //}
                        window.location.href = baseURL + 'wxpages/classify/orderPreview.html?skuID=' + skuID + '&count=' + count + '&deliveryAddressId=' + addressID + '&type=goodsDetail';
                    } else {
                        $('#my-actions').modal('close');
                        $('#address-prompt').modal({
                            onConfirm: function(e) {
                                window.location.href = baseURL + 'wxpages/i/wh-myAddress.html';
                            }
                        });
                    }

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

//规格按钮点击事件
function skuButtonsEvent() {
    $('#skuButtonsArea .am-g button').click(function() {
        var that = $(this);
        that.addClass('selected').siblings().removeClass('selected');
        that.parent().attr('spec_id', that.attr('spec_id'));
        skuButtonsTriggerEvent();
    });
}

//规格按钮触发事件
function skuButtonsTriggerEvent() {
    checkValue = $('#skuButtonsArea>.specsArea');
    selectedSpecs = [];
    checkValue.each(function(i) {
        if ($(this).attr('spec_id') != '' && $(this).attr('spec_id') != null) {
            selectedSpecs.push($(this).attr('spec_id'));
        }
    });
    var finalSelectedSpecs = selectedSpecs.sort().join(':');
    if (checkValue.length == selectedSpecs.length) {
        for (const key in skus) {
            if (skus.hasOwnProperty(key)) {
                if (finalSelectedSpecs == skus[key].specIds) {
                    $('#sku_goods_img').attr('src', baseURL + skus[key].img);
                    $('#sku_price').text('￥' + handlePrice(skus[key].price));
                    $('#sku_stock').text('库存：' + skus[key].stockQuantity);
                    $('#confirmButton').attr('skuid', skus[key].id);
                    stockQuantity = parseInt(skus[key].stockQuantity);
                    if (stockQuantity > 0) {
                        $('#sku_count_input').val(1);
                        $('#sku_count_input').attr('max-value', skus[key].stockQuantity);
                    } else {
                        $('#sku_count_input').val(0);
                        $('#sku_count_input').attr('max-value', 0);
                    }
                }
            }
        }
    }
    //console.log(finalSelectedSpecs);
}

//加减号
function initPlusReduce() {
    //加号按钮
    $("#sku_count_plus").click(function() {
        var countValue = parseInt($(this).prev().val());
        var maxValue = parseInt($(this).prev().attr("max-value"));
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
        var newValue = parseInt(countValue) - 1;
        var pop = $(this).next().popover({
            theme: "danger sm"
        });
        pop.popover("setContent", "至少购买一件商品");
        if (newValue < 1) {
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