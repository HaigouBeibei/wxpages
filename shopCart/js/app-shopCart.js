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

        }
    });


}

//初始化选择按钮
function initCheck() {
    //加号按钮
    $(".sc-plus").click(function() {
        var countValue = parseInt($(this).prev().val());
        var maxValue = parseInt($(this).prev().attr("max-value"));
        var newValue = parseInt(countValue) + 1;
        console.log(newValue);
        var pop = $(this).prev().popover({
            theme: "danger sm"
        });
        pop.popover("setContent", "已超过最大购买数");
        if (newValue > maxValue) {
            pop.popover("open");
        } else {
            pop.popover("close");
            $(this).prev().val(newValue);
        }
    });
    //减号按钮
    $(".sc-reduce").click(function() {
        var countValue = parseInt($(this).next().val());
        var newValue = parseInt(countValue) - 1;
        var pop = $(this).next().popover({
            theme: "danger sm"
        });
        pop.popover("setContent", "至少购买一件商品");
        console.log(newValue);
        if (newValue < 1) {
            pop.popover("open");
        } else {
            pop.popover("close");
            $(this).next().val(newValue);
        }
    });
    //全选/非全选
    $("#allChoose").click(function() {
        var state = $(this).prop("checked");
        if (state === true) {
            $("table input[data-am-ucheck]").uCheck("check");
        } else {
            $("table input[data-am-ucheck]").uCheck("uncheck");
        }
    });
    //单个按钮影响全选按钮
    $("table input[data-am-ucheck]").click(function() {
        initAllCheck();
    });
}
//初始化所有选择框样式
function initAllCheck() {
    var isAllCheck = true;
    $("table input[data-am-ucheck]").each(function() {
        if ($(this).prop("checked") === false) {
            isAllCheck = false;
        }
    });
    if (isAllCheck === true) {
        $("#allChoose").uCheck("check");
    } else {
        $("#allChoose").uCheck("uncheck");
    }
}