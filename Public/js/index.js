var page = 1;
$(function() {
    if (!isStringEmpty(getQueryString("page"))) {
        page = Number(getQueryString("page"))
    }
    initBanner();
    initMenu();
    initProduct();
    initSearch();
    initUser();
});

function initUser() {
    $.ajax({
        url: baseURL + "action/auth/user/normal/HxCsUserAction/getBySession",
        success: function(data) {
            if (data.c == 0) {
                //console.log(data);
                userID = data.d.userId;
            }
        }
    });
}

function initMenu() {
    $.ajax({
        url: baseURL + 'action/GlobalSettingsShortcutMenuAction/list',
        success: function(data) {
            if (data.c == 0) {
                console.log(data);

                $('#sMenu').empty();
                appendContent = '';
                for (const key in data.d) {
                    if (data.d.hasOwnProperty(key)) {
                        appendContent += '<li class="am-padding-left-xs">';
                        appendContent += '<a href="classify/wh-categery.html?smid=' + data.d[key].id + '&smtype=' + data.d[key].type + '&smname=' + data.d[key].name + '"><img src="' + baseURL + data.d[key].img + '" style="width:45px;height:45px;margin:0px auto;" class="am-img-responsive am-circle" /></a>';
                        appendContent += '<p class="am-text-xs am-text-center am-margin-top-0 am-margin-bottom-xs">' + data.d[key].name + '</p>';
                        appendContent += '</li>';
                    }
                }
                $('#sMenu').append(appendContent);
            }
        },
        error: function(data) {
            console.log(data);
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
        console.log(page);
        getData(page);
    }).on('outview.scrollspy.amui', function() {
        $('#upLoading').html('<p class="am-text-center am-link-muted">上拉加载更多...</p>');
    });
}

function getData(page) {

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
                                appendText += '<span class="price am-text-lg">￥' + handlePrice(datas[key].listPagePriceCurrent) + "</span>";
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
// 初始化Banner
function initBanner() {
    // 请求数据
    $.ajax({
        url: baseURL + "action/GlobalSettingsAction/getCarousels",
        success: function(data) {
            //data = $.parseJSON(data);
            //console.log(data);
            if (data.c == 0) {
                // 取数据
                var datas = data.d.carousels.split(",");
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
                    controlNav: false,
                    smoothHeight: true
                });
            } else {
                console.log("initBanner error.");
            }
        }
    });
}
//首页商品列表
function initProduct() {
    // 请求数据
    $.ajax({
        url: baseURL + "action/MerchantGoodsAction/list",
        data: {
            page: page,
            limit: 20,
            condition: "time",
            direction: "desc"
        },
        success: function(data) {
            //console.log(data);
            //data = $.parseJSON(data);
            if (data.c == 0) {
                // 取数据
                var datas = data.d.list;
                // 写入页面
                // 清空内容
                $(".recommendArea").empty();
                for (const key in datas) {
                    if (datas.hasOwnProperty(key)) {
                        var appendText = "";
                        appendText += '<div class="am-u-sm-6 am-padding-xs">';
                        appendText += '<div class="am-thumbnail am-margin-bottom-xs">';
                        appendText += '<a href="' + baseURL + 'wxpages/classify/goods_detail.html?gid=' + datas[key].id + "&page=" + page + '">';
                        appendText += '<img src="' + baseURL + datas[key].imgListPage + '"  alt=""  /></a>';
                        appendText += '<a href="' + baseURL + 'wxpages/classify/goods_detail.html?gid=' + datas[key].id + '" class="am-link-muted">'
                        appendText += '<div class="am-thumbnail-caption am-padding-xs">';
                        appendText += '<h4 class="am-margin-bottom-0 line-clamp am-text-sm">' + datas[key].name + "</h4>";
                        appendText += '<span class="price am-text-lg">￥' + handlePrice(datas[key].listPagePriceCurrent) + "</span>";
                        appendText += '<span class="oldPrice am-text-xs"><del>￥' + handlePrice(datas[key].listPagePriceOriginal) + "</del></span>";
                        //appendText += '<br /><a class="am-badge am-badge-warning am-round">包邮</a>';
                        appendText += "</div>";
                        appendText += "</a>";
                        appendText += "</div>";
                        appendText += "</div>";
                        $(".recommendArea").append(appendText);
                    }
                }
                scroll();
            } else {
                console.log("initProduct error.");
            }
        }
    });
}

function initSearch() {
    $('#searchInput').click(function() {
        $('#searchModal').modal('open');
        $('#searchInputTrue').focus();
    });
    $('#searchSubmit').click(function() {
        keyword = $('#searchInputTrue').val();
        if (keyword != '' && keyword != null) {
            window.location.href = 'classify/search.html?search=' + keyword;
        } else {
            alert('请输入搜索内容');
        }
    });
}