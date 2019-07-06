
var Node = {　　　　　
          PAYMENT_NODE: "0", //付款
　　　　　  EVALUATE_NODE: "4", //评价
　　　　　　DELETE_NODE: "1", //删除
　　　　　　CONFIRM_NODE: "3", //确认收货
　　　　　　LOGISTICS_NODE: "2", //查看物流,
          REFUND_NODE:"5",//退款　　　　　　　　　　　
}
$(function() {
    loadData()
});

function loadData(){
    var orderId  = getQueryString("orderId")
    $.ajax({
        url: baseURL + "action/auth/user/normal/MerchantShopOrderAction/getOrderDetails",
        data:{
          id:orderId,  
        },
        success: function(data) {
            if(data.c =='0'){ 
              var list = data.d
              console.log(list);
              parseHeaderDataWithView(list)
              parseBodyDataWithView(list)
              parseOrderDetailDataWithView(list)
              parseFooterDataWithView(list)
            }else{
              alert(data.m)
            }
        }
    });
}

//设置headerView
function parseHeaderDataWithView(list){
  var state = list.order.state
  var recipientName  = '收货人: '+list.order.recipientName + ' ' + list.order.recipientMobileNumber
  var address  ='收货地址: ' +list.order.province + list.order.city + list.order.district + list.order.detailedAddress
  $("#locationStatus").text(state)
  $("#postMan").text(recipientName)
  $("#postAddress").text(address)
}

//设置商品详情
function parseBodyDataWithView(list){
  $("#orderList").empty()
  var appendText = "";
    const element = list.order;
    appendText += '<table class="wh-orderHeader wh-priceSize cartProductArea am-table am-table-centered am-table-compact am-center am-margin-top-xs wh-tableConaner-customerSet">';  
    appendText += '<thead>';
    appendText += ' <tr>';
    appendText += '<th class="am-text-middle wh-headContaner-margin am-text-left wh-cancelBorder">';
    appendText += '<img src="' + baseURL +element.merchantShopIcon + '" class="wh-header-imgSet" />';
    appendText += ' ' + element.merchantShopName;
    appendText += '</th>';
    appendText += '</tr>';
    appendText += '</thead>';
    appendText += '<tbody id='+element.id +'>';
    for (let i = 0; i < list.orderDetails.length; i++) {
      const good = list.orderDetails[i];
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
      appendText +='<tr>';
      appendText +='<td class="am-text-middle wh-cancelBorder wh-customer-height">';
      appendText +='<div class="priceArea am-margin-top-xs">';
      if(good.buttons){
        for (let index = 0; index < good.buttons.length; index++) {
          const button = good.buttons[index];
          appendText +='<span class="am-fr wh-table-buttonCustomer am-margin-right-xs " id='+good.id+' value='+ button.type+' >'+button.text+'</span>';
        }
      }else{
        if (isStringEmpty(good.state)){
          good.state  = ''
        }
         appendText +='<span class="am-fr wh-table-refoundCustomer am-margin-right-xs" >'+ good.state +'</span>'
      }
      
    }
    appendText +='</div>';
    appendText +='</td>';
    appendText +='</tr>';
    appendText += '</tbody>';
    appendText +='<tfoot>';
    appendText +='<tr>';
    appendText +='<td class="wh-table-height am-text-middle wh-cancelBorder">';
    appendText +='<div class="priceArea  am-margin-top-xs">';
    appendText +='<span class="am-fr  am-margin-right-xs am-text-danger">￥'+ handlePrice(element.freight)+'</span>';
    appendText +='<span class="am-fl  am-margin-right-xs ">运费</span>';
    appendText +='</div>';
    appendText +='</td>';
    appendText +='</tr>';
    appendText +='<tr>';
    appendText +='<td class="wh-table-height am-text-middle wh-cancelBorder wh-cancelBorder wh-footerTable-height">';
    appendText +='<div class="priceArea  am-margin-top-xs">';
    appendText +='<span class="am-fr  am-margin-right-xs am-text-danger">￥'+ handlePrice(element.goodsAmount)+'</span>';
    appendText +='<span class="am-fl  am-margin-right-xs ">实付款 (含运费)</span>';
    appendText +='</div>';
    appendText +='</td>';
    appendText +='</tr>';
    appendText +='</tfoot>';
    appendText +='</table>';
  $("#orderList").append(appendText);

  $(".wh-table-buttonCustomer").click(function(){
    var valueStr = $(this).attr('value');
    var goodId = $(this).attr('id');
    actionButtonClickWithType(goodId, valueStr,'0')
  })
}
//订单信息
function parseOrderDetailDataWithView(list){
  var order  = list.order 
  $("#order_sn").text(order.id)
  $("#order_time").text(order.createdTime)
}

//设置底部按钮
function parseFooterDataWithView(list){
  $("#footerBtnList").empty()

  if(list.order.buttons && list.order.buttons.length > 0){
    var appendText ='';
    for (let index = 0; index < list.order.buttons.length; index++) {
        const element = list.order.buttons[index];
       appendText +='<span class="am-fr wh-buttonCustomer am-margin-right-xs am-text-danger wh-itemSize"  price='+ list.order.goodsAmount+' id='+ list.order.id +' value='+ element.type+'>'+element.text+'</span>'; 
    }
    $("#footerBtnList").append(appendText)
    $(".wh-footerBar-color").show()
    $(".wh-buttonCustomer").click(function() {
      var valueStr = $(this).attr('value');
      var orderId = $(this).attr('id');
      var price  = $(this).attr('price');
      actionButtonClickWithType(orderId, valueStr,price)
  
   })
  }else{
    console.log(222);
    $(".wh-footerBar-color").hide()
  }
}

//根据按钮类型判断跳转事件
function actionButtonClickWithType(orderId,value,price) {
  if (value == Node.PAYMENT_NODE) {
      //去付款
      goPay(orderId,price)
  } else if (value == Node.DELETE_NODE) {
      //删除
      deleteCancelOrder(orderId)
  } else if (value == Node.LOGISTICS_NODE) {
      //查看物流
      checkLogistics(orderId)

  } else if (value == Node.CONFIRM_NODE) {
      //确认收货
      confrimGoods(orderId)

  } else if (value == Node.EVALUATE_NODE) {
      // 评价
      evaluateGood(orderId)
  }else if (value == Node.REFUND_NODE) {
      //退款 orderId为 goodId
      refoundMoney(orderId)
  }
  
}

//查看物流
function checkLogistics(order_id) {
  location.href =  baseURL + "wxpages/i/wh-locationAddress.html?order_id=" + order_id;
}

//去付款
function goPay(orderId,price) {
  var ids = [];
  ids.push(orderId)
  var idStr = ids.join(',')
  window.location.href = baseURL + "wxpages/pay/index.html?ids=" + idStr +'&payCount=' + price;

}
//确认收货
function confrimGoods(orderId) {
  $.ajax({
      url: baseURL + "action/auth/user/normal/MerchantShopOrderAction/confirmReception",
      data: {
          id: orderId,
      },
      success: function(data) {
          if (data.c == '0') {
            history.go(-1);
          } else {
            alert(data.m)
          }
      }
  })
}
//评价
function evaluateGood(orderId) {
  window.location.href = baseURL + "wxpages/i/wh-evaluate.html?orderId=" + orderId;
}

//退款
function refoundMoney(goodId){
  window.location.href = baseURL + "wxpages/i/wh-applyRefound.html?goodId=" + goodId;
}

//删除订单
function deleteCancelOrder(order_id) {
  $.ajax({
      url: baseURL + "action/auth/user/normal/MerchantShopOrderAction/delete",
      data: {
          id: order_id,
      },
      success: function(data) {
          if (data.c == '0') {
            history.go(-1);
          } else {
            alert(data.m)
          }
      }
  })
}