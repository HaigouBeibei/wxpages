$(function() {
  initBanner();
  initProduct();
});
// 初始化Banner
function initBanner() {
  // 请求数据
  $.ajax({
    url: baseURL + "action/GlobalSettingsAction/getCarousels",
    success: function(data) {
      //data = $.parseJSON(data);
      //console.log(data);
      if (data.c == 0) {
        // 取数据
        var datas = data.d.carousels.split(",");
        // 写入页面
        // 清空内容
        $("#Banner .am-slides").empty();
        for (const key in datas) {
          if (datas.hasOwnProperty(key)) {
            $("#Banner .am-slides").append('<li><img src="' + baseURL + datas[key] + '" /></li>');
          }
        }
        // 生效
        var $slider = $("#Banner").flexslider({
          easing: "swing",
          touch: true,
          controlNav: false,
          smoothHeight: true
        });
      } else {
        console.log("initBanner error.");
      }
    }
  });
}
//首页商品列表
function initProduct() {
  $(".recommendArea");
  // 请求数据
  $.ajax({
    url: baseURL + "action/MerchantGoodsAction/list",
    data: {
      page: 1,
      limit: 20,
      condition: "time",
      direction: "desc"
    },
    success: function(data) {
      //data = $.parseJSON(data);
      if (data.c == 0) {
        // 取数据
        var datas = data.d.list;
        // 写入页面
        // 清空内容
        $(".recommendArea").empty();
        for (const key in datas) {
          if (datas.hasOwnProperty(key)) {
            var appendText = "";
            appendText += '<div class="am-u-sm-6">';
            appendText += '<div class="am-thumbnail">';
            appendText += '<img src="' + baseURL + datas[key].imgListPage + '" alt="" />';
            appendText += '<div class="am-thumbnail-caption">';
            appendText += "<h4>" + datas[key].name + "</h4>";
            appendText += '<span class="price am-text-lg">￥' + datas[key].listPagePriceCurrent + "</span>";
            appendText += '<span class="oldPrice am-text-sm"><del>￥' + datas[key].listPagePriceOriginal + "</del></span>";
            appendText += '<a class="am-badge am-badge-warning am-round">包邮</a>';
            appendText += "</div>";
            appendText += "</div>";
            appendText += "</div>";
            $(".recommendArea").append(appendText);
          }
        }
      } else {
        console.log("initProduct error.");
      }
    }
  });
}
