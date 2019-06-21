var baseURL = "https://tongmeng.haigoubeibei.com/hiGou/"
var page = 1;
var currentType = '';
var Node = {
  　　　　　PAYMENT_NODE: "0", //付款
  　　　　　EVALUATE_NODE: "4", //评价
　　　　　　DELETE_NODE: "1", //删除
　　　　　　CONFIRM_NODE: "3", //确认收货
　　　　　　LOGISTICS_NODE: "2", //查看物流　　　　　　　　　　　
} 
$(function () {
 initHeaderList()
    
})
//初始化顶部菜单
 function initHeaderList(){
    $.ajax({
        url: baseURL + "action/auth/user/normal/MerchantShopOrderAction/getColumnsInOrderList",
        success: function(data) {
          if (data.c == "0") {
          var list  = data.d;
          $(".wh-headerContaner").empty()
          var appendText = "";
          for (let index = 0; index < list.length; index++) {
            var element = list[index];
            if (index==0){
                appendText += '<span class="wh-headSection" id ="fristId" value="'+ element.type +'" >'+ element.name + '</span>';
            }else{
                appendText += '<span class="wh-headSection"  value="'+ element.type +'" >'+ element.name + '</span>';
            }
          }
          //动态计算高度
          $(".wh-headerContaner").append(appendText)
          let iwidth = screen.width;
          let itemWidth = iwidth* (1/list.length)
          $(".wh-headSection").width(itemWidth)
          //初始化数据
           getFristData(0)
           //点击事件方法
          $(".wh-headSection").click(function(){
            $(this).addClass("wh-nav-selectColor")
            $(this).siblings().removeClass("wh-nav-selectColor")
            currentType  =  $(this).attr('value') 
            getListWithType(Number(currentType))
           })
          }
        else{
          showError(data.m) 
        }  
      }
    })
 }  
 
 //初始化默认数据
function getFristData(index){
     var typyList = $(".wh-headSection")
    var list = typyList.eq(index)
    currentType  = list.attr('value') 
    list.addClass("wh-nav-selectColor")
    list.siblings().removeClass("wh-nav-selectColor")
    getListWithType()
   
}
//获取订单数据
function getListWithType(){
    $.ajax({
        url: baseURL + "action/auth/user/normal/MerchantShopOrderAction/list",
        data:{
         type: currentType,
         page: page,
         limit:'20',
        },
        success: function(data) {
         if(data.c == '0'){
            var list  = data.d
            console.log(list);
            parseViewWithData(list)
         }else{
          showError(data.m) 
         }
      }
    })
}
//根据数据重构视图
function parseViewWithData(data){
    $("#orderList").empty();
    var appendText = "";
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      appendText += '<table class="wh-orderHeader wh-priceSize cartProductArea am-table am-table-centered am-table-compact am-center am-margin-top-xs">';  
      appendText += '<thead>';
      appendText += ' <tr>';
      appendText += '<th class="am-text-middle wh-headContaner-margin am-text-left wh-cancelBorder">';
      appendText += '<img src="' + baseURL +element.merchantShopIcon + '" class="wh-header-imgSet" />';
      appendText += ' ' + element.merchantShopName;
      appendText +='<span class="am-fr wh-footer-customer am-margin-right-xs am-text-danger">'+ element.state + '</span>';
      appendText += '</th>';
      appendText += '</tr>';
      appendText += '</thead>';
      appendText += '<tbody>';
      for (let i = 0; i < element.details.length; i++) {
        const good = element.details[i];
        appendText +='<tr>';
        appendText +='<td class="wh-tdHeight am-text-middle wh-cancelBorder wh-td-margin">';
        appendText +='<div class="wh-th-postion am-cf am-margin-top-xs am-margin-bottom-xs">';
        appendText +='<p class="wh-goodImg_set am-align-left am-margin-bottom-0">';
        appendText +='<img src="' +baseURL+ good.img + '" class="am-margin-top-xs" width="70" height="70" alt="" />';
        appendText +='</p>';
        appendText +='<div class="wh-contentSet">';
        appendText +='<p class="wh-textalign line-clamp am-margin-0 wh-sm-text">'+good.goodsName+'</p>';
        appendText +='<p class="wh-textalign wh-th-customerSize am-margin-0 wh-sm-text">'+good.specText+'</p>';
        appendText +='</div>';
        appendText +='<div class="wh-rightContaner">';
        appendText +='<p class="wh-footer-marigin am-text-danger">'+"￥" + handlePrice(good.price)+'</p>';
        appendText +='<p class="wh-footer-marigin wh-th-color">'+'x' + good.count+'</p>';
        appendText +='</div>';
        appendText +='</div>';
        appendText +='</td>';
        appendText +='</tr>';
      }
      appendText += '</tbody>';
      appendText += '<tfoot>';
      appendText += '<tr>';
      appendText +='<td class="am-text-middle wh-cancelBorder wh-cancelBorder wh-table-footerHeight wh-table-footLine">';
      appendText +='<div class="priceArea  am-margin-top-xs">';
      appendText +='<span class="am-fr  am-margin-right-xs am-text-danger">'+"￥"+ handlePrice(element.amount)+'</span>' 
      appendText +='<span class="am-fr am-margin-right-xs">'+'共'+ element.count +'件商品 实付:'+'</span>';
      appendText +='</div>';
      appendText +='</td>';
      appendText +='</tr>';
      appendText += '<tr>';
      appendText +='<td class="am-text-middle wh-cancelBorder wh-customer-height wh-table-footerHeight ">';
      appendText +='<div class="priceArea am-margin-top-xs">';
      for (let j = 0; j < element.buttons.length; j++) {
        const button = element.buttons[j];
        appendText +='<span class="am-fr wh-buttonCustomer am-margin-right-xs  am-text-danger" id="'+ element.id +'"  value="'+ button.type +'">'+button.text+'</span>';
      }
      appendText +='</div>';
      appendText +='</td>';
      appendText +='</tr>';
      appendText +='</tfoot>';
      appendText +=' </table>';
    }
    $("#orderList").append(appendText);

    $(".wh-buttonCustomer").click(function(){
      console.log(1);
       var valueStr = $(this).attr('value'); 
       var orderId  = $(this).attr('id'); 
       console.log(valueStr,orderId,Node.CONFIRM_NODE);
      //  deleteCancelOrder(orderId);
      checkLogistics(orderId)
  })
    
}

//删除订单
function deleteCancelOrder(order_id){
  $.ajax({
    url: baseURL + "action/auth/user/normal/MerchantShopOrderAction/delete",
    data:{
     id : order_id,
    },
    success: function(data) {
     if(data.c == '0'){
        var list  = data.d;
        page = 1;
        getListWithType()
     }else{
        showError(data.m) 
     }
  }
})
} 
//查看物流
function checkLogistics(order_id){
  location.href="wh-locationAddress.html?order_id="  + order_id
}

  
