
var merchantValue;
var isEmptyAccount = true;
var Node = {　　　　　
    CertificationState_applying: "0", //审核中
    CertificationState_succece: "1", //审核成功
    CertificationState_fail: "2", //审核失败　　　　　　　　　　
}
$(function() {
    getPersonalInfo();
    getOrderList();
});

//获取个人信息
function getPersonalInfo() {
    $.ajax({
        url: baseURL + "action/auth/user/normal/HxCsUserAction/getBySession",
        success: function(data) {
            console.log(data);
            if (data.c == 0) {
                if (isStringEmpty(data.d.account)) {
                    isEmptyAccount = true;
                } else {
                    isEmptyAccount = false;
                }

                if (data.d.isVerifier == 'Y') {
                    $('#forGoods').removeClass('am-hide');
                }

                $("#avatar").attr("src", baseURL + data.d.avatar);
                $("#nickName").text(data.d.nickname);
                merchantState = "普通会员";
                switch (data.d.merchantState) {
                    case 1:
                        merchantState = "商家";
                        $('#storeState').text('我的店铺');
                        merchantValue = 1;
                        break;
                    case 2:
                        merchantState = "申请商家中";
                        $('#storeState').text('我要开店');
                        merchantValue = 2;
                        break;
                    case 3:
                        merchantState = "普通会员";
                        $('#storeState').text('我要开店');
                        merchantValue = 3;
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
            location.href = baseURL + "wxpages/i/wh-myOrderList.html?orderType=" + valueStr
        } else {
            window.location.href = baseURL + "wxpages/i/wh-refound.html"
        }

    })
    $("#actionList>li>a").click(function() {
        var valueStr = $(this).attr('value');
        if (valueStr == '1') {
            location.href = baseURL + 'wxpages/i/password.html'
        }
        if (valueStr == '2') {
            if (isEmptyAccount) { //请先绑定手机号
                location.href = baseURL + 'wxpages/i/bindPhone.html'
                return;
            }
            if (merchantValue == 1) {
                alert('店铺审核成功，请到应用市场下载嗨购贝贝APP操作你的店家吧')
            } else {
                getStoreApplyStatus()
            }

        }
        if (valueStr == '3') {
            location.href = baseURL + 'wxpages/i/wh-myMembers.html'
        }
        if (valueStr == '4') {
            location.href = baseURL + 'wxpages/i/wh-myWallet.html'
        }
        if (valueStr == '5') {
            location.href = baseURL + 'wxpages/i/bindPhone.html'
        }
        if (valueStr == '6') {
            location.href = baseURL + 'wxpages/i/myQR.html'
        }
        if (valueStr == '7') {
            location.href = baseURL + 'wxpages/i/wh-myAddress.html?callback=//////https://tongmeng.haigoubeibei.com/hiGou/wxpages/i/index.html////////'
        }
        if (valueStr == '8') {
            location.href = baseURL + 'wxpages/forGoods/index.html'
        }

    })
}

function getStoreApplyStatus() {
    $.ajax({
        url: baseURL + 'action/auth/user/normal/MerchantShopAuditHistoryAction/get',
        data: {},
        success: function(data) {
            if (data.c == '0') {
                if (data.d.auditState == Node.CertificationState_applying) {
                    location.href = baseURL + 'wxpages/i/myStore.html'
                        // location.href =  baseURL + 'wxpages/i/wh-storeCertification.html'
                } else if (data.d.auditState == Node.CertificationState_succece) {
                    location.href = baseURL + 'wxpages/i/myStore.html'
                } else if (data.d.auditState == Node.CertificationState_fail) {
                    location.href = baseURL + 'wxpages/i/myStore.html'
                } else {
                    location.href = baseURL + 'wxpages/i/wh-storeCertification.html'
                }
            } else {
                location.href = baseURL + 'wxpages/i/wh-storeCertification.html'
            }
        }
    })
}