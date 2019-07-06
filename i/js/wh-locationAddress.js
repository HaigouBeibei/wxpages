
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
            var list  = data.d.Traces
            var company  = data.d.LogisticsCompany;
            var code  = data.d.LogisticCode;
            parseDateWithHeadView(company,code)
            parseDataWithView(list)
         }else{
            alert(data.m)
         }
      }
    })
}
//head视图
function parseDateWithHeadView(company,code){
    $("#headerLocationAddress").empty()
    var appendText ='' ;
    appendText += '<p class="wh-headLable">'+ company+'</p>';
    appendText += '<p class="wh-headLable wh-headlable-set">' + company+ '<span class="wh-codeSet">'+ code + '</span></p>';
    $("#headerLocationAddress").append(appendText);
}

//物流信息视图
function parseDataWithView(list){
    $("#locationAddress").empty()
    var appendText ='' ;
    for (let index = 0; index < list.length; index++) {
        const element = list[index];
        if(index ==0){
         appendText += '<li class="first">';
        }else{
         appendText += '<li>'
        }
        appendText += '<p>'+ element.AcceptTime+'</p>';
        appendText += '<p>'+element.AcceptStation +'</p>';
        if (index==0){
         appendText +='<span class="before"></span><span class="after"></span> <i class="mh-icon mh-icon-new"></i>'    
        }else{
         appendText +='<span class="before"></span><span class="after"></span>';   
        }
        appendText +='</li>';
    }
    $("#locationAddress").append(appendText);
}