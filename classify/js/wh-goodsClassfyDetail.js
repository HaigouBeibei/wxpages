var baseURL = "https://tongmeng.haigoubeibei.com/hiGou/";
$(function(goodtyep) {
    intiContaner();
});

// 初始化数据
function intiContaner() {
    // 请求数据
    loadList(1, "time", "desc", "1");
}

//清空数据
function loadList(page, condition, direction, isEmpty) {
    var typeId = getQueryString("goodType");
    $.ajax({
        url: baseURL + "action/MerchantGoodsAction/listByTypeId",
        data: {
            page: page,
            limit: 20,
            typeId: typeId,
            condition: condition,
            direction: direction,
        },
        success: function(data) {
            if (data.c == 0) {
                // 取数据
                var datas = data.d.list;
                // 写入页面
                // 清空内容
                if (isEmpty == "1") {
                    $(".am-g").empty();
                }
                getGoodList(datas);
            } else {
                showError(data.m);
            }
        }
    })
}

function getGoodList(datas) {
    var _text = document.querySelector('.wh-refresh')
    if (datas.length <= 20) {
        _text.innerText = '没有更多了';
    }
    for (const key in datas) {
        if (datas.hasOwnProperty(key)) {
            var appendText = "";
            appendText += '<div class="am-u-sm-6">';
            appendText += '<div class="am-thumbnail">';
            appendText += '<a href="' + baseURL + 'wxpages/classify/goods_detail.html?gid=' + datas[key].id + '">';
            appendText += '<img class="wh-imgHeight" src="' + baseURL + datas[key].imgListPage + '" alt="" /></a>';
            appendText += '<a href="' + baseURL + 'wxpages/classify/goods_detail.html?gid=' + datas[key].id + '" class="am-link-muted">'
            appendText += '<div class="am-thumbnail-caption am-padding-xs">';
            appendText += '<h4 class="am-margin-bottom-0  line-clamp">' + datas[key].name + "</h4>";
            appendText += '<span class="price am-text-lg wh-priceColor" >￥' + handlePrice(datas[key].listPagePriceCurrent) + "</span>";
            appendText += '<span class="oldPrice am-text-xs"><del>￥' + handlePrice(datas[key].listPagePriceOriginal) + "</del></span>";
            appendText += '<br /><a class="am-badge am-badge-warning am-round">包邮</a>';
            appendText += "</div>";
            appendText += "</a>";
            appendText += "</div>";
            appendText += '<div class="wh-cleanFloat"></div>'
            appendText += "</div>";
            $(".am-g").append(appendText);
        }
    }
}

// 获取当前滚动条的位置 
function getScrollTop() {
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
        scrollTop = document.body.scrollTop;
    }
    return scrollTop;
}
// 获取当前可视范围的高度 
function getClientHeight() {
    var clientHeight = 0;
    if (document.body.clientHeight && document.documentElement.clientHeight) {
        clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
    } else {
        clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
    }
    return clientHeight;
}
// 获取文档完整的高度 
function getScrollHeight() {
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
}