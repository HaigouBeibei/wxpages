var baseURL = "https://tongmeng.haigoubeibei.com/hiGou/"
$(function () {
    loadData()
})

function loadData(){
  var orderDetailsId = getQueryString("goodId")
  $.ajax({
	url: baseURL + "action/auth/user/normal/MerchantShopOrderDetailsAction/applyForRefund",
	data:{
       id: orderDetailsId,
    },
	success: function(data) {
		
	}
});
}

