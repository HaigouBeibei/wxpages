var isJsSdkReady = false;

function wxConfig(args) {
    wx.config({
        debug: false,
        appId: args.appId,
        timestamp: args.timestamp,
        nonceStr: args.nonceStr,
        signature: args.signature,
        jsApiList: ['chooseWXPay', 'updateAppMessageShareData', 'updateTimelineShareData']
    });
}

function wxReady(wxData, gid) {
    wx.ready(function() {
        console.log('ready');
        isJsSdkReady = true;
        wx.updateAppMessageShareData({
            title: wxData.d.name, // 分享标题
            link: baseURL + '/wxpages/classify/goods_detail.html?gid=' + gid + '&parentid=' + userID, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            desc: wxData.d.name,
            imgUrl: baseURL + wxData.d.imgListPage, // 分享图标
            success: function(data) {
                // alert('s');
                // console.log('s');
                // console.log(data);
                // console.log('share');
            },
            fail: function(data) {
                // alert('f');
                // console.log('f');
                // console.log(data);
            }
        });
        wx.updateTimelineShareData({
            title: wxData.d.name, // 分享标题
            link: baseURL + '/wxpages/classify/goods_detail.html?gid=' + wxData.d.id + '&parentid=' + userID, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: baseURL + wxData.d.imgListPage, // 分享图标
            success: function() {
                // alert('s');
                // console.log('s');
                // console.log(data);
                // console.log('share');
            },
            fail: function(data) {
                // alert('f');
                // console.log('f');
                // console.log(data);
            }
        });

    });
}

function wxError() {
    wx.error(function(res) {

    });
}

function initJsSdk(wxData, gid) {
    $.getJSON(baseURL + "action/auth/user/normal/WeiXinJsSdk/getJsApiConfigArgs", {
        "url": window.location.href
    }, function(data, state, xhr) {
        if (data.c == 0) {
            wxConfig(data);
            wxReady(wxData, gid);
            wxError();
        }
    });
}