var page = 1;
$(function() {
    $('#searchResult').empty();
    initData();
});

function scroll() {
    $('#upLoading').scrollspy({
        animation: 'slide-bottom',
        delay: 200,
        repeat: true
    });
    $('#upLoading').on('inview.scrollspy.amui', function() {
        page++;
        console.log(page);
        initData();
    }).on('outview.scrollspy.amui', function() {
        $('#upLoading').html('<p class="am-text-center am-link-muted">上拉加载更多...</p>');
    });
}

function initData() {
    search = getQueryString('search');
    console.log(search);
    $.ajax({
        url: baseURL + 'action/MerchantGoodsAction/list',
        data: {
            search: search,
            page: page,
            limit: 6,
            condition: 'time',
            direction: 'desc'
        },
        success: function(data) {
            console.log(data);
            if (data.c == 0) {
                if (data.d.list.length > 0) {
                    var appendContent = '';
                    for (const key in data.d.list) {
                        if (data.d.list.hasOwnProperty(key)) {
                            //data.d.list[key].
                            appendContent += '<div class="am-u-sm-6">';
                            appendContent += '<div class="am-thumbnail">';
                            appendContent += '<a href="goods_detail.html?gid=' + data.d.list[key].id + '"><img src="' + baseURL + data.d.list[key].imgListPage + '" style="height:135px;" /></a>';
                            appendContent += '<a href="goods_detail.html?gid=' + data.d.list[key].id + '" class="am-link-muted">';
                            appendContent += '<div class="am-thumbnail-caption am-padding-xs">';
                            appendContent += '<h4 class="am-margin-bottom-0 am-text-truncate am-text-xs">' + data.d.list[key].name + '</h4>';
                            appendContent += '<span class="price am-text-lg">￥' + handlePrice(data.d.list[key].listPagePriceCurrent) + '</span>';
                            appendContent += '<span class="oldPrice am-text-xs"><del>￥' + handlePrice(data.d.list[key].listPagePriceOriginal) + '</del></span>';
                            //appendContent += '<a class="am-badge am-badge-warning am-round">包邮</a>';
                            appendContent += '</div>';
                            appendContent += '</a>';
                            appendContent += '</div>';
                            appendContent += '</div>';
                        }
                    }
                    $('#searchResult').append(appendContent);
                    scroll();
                } else {
                    $('#upLoading').html('<p class="am-text-center am-link-muted">没有更多结果</p>');
                }
            }
        },
        error: function(data) {
            showError(data);
        }
    });
}