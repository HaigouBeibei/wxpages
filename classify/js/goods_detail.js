$(function() {
    initGoods();
    initPlusReduce();
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
            console.log(data.d);
            if (data.c == 0) {
                var datas = data.d;
                //轮播图
                initSlide(datas);
                initGoodsInfo(datas);
            } else {
                showError("唔。。。服务器开了个小差，导致页面载入失败，放心，当你看到这个提示的时候，那个可怜的程序员小哥哥又被扣钱了，嘻嘻。");
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
            skuContent += '<div class="am-g">'
            var specsValueData = datas.specs[key].values;
            for (k in specsValueData) {
                if (specsValueData.hasOwnProperty(k)) {
                    skuContent += '<button type="button" class="am-btn am-btn-default am-round am-btn-xs">' + specsValueData[k].item + '</button>'
                }
            }
            skuContent += '</div>';
        }
    }
    $('#skuButtonsArea').empty().append(skuContent);
    //sku Event
    skuButtonsEvent();
}

function skuButtonsEvent() {
    $('#skuButtonsArea .am-g button').click(function() {
        $(this).addClass('selected').siblings().removeClass('selected');


        // console.log($(this).parent('.am-g').find('button'));
    });
}

function initPlusReduce() {
    //加号按钮
    $("#sku_count_plus").click(function() {
        var countValue = parseInt($(this).prev().val());
        var maxValue = parseInt($(this).prev().attr("max-value"));
        var newValue = parseInt(countValue) + 1;
        console.log(newValue);
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
    });
    //减号按钮
    $("#sku_count_reduce").click(function() {
        var countValue = parseInt($(this).next().val());
        var newValue = parseInt(countValue) - 1;
        var pop = $(this).next().popover({
            theme: "danger sm"
        });
        pop.popover("setContent", "至少购买一件商品");
        console.log(newValue);
        if (newValue < 1) {
            pop.popover("open");
        } else {
            pop.popover("close");
            $(this).next().val(newValue);
        }
    });
}