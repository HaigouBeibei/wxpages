var page = 1;
$(function() {
    initData();
    scroll();
});

function scroll() {
    $('#upLoading').scrollspy({
        animation: 'slide-bottom',
        delay: 200,
        repeat: true
    });
    $('#upLoading').on('inview.scrollspy.amui', function() {
        page++;
        getData(page);
    }).on('outview.scrollspy.amui', function() {
        $('#upLoading').html('<p class="am-text-center am-link-muted">上拉加载更多...</p>');
    });
}

function initData() {
    $('#goodsList').empty();
    getData(page);
}

function writeData(data) {
    appendContent = '';
    if (data != null) {
        if (data.list.length > 0) {
            for (const key in data.list) {
                if (data.list.hasOwnProperty(key)) {
                    appendContent += '<div class="am-g">';
                    appendContent += '<div class="am-u-sm-5 am-vertical-align">';
                    appendContent += '<a href="detail.html?id=' + data.list[key].id + '"><img src="' + data.list[key].img + '" class="am-img-responsive am-vertical-align-middle" /></a>';
                    appendContent += '</div>';
                    appendContent += '<div class="am-u-sm-7">';
                    appendContent += '<a href="detail.html?id=' + data.list[key].id + '">';
                    appendContent += '<p class="title am-text-sm am-margin-bottom-0 am-text-middle am-margin-top-sm">' + data.list[key].name + '</p>';
                    appendContent += '<p class="sku am-text-xs am-margin-0 am-text-middle">库存：' + data.list[key].stockQuantity + '个（' + data.list[key].minimumPiecesPerOrder + '个起售）</p>';
                    appendContent += '<p class="price am-text-sm am-margin-0 am-text-middle">￥' + handlePrice(data.list[key].price) + '</p>';
                    appendContent += '</a>';
                    appendContent += '</div>';
                    appendContent += '</div>';
                }
            }
        } else {
            $('#upLoading').html('<p class="am-text-center am-link-muted">我是有底线的！</p>');
        }
    }
    $('#goodsList').append(appendContent);
}

function getData(page) {
    $.ajax({
        url: baseURL + "action/auth/user/normal/PurchasingAreaGoodsAction/list",
        data: {
            page: page,
            limit: 6
        },
        async: false,
        success: function(data) {
            if (data.c == "0") {
                writeData(data.d);
            }
        },
        error: function(data) {
            showError(data.m);
        }
    });
}