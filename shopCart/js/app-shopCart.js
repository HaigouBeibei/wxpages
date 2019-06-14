$(function() {
    init();
});

function init() {
    $.ajax({
        url: baseURL + 'action/auth/user/normal/MerchantShopCartAction/list',
        error: function() {
            showError('服务器开了点小差，程序员小哥哥正在抓紧抢救。');
        },
        success: function(data) {
            console.log(data);
            datas = data.d;
            if (datas.listInvalid.length == 0 && datas.listValid.length == 0) {
                $('#emptyCart').show();
                $('#cartList').hide();
                $('.delActionArea').hide();
                $('.settle').hide();
            } else {
                initCartData(datas);
            }
        }
    });
}

function initCartData(data) {
    appendContent = '';
    //有效商品
    for (const key in data.listValid) {
        if (data.listValid.hasOwnProperty(key)) {
            appendContent += '<table class="cartProductArea am-table am-table-centered am-table-compact am-center am-margin-top-xs">';
            appendContent += '<thead>';
            appendContent += '<tr>';
            appendContent += '<th class="am-text-middle">';
            appendContent += '<label class="am-checkbox am-warning">';
            checked = '';
            if (data.listValid[key].selected == 'Y') {
                checked = 'checked="checked"';
            }
            appendContent += '<input type="checkbox"  value="' + data.listValid[key].shopId + '" data-am-ucheck ' + checked + ' class="am-ucheck-checkbox shopSelect" />';
            appendContent += '<span class="am-ucheck-icons"><i class="am-icon-unchecked"></i><i class="am-icon-checked"></i></span>';
            appendContent += '</label>';
            appendContent += '</th>';
            appendContent += '<th class="am-text-middle am-text-left">';
            appendContent += '<img src="' + baseURL + data.listValid[key].shopIcon + '" style="width:23px;height:23px;margin-top:-4px;" />';
            appendContent += ' ' + data.listValid[key].shopName;
            appendContent += '<span style="text-indent: 0em;" class="am-icon-chevron-right"></span>';
            appendContent += '</th>';
            appendContent += '</tr>';
            appendContent += '</thead>';
            appendContent += '<tbody>';
            for (const k in data.listValid[key].cartList) {
                if (data.listValid[key].cartList.hasOwnProperty(k)) {
                    appendContent += '<tr>';
                    appendContent += '<td class="am-text-middle">';
                    appendContent += '<label class="am-checkbox am-warning">';
                    checkedInner = '';
                    if (data.listValid[key].cartList[k].selected == 'Y') {
                        checkedInner = 'checked="checked"';
                    }
                    appendContent += '<input type="checkbox" value="' + data.listValid[key].cartList[k].id + '" data-am-ucheck ' + checkedInner + ' class="am-ucheck-checkbox singleSelect">';
                    appendContent += '<span class="am-ucheck-icons"><i class="am-icon-unchecked"></i><i class="am-icon-checked"></i></span>';
                    appendContent += '</label>';
                    appendContent += '</td>';
                    appendContent += '<td class="am-text-middle">';
                    appendContent += '<div class="am-cf am-margin-top-xs am-margin-bottom-xs">';
                    appendContent += '<p class="am-align-left am-margin-bottom-0">';
                    appendContent += '<img src="' + baseURL + data.listValid[key].cartList[k].img + '" class="am-margin-top-xs" width="70" height="70" alt="" />';
                    appendContent += '</p>';
                    appendContent += '<p class="am-margin-0 am-text-sm">' + data.listValid[key].cartList[k].goodsName + '</p>';
                    appendContent += '<div class="priceArea am-margin-top-xs">';
                    appendContent += '<span class="am-fl am-margin-top-xs am-margin-right-xs am-text-danger">￥' + handlePrice(data.listValid[key].cartList[k].price) + '</span>';
                    appendContent += '<div class="am-input-group am-input-group-sm am-fr">';
                    appendContent += '<span class="am-input-group-label sc-reduce"><i class="am-icon-minus"></i></span>';
                    appendContent += '<input type="text" class="am-form-field am-text-center am-padding-left-xs am-padding-right-xs" cartID="' + data.listValid[key].cartList[k].id + '" skuID="' + data.listValid[key].cartList[k].skuId + '" value="' + data.listValid[key].cartList[k].count + '" max-value="' + data.listValid[key].cartList[k].stockQuantity + '">';
                    appendContent += '<span class="am-input-group-label sc-plus"><i class="am-icon-plus"></i></span>';
                    appendContent += '</div>';
                    appendContent += '</div>';
                    appendContent += '</div>';
                    appendContent += '</td>';
                    appendContent += '</tr>';

                }
            }
            appendContent += '</tbody>';
            appendContent += '</table>';
        }
    }
    //无效商品
    if (data.listInvalid.length > 0) {
        appendContent += '<table class="cartProductArea am-table am-table-centered am-table-compact am-center am-margin-top-xs">';
        appendContent += '<thead>';
        appendContent += '<tr>';
        appendContent += '<th class="am-text-middle"></th>';
        appendContent += '<th class="am-text-middle am-text-left am-text-sm"><span class="am-text-danger">失效商品（' + data.listInvalid.length + '）</span></th>';
        appendContent += '</tr>';
        appendContent += '</thead>';
        appendContent += '<tbody>';
        for (const x in data.listInvalid) {
            if (data.listInvalid.hasOwnProperty(x)) {
                appendContent += '<tr>';
                appendContent += '<td class="am-text-middle"> </td>';
                appendContent += '<td class="am-text-middle">';
                appendContent += '<div class="am-cf am-margin-top-xs am-margin-bottom-xs">';
                appendContent += '<p class="am-align-left am-margin-bottom-0">';
                appendContent += '<img src="' + baseURL + data.listInvalid[x].img + '" class="am-margin-top-xs" width="70" height="70" alt="" />';
                appendContent += '</p>';
                appendContent += '<p class="am-margin-0 am-text-sm">' + data.listInvalid[x].goodsName + '</p>';
                appendContent += '<div class="priceArea am-margin-top-xs">';
                appendContent += '<span class="am-fl am-margin-top-xs am-margin-right-xs am-text-danger am-text-sm">此商品不能购买</span>';
                appendContent += '<button class="am-btn am-btn-danger am-btn-xs clearInvalidButton" cartID="' + data.listInvalid[x].id + '">删除</button>';
                appendContent += '</div>';
                appendContent += '</div>';
                appendContent += '</td>';
                appendContent += '</tr>';
            }
        }
        appendContent += '</tbody>';
        appendContent += '</table>';

    }

    $('#cartList').empty();
    $('#cartList').append(appendContent);
    //初始化加减按钮
    initPlusReduce();
    //全选状态按钮
    if (data.allSelected == 'Y') {
        $('#allChoose').uCheck('check').attr('YN', 'Y');
    } else {
        $('#allChoose').uCheck('uncheck').attr('YN', 'N');
    }
    //总价
    $('#allPrice').text('￥' + handlePrice(data.amount));
    //单选框事件
    singleSelectedButtonEvent();
    //商家单选框事件
    shopSelectedButtonEvent();
    //全选框事件
    allChooseEvent();
    //清除无效商品
    clearInvalidEvent();
    //删除购物车
    delCartGoodsEvent();
}

//删除购物车中商品
function delCartGoodsEvent() {
    $('#delCartButton').off('click').on('click', function() {
        var delGoodsIDs = [];
        $('.singleSelect').each(function(x) {
            if ($(this).attr('checked') == 'checked') {
                delGoodsIDs.push($(this).val());
            }
        });
        if (delGoodsIDs.length > 1) {
            delGoodsIDs = delGoodsIDs.join(',');
        } else {
            delGoodsIDs = delGoodsIDs.toString();
        }
        $.ajax({
            url: baseURL + 'action/auth/user/normal/MerchantShopCartAction/delete',
            data: {
                ids: delGoodsIDs
            },
            success: function(data) {
                if (data.c == 0) {
                    initCartData(data.d);
                } else {
                    alert(data.m);
                }
            },
            error: function(data) {
                alert(data.m);
            }
        });
    });
}
//清除失效商品事件
function clearInvalidEvent() {
    $('.clearInvalidButton').off('click').on('click', function() {
        cartID = $(this).attr('cartID');
        $.ajax({
            url: baseURL + 'action/auth/user/normal/MerchantShopCartAction/delete',
            data: {
                ids: cartID
            },
            success: function(data) {
                if (data.c == 0) {
                    initCartData(data.d);
                } else {
                    alert(data.m);
                }
            },
            error: function(data) {
                alert(data.m);
            }
        });
    });
}

//单选框事件
function singleSelectedButtonEvent() {
    $('.singleSelect').off('click').on('click', function() {
        checked = $(this).attr('checked') == 'checked' ? 'N' : 'Y';
        that = $(this);
        $.ajax({
            url: baseURL + 'action/auth/user/normal/MerchantShopCartAction/update',
            data: {
                id: that.val(),
                selected: checked
            },
            success: function(data) {
                if (data.c == 0) {
                    initCartData(data.d);
                } else {
                    alert(data.m);
                }
            },
            error: function(data) {
                alert(data.m);
            }
        });
    });
}
//商家单选框事件
function shopSelectedButtonEvent() {
    $('.shopSelect').off('click').on('click', function() {
        checked = $(this).attr('checked') == 'checked' ? 'N' : 'Y';
        that = $(this);
        $.ajax({
            url: baseURL + 'action/auth/user/normal/MerchantShopCartAction/changeAllSelectedState',
            data: {
                type: 'shop',
                shopId: that.val(),
                state: checked
            },
            success: function(data) {
                if (data.c == 0) {
                    initCartData(data.d);
                } else {
                    alert(data.m);
                }
            },
            error: function(data) {
                alert(data.m);
            }
        });
    });
}
//全选框事件
function allChooseEvent() {
    $('#allChoose').off('click').on('click', function() {
        checked = $(this).attr('YN') == 'Y' ? 'N' : 'Y';
        that = $(this);
        $.ajax({
            url: baseURL + 'action/auth/user/normal/MerchantShopCartAction/changeAllSelectedState',
            data: {
                type: 'all',
                state: checked
            },
            success: function(data) {
                if (data.c == 0) {
                    initCartData(data.d);
                } else {
                    alert(data.m);
                }
            },
            error: function(data) {
                alert(data.m);
            }
        });
    });
}

//初始化加减按钮
function initPlusReduce() {
    //加号按钮
    $(".sc-plus").off('click').on('click', function() {
        that = $(this);
        var countValue = parseInt(that.prev().val());
        var maxValue = parseInt(that.prev().attr("max-value"));
        var newValue = parseInt(countValue) + 1;
        var pop = that.prev().popover({
            theme: "danger sm"
        });
        pop.popover("setContent", "已超过最大购买数");
        if (newValue > maxValue) {
            pop.popover("open");
        } else {
            pop.popover("close");
            countAjax(newValue, that.prev().attr('cartID'), that.prev().attr('skuID'));
        }
    });
    //减号按钮
    $(".sc-reduce").off('click').on('click', function() {
        that = $(this);
        var countValue = parseInt(that.next().val());
        var newValue = parseInt(countValue) - 1;
        var pop = that.next().popover({
            theme: "danger sm"
        });
        pop.popover("setContent", "至少购买一件商品");
        if (newValue < 1) {
            pop.popover("open");
        } else {
            pop.popover("close");
            countAjax(newValue, that.next().attr('cartID'), that.next().attr('skuID'));
        }
    });
}

function countAjax(count, cartID, skuID) {
    result = false;
    $.ajax({
        url: baseURL + 'action/auth/user/normal/MerchantShopCartAction/adjust',
        data: {
            countAdjustTo: count,
            cartId: cartID,
            skuId: skuID
        },
        success: function(data) {
            if (data.c == 0) {
                initCartData(data.d);
                result = true;
            } else {
                alert(data.m);
            }
        },
        error: function(data) {
            alert(data.m);
        }
    });
    return result;
}