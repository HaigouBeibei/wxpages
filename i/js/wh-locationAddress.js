var baseURL = "https://tongmeng.haigoubeibei.com/hiGou/";
$(function () {
    var orderId = getQueryString("order_id")
    initlogistData(orderId)
})


function initlogistData(order_id){
    $.ajax({
        url: baseURL + "action/auth/user/normal/MerchantShopOrderAction/getOrderTraces",
        data:{
         id : order_id,
        },
        success: function(data) {
         if(data.c == '0'){
            console.log(data);
            
         }else{
            showError(data.m) 
         }
      }
    })
}