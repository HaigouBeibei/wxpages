var page = 1;
$(function() {
    $('#commentList').empty();
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
        writeData(page);
    }).on('outview.scrollspy.amui', function() {
        $('#upLoading').html('<p class="am-text-center am-link-muted">上拉加载更多...</p>');
    });
}

function initData() {
    $.ajax({
        url: baseURL + 'action/MerchantGoodsSkuRateAction/list',
        data: {
            goodsId: getQueryString("id"),
            page: page,
            limit: 10
        },
        success: function(data) {
            //console.log(data);
            if (data.c == 0) {
                if (data.d.length > 0) {
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
                            console.log(y);
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
                                    if (images.hasOwnProperty(x)) {
                                        appendContent += '<li><img src="' + baseURL + images[x] + '" class="am-img-responsive am-thumbnail am-margin-bottom-xs"></li>';
                                    }
                                }
                                appendContent += '</ul>';
                            }
                            appendContent += '</div>';
                            appendContent += '</div>';
                            appendContent += '</li>';

                        }
                    }
                    $('#commentList').append(appendContent);
                    scroll();
                } else {
                    $('#commentList').html('<p class="am-text-center">暂无评论</p>');
                }
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}

function writeData(page) {
    $.ajax({
        url: baseURL + 'action/MerchantGoodsSkuRateAction/list',
        data: {
            goodsId: getQueryString("id"),
            page: page,
            limit: 10
        },
        success: function(data) {
            if (data.c == 0) {
                if (data.d.length > 0) {
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
                            appendContent += '</div>';
                            appendContent += '</header>';
                            appendContent += '<div class="am-comment-bd">';
                            appendContent += '<p>' + data.d[key].content + '</p>';
                            if (data.d[key].imgs) {
                                appendContent += '<ul class="am-avg-sm-3">';
                                var images = data.d[key].imgs.split(',');
                                for (const x in images) {
                                    if (images.hasOwnProperty(x)) {
                                        appendContent += '<li><img src="' + baseURL + images[x] + '" class="am-img-responsive am-thumbnail am-margin-bottom-xs"></li>';
                                    }
                                }
                                appendContent += '</ul>';
                            }
                            appendContent += '</div>';
                            appendContent += '</div>';
                            appendContent += '</li>';
                        }
                    }
                    $('#commentList').append(appendContent);
                }
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}