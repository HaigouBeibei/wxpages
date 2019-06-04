var baseURL = "https://tongmeng.haigoubeibei.com/hiGou/";
$(function(goodtyep) {
    intiContaner();
});


//   function getQueryString(name) {
//     var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
//     var r = window.location.search.substr(1).match(reg);
//     if (r != null) {
//         return unescape(r[2]);
//     }
//     return null;
// }
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
                console.log("initProduct error.");
            }
        }
    })
}

function getGoodList(datas) {
    for (const key in datas) {
        if (datas.hasOwnProperty(key)) {
            var appendText = "";
            appendText += '<div class="am-u-sm-6">';
            appendText += '<div class="am-thumbnail">';
            appendText += '<a href="' + baseURL + 'wxpages/classify/goods_detail.html?gid=' + datas[key].id + '">';
            appendText += '<img src="' + baseURL + datas[key].imgListPage + '" alt="" /></a>';
            appendText += '<a href="' + baseURL + 'wxpages/classify/goods_detail.html?gid=' + datas[key].id + '" class="am-link-muted">'
            appendText += '<div class="am-thumbnail-caption am-padding-xs">';
            appendText += '<h4 class="am-margin-bottom-0">' + datas[key].name + "</h4>";
            appendText += '<span class="price am-text-lg">￥' + datas[key].listPagePriceCurrent + "</span>";
            appendText += '<span class="oldPrice am-text-xs"><del>￥' + datas[key].listPagePriceOriginal + "</del></span>";
            appendText += '<a class="am-badge am-badge-warning am-round">包邮</a>';
            appendText += "</div>";
            appendText += "</a>";
            appendText += "</div>";
            appendText += "</div>";
            $(".am-g").append(appendText);
        }
    }
}