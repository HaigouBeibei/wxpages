var baseURL = "https://tongmeng.haigoubeibei.com/hiGou/";
$(function() {
    initLeftContaner();
  });

  // 初始化数据
function initLeftContaner() {
    // 请求数据
    $.ajax({
      url: baseURL + "action/MerchantGoodsTypeAction/getTypeList",
      success: function(data) {
        // data = $.parseJSON(data);
        if (data.c == 0) {
          // 取数据
          var datas = data.d;
          $("ul.wh-nav").empty();
          for (let index = 0; index < datas.length; index++) {
              var element = datas[index];
              var name  = element.name;
              var appendText = "";
              appendText += '<li >';
              appendText += '<a class="wh-nav-a">' ;
              appendText += '<span >' +name+"</span>"
              appendText += "</a>"
              appendText += "</li>";
              $("ul.wh-nav").append(appendText);
          }
          //刚进来的初始化数据
          getFristData(datas[0]);
          //右侧的数据
          $(".wh-nav li").click(function(){
            $(this).addClass("wh-nav-a-select")
            $(this).children("a").addClass("wh-nav-selectColor")
            $(this).siblings().removeClass("wh-nav-a-select")
            $(this).siblings().children("a").removeClass("wh-nav-selectColor")
            var  index  = $(this).index();
            var element = datas[index];
            getTypeWithData(element);
          }) 
        }else{
          showError(data.m) 
        }
      }
    });
  }
//初始化右边数据
function getFristData(data){
  getTypeWithData(data);
  $(".wh-nav li:first").addClass("wh-nav-a-select")
  $(".wh-nav li:first").children("a").addClass("wh-nav-selectColor")
}

  //右侧数据列表
function  getTypeWithData(data){
    $("ul.wh-right-ul").empty();
    if(data.secondLevel.length<=0){
      var appendText = "";
      appendText += '<li class="wh-right-li">';
      appendText += '<label class="wh-empty">当前专区分类正在添加中...</label>';
      appendText += "</li>";
      $("ul.wh-right-ul").append(appendText)
    } 
    else
    {
      for (let index =0; index< data.secondLevel.length; index++){
        var element =data.secondLevel[index];
          var nameText  = element.name;
          var imgSrc  = element.img;
          var appendText = "";
          appendText += '<li class="wh-right-li">';
          appendText += '<img class="wh-imgClas am-radius" alt="140*140" src="' + baseURL +imgSrc + '"/>' ;
          appendText +=  '<a class="wh-right-al">'+nameText+"</a>"
          appendText += "</li>";
          $("ul.wh-right-ul").append(appendText);
    } 
  }
    $(".wh-right-ul li").click(function(){
      var  index  = $(this).index();
      var element =data.secondLevel[index]
      console.log(element)
      location.href="wh-goodsClassfyDetail.html?goodType="+element.id
    })
  }