$(function() {
  initGoods();
});
// 初始化Banner
function initGoods() {
  // 请求数据
  $.ajax({
    url: baseURL + "action/MerchantGoodsAction/getGoodsDetail",
    data: {
      id: getQueryString("gid")
    },
    error: function() {
      showError("唔。。。服务器开了个小差，导致页面载入失败，放心，当你看到这个提示的时候，那个可怜的程序员小哥哥又被扣钱了，嘻嘻。");
    },
    success: function(data) {
      if (data.c == 0) {
        var datas = data.d;
        //轮播图
        initSlide(datas);

        console.log(data);
      } else {
        showError("唔。。。服务器开了个小差，导致页面载入失败，放心，当你看到这个提示的时候，那个可怜的程序员小哥哥又被扣钱了，嘻嘻。");
      }
    }
  });
}

//初始化轮播图
function initSlide(data) {
  var datas = data.imgsDetailPage.split(",");
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
    smoothHeight: true
  });
}
