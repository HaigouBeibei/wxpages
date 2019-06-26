var baseURL = "https://tongmeng.haigoubeibei.com/hiGou/";
$(function() {
    getPersonalInfo();
    getOrderList();
});

//获取个人信息
function getPersonalInfo() {
    $.ajax({
        url: baseURL + "action/auth/user/normal/HxCsUserAction/getBySession",
        success: function(data) {
            if (data.c == 0) {
                console.log(data);
                $("#avatar").attr("src", baseURL + data.d.avatar);
                $("#nickName").text(data.d.nickname);
                var merchantState = "普通会员";
                switch (data.d.merchantState) {
                    case 1:
                        merchantState = "商家";
                        $('#storeState').text('我的店铺');
                        break;
                    case 2:
                        merchantState = "申请商家中";
                        $('#storeState').text('我要开店');
                        break;
                    case 3:
                        merchantState = "普通会员";
                        $('#storeState').text('我要开店');
                        break;
                }
                $("#merchantState").text("会员等级：" + merchantState);
            }
        }
    });
}

//获取订单信息
function getOrderList() {
    $.ajax({
        url: baseURL + "action/auth/user/normal/MerchantShopOrderAction/getColumnsInPersonalCenter",
        success: function(data) {
            //console.log(data)
            if (data.c == "0") {
                var list = data.d
                parseDataWithView(list)
            }
        }
    });
}

function parseDataWithView(list) {
    var appendText = '';
    $("#orderList").empty()
    for (let index = 0; index < list.length; index++) {
        const element = list[index];
        imgUrl = baseURL + element.img
        appendText += '<li>';
        if (element.count) {
            appendText += '<a class="orderArea-allOrder am-center am-text-center am-text-sm" value="' + element.type + '" style="background: url(' + imgUrl + ') no-repeat center 6px;">' + element.name + '<strong class="am-text-danger">' + '(' + element.count + ')' + '</strong></a>';
        } else {
            appendText += '<a class="orderArea-allOrder am-center am-text-center am-text-sm" value="' + element.type + '" style="background: url(' + imgUrl + ') no-repeat center 6px;" >' + element.name + '</a>';
        }
        appendText += '</li>';
    }
    // 动态计算高度
    $("#orderList").append(appendText)
    let iwidth = screen.width;
    let itemWidth = iwidth * (1 / list.length) * 0.95
    $("#orderList>li").width(itemWidth)
        //点击跳转事件
    $("#orderList>li>a").click(function() {
        var valueStr = $(this).attr('value');
        if (Number(valueStr) < 4) {
            location.href = "wh-myOrderList.html?orderType=" + valueStr
        } else {

        }

    })
}