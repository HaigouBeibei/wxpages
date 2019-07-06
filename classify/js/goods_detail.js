var skus = null;
var selectedSpecs = [];
var page = getQueryString("page");
if (isStringEmpty(page)) {
    page = 1;
}
$(function() {
    initGoods();
    initPlusReduce();
    initBuy();
    confirmButtonEvent();
    initComment();
    $(".recommendArea").empty();
    getRecom();
    scroll();
});

function getRecom() {
    console.log(page);
    // 请求数据
    $.ajax({
        url: baseURL + "action/MerchantGoodsAction/list",
        data: {
            page: page,
            limit: 20,
            condition: "time",
            direction: "desc"
        },
        async: false,
        success: function(data) {
            //console.log(data);
            //data = $.parseJSON(data);
            if (data.c == 0) {
                if (data.d.list != null) {
                    if (data.d.list.length > 0) {
                        // 取数据
                        var datas = data.d.list;
                        // 写入页面
                        // 清空内容
                        for (const key in datas) {
                            if (datas.hasOwnProperty(key)) {
                                var appendText = "";
                                appendText += '<div class="am-u-sm-6 am-padding-xs">';
                                appendText += '<div class="am-thumbnail am-margin-bottom-xs">';
                                appendText += '<a href="' + baseURL + 'wxpages/classify/goods_detail.html?gid=' + datas[key].id + '&page=' + page + '">';
                                appendText += '<img src="' + baseURL + datas[key].imgListPage + '"  alt=""  /></a>';
                                appendText += '<a href="' + baseURL + 'wxpages/classify/goods_detail.html?gid=' + datas[key].id + '" class="am-link-muted">'
                                appendText += '<div class="am-thumbnail-caption am-padding-xs">';
                                appendText += '<h4 class="am-margin-bottom-0 line-clamp am-text-sm">' + datas[key].name + "</h4>";
                                appendText += '<span class="am-text-lg">￥' + handlePrice(datas[key].listPagePriceCurrent) + "</span>";
                                appendText += '<span class="oldPrice am-text-xs"><del>￥' + handlePrice(datas[key].listPagePriceOriginal) + "</del></span>";
                                //appendText += '<br /><a class="am-badge am-badge-warning am-round">包邮</a>';
                                appendText += "</div>";
                                appendText += "</a>";
                                appendText += "</div>";
                                appendText += "</div>";
                                $(".recommendArea").append(appendText);
                            }
                        }
                    } else {
                        $('#upLoading').html('<p class="am-text-center am-link-muted">我是有底线的！</p>');
                    }
                }
            }
        }
    });
}

function scroll() {
    $('#upLoading').scrollspy({
        animation: 'slide-bottom',
        delay: 200,
        repeat: true
    });
    $('#upLoading').on('inview.scrollspy.amui', function() {
        page++;
        getRecom();
    }).on('outview.scrollspy.amui', function() {
        $('#upLoading').html('<p class="am-text-center am-link-muted">上拉加载更多...</p>');
    });
}

//初始化评论
function initComment() {
    $.ajax({
        url: baseURL + 'action/MerchantGoodsSkuRateAction/list',
        data: {
            goodsId: getQueryString("gid"),
            page: 1,
            limit: 3
        },
        success: function(data) {
            //console.log(data);
            if (data.c == 0) {
                if (data.d.length > 0) {
                    $('#commentList').empty();
                    var appendContent = '';
                    for (const key in data.d) {
                        if (data.d.hasOwnProperty(key)) {
                            appendContent += '<li class="am-comment">';
                            appendContent += '<a>';
                            appendContent += '<img class="am-comment-avatar" src="' + baseURL + data.d[key].avatar + '" />';
                            appendContent += '</a>';
                            appendContent += '<div class="am-comment-main">';
                            appendContent += '<header class="am-comment-hd">';
                            appendContent += '<div class="am-comment-meta">';
                            appendContent += '<a class="am-comment-author">' + data.d[key].nickname + '</a>&nbsp;';
                            appendContent += '<time datetime="">' + data.d[key].createdTime + '</time>';
                            appendContent += '<br /><time datetime="">' + data.d[key].specText + '</time><br />';
                            var y = 5 - data.d[key].rateScore;
                            for (let index = 0; index < data.d[key].rateScore; index++) {
                                appendContent += '<span class="am-icon-star" style="color: #F0250F"></span>';
                            }
                            for (let index = 0; index < y; index++) {
                                appendContent += '<span class="am-icon-star"></span>';
                            }
                            appendContent += '</div>';
                            appendContent += '</header>';
                            appendContent += '<div class="am-comment-bd">';
                            if (data.d[key].content) {
                                appendContent += '<p>' + data.d[key].content + '</p>';
                            } else {
                                appendContent += '<p>该用户没有评论</p>';
                            }
                            if (data.d[key].imgs) {
                                appendContent += '<ul class="am-avg-sm-3">';
                                var images = data.d[key].imgs.split(',');
                                for (const x in images) {
                                    if (images.hasOwnProperty(x)) {}
                                }
                                appendContent += '</ul>';
                            }
                            appendContent += '</div>';
                            appendContent += '</div>';
                            appendContent += '</li>';
                        }
                    }
                    $('#commentList').append(appendContent);
                    $('#commentTitle').html('评论<a href="comment.html?id=' + getQueryString("gid") + '" class="am-fr">查看全部&nbsp;<span class="am-icon-chevron-right"></span></a>')
                } else {
                    $('#commentTitle').html('评论');
                }
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}

// 初始化Banner
function initGoods() {
    // 请求数据
    $.ajax({
        url: baseURL + "action/MerchantGoodsAction/getGoodsDetail",
        data: {
            id: getQueryString("gid")
        },
        error: function(data) {
            no_goods();
        },
        success: function(data) {
            console.log(data);
            if (data.c == 0) {
                var datas = data.d;
                //轮播图
                skus = data.d.skus;
                initSlide(datas);
                initGoodsInfo(datas);
                initJsSdk(data, getQueryString("gid"));
            } else {
                //alert(data.m)
                //showError("唔。。。服务器开了个小差，导致页面载入失败，放心，当你看到这个提示的时候，那个可怜的程序员小哥哥又被扣钱了，嘻嘻。");
                no_goods();
            }
        }
    });
}

function no_goods() {
    $('body').empty();
    var appendContent = '';
    appendContent += '<div class="am-g am-margin-top-xl">';
    appendContent += '<img src="images/no-goods.png" class="am-center am-img-responsive" />';
    appendContent += '<p class="am-text-center">商品过期或不存在</p>';
    appendContent += '</div>';
    appendContent += '<footer class="am-topbar-fixed-bottom am-g">';
    appendContent += '<ul class="am-avg-sm-5">';
    appendContent += '<li><a href="../index.html" class="footer-home am-center am-text-center am-text-sm selected">首页</a></li>';
    appendContent += '<li><a href="" class="footer-customer am-center am-text-center am-text-sm">客服</a></li>';
    appendContent += '<li><a href="index.html" class="footer-class am-center am-text-center am-text-sm">分类</a></li>';
    appendContent += '<li><a href="../shopCart/index.html" class="footer-shoppingcat am-center am-text-center am-text-sm">购物车</a></li>';
    appendContent += '<li><a href="../i/index.html" class="footer-i am-center am-text-center am-text-sm ">我的</a></li>';
    appendContent += '</ul>';
    appendContent += '</footer>';
    $('body').append(appendContent);
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
                        window.location.href = 'orderPreview.html?skuID=' + skuID + '&count=' + count + '&type=goodsDetail&deliveryAddressId=' + addressID;
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