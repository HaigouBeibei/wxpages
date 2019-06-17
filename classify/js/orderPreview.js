$(function() {
    getOrderData();
});

function getOrderData() {
    type = getQueryString('type');
    settlementInfo = {};
    if (type == 'goodsDetail') {
        settlementInfo = JSON.stringify({
            "method": 'goodsDetail',
            "id": getQueryString('skuID'),
            "count": getQueryString('count')
        });
        getData(settlementInfo);
    } else if (type == 'cart') {
        settlementInfo = JSON.stringify({
            "method": 'cart',
        });
        getData(settlementInfo);
    }
}

function getData(settlementInfo) {
    $.ajax({
        url: baseURL + 'action/auth/user/normal/MerchantShopOrderAction/orderPreview',
        data: {
            settlementInfo: settlementInfo,
            deliveryAddressId: getQueryString('deliveryAddressId')
        },
        success: function(data) {
            console.log(data);
            if (data.c == 0) {
                writeData(data.d);
                initPostMan(data.d);
            } else {
                showError(data.m);
            }
        },
        error: function(data) {
            showError(data.m);
        }
    });
}

function initPostMan(data) {
    postHref = window.location.href.substring(0, window.location.href.indexOf('deliveryAddressId') - 1);
    $('#postMan').text('收货人：' + data.addressInfo.recipients + ' ' + data.addressInfo.contactNumber);
    $('#postAddress').text('收货地址：' + data.addressInfo.provinceName + data.addressInfo.cityName + data.addressInfo.districtName + ' ' + data.addressInfo.detail);
    $('#postHref').attr('href', baseURL + 'wxpages/i/wh-myAddress.html?callback=' + '//////' + postHref + '////////');
}

function writeData(data) {
    appendContent = '';
    if (data.listValid.length > 0) {
        for (const key in data.listValid) {
            if (data.listValid.hasOwnProperty(key)) {
                appendContent += '<div class="am-g goodsInfo am-margin-top-sm am-padding-xs">';
                appendContent += '<h6 class="am-link-muted">' + data.listValid[key].shopName + '</h6>';
                if (data.listValid[key].skus.length > 0) {
                    for (const x in data.listValid[key].skus) {
                        if (data.listValid[key].skus.hasOwnProperty(x)) {
                            appendContent += '<div class="am-u-sm-3 am-text-center am-padding-0">';
                            appendContent += '<img src="' + baseURL + data.listValid[key].skus[x].img + '" class="am-img-responsive am-center" />';
                            appendContent += '</div>';
                            appendContent += '<div class="am-u-sm-9">';
                            appendContent += '<p class="am-margin-0">' + data.listValid[key].skus[x].name + '</p>';
                            appendContent += '<p class="skuName am-margin-0">' + data.listValid[key].skus[x].specText + '</p>';
                            appendContent += '<p class="am-margin-0 am-text-right">运费 ：￥' + data.listValid[key].skus[x].freight + '</p>';
                            appendContent += '<p class="price am-text-right am-margin-top-0 am-margin-bottom-sm">￥' + handlePrice(data.listValid[key].skus[x].price) + ' <span class="am-icon-remove"></span> ' + data.listValid[key].skus[x].count + '</p>';
                            appendContent += '</div>';
                        }
                    }
                }
                appendContent += '<div class="am-cf"></div>';
                appendContent += '<div class="am-u-sm-12 divsion"></div>';
                appendContent += '<p class="am-text-right am-margin-xs am-margin-bottom-0">共' + data.listValid[key].subtotalCount + '件商品，小计：<span class="am-text-danger">￥' + handlePrice(data.listValid[key].subtotalPrice) + '</span></p>';
                appendContent += '</div>';
            }
        }
    }
    $('#goodsList').empty();
    $('#goodsList').append(appendContent);
    $('#finalCount').text('￥' + handlePrice(data.amount));
}