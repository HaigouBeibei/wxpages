
$(function () {
    loadData()
    $(".container_content_save").click(function(){
         save()
    })
})

function loadData(){
    var orderDetailsId = getQueryString("goodId")
    $.ajax({
    url: baseURL + "action/auth/user/normal/MerchantShopOrderDetailsAction/getRefundInfo",
    data:{
        id: orderDetailsId,
      },
    success: function(data) {
      if (data.c =='0'){
        console.log(data);
        parseDataWithGoodView(data.d)
      }else{
        alert(data.m)
      }
    }
    })
}
function parseDataWithGoodView(element){
  $("#orderList").empty()
  var appendText = "";
    appendText += '<table class="wh-orderHeader wh-priceSize cartProductArea am-table am-table-centered am-table-compact am-center am-margin-top-xs wh-tableConaner-customerSet wh-table-topMargin">';  
    appendText += '<thead>';
    appendText += ' <tr>';
    appendText += '<th class="am-text-middle am-text-left wh-cancelBorder">';
    appendText += '<img src="' + baseURL +element.merchantShopIcon + '" class="wh-header-imgSet wh-headerImgSet" />';
    appendText += ' ' + element.merchantShopName;
    appendText += '</th>';
    appendText += '</tr>';
    appendText += '</thead>';
    appendText += '<tbody>';
    appendText +='<tr>';
    appendText +='<td class="wh-tdHeight am-text-middle wh-cancelBorder wh-td-margin">';
    appendText +='<div class="wh-th-postion am-cf am-margin-top-xs am-margin-bottom-xs">';
    appendText +='<p class="am-align-left am-margin-bottom-0 wh-bodyImgSet">';
    appendText +='<img src="' +baseURL+ element.img + '" class="am-margin-top-xs" width="70" height="70" alt="" />';
    appendText +='</p>';
    appendText +='<div class="wh-contentSet">';
    appendText +='<p class="wh-textalign line-clamp am-margin-0 am-text-sm">'+element.goodsName+'</p>';
    appendText +='<p class="wh-textalign wh-th-customerSize am-margin-0 am-text-sm">'+element.specText+'</p>';
    appendText +='</div>';
    appendText +='<div class="wh-rightContaner">';
    appendText +='<p class="wh-footer-marigin am-text-danger">'+"￥" + handlePrice(element.price)+'</p>';
    appendText +='<p class="wh-footer-marigin wh-th-color">'+'x' + element.count+'</p>';
    appendText +='</div>';
    appendText +='</div>';
    appendText +='</td>';
    appendText +='</tr>';
    appendText += '</tbody>';
    appendText +='</table>';
  $("#orderList").append(appendText);
  $("#refoundAmount").text("￥"+handlePrice(+element.amount)+'元')
}

//提交退款申请
function save(){
  var orderDetailsId = getQueryString("goodId")
  var refundReason  = $("#addressRecipients").val()

  if (typeof refundReason == "undefined" || refundReason == null || refundReason == ""){
    alert("请您输入退款原因")
  }
  $.ajax({
    url: baseURL + 'action/auth/user/normal/MerchantShopOrderDetailsAction/applyForRefund' ,
    data:{
      id: orderDetailsId,
      refundReason:refundReason,
    },
    success: function(data) {
      if (data.c =='0'){
        history.back(-1);
      }else{
        alert(data.m)
       }
      }
    })
}


