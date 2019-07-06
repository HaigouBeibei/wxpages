
var Node = {　　　　　
    CertificationState_applying: "0", //审核中
    CertificationState_succece: "1", //审核成功
    CertificationState_fail: "2", //审核失败　　　　　　　　　　
}
var storeStatus;
$(function () {
    $(".wh-saveBtn").hide()
    $(".wh-clickUrl").hide()
    $("#copyBT").click(function(){
        copyArticle()
    })
    getStoreApplyStatus()
    $(".container_content_save").click(function(){
        location.href =  baseURL + 'wxpages/i/wh-storeCertification.html'
    })
})
 //获取店铺的审核状态
function getStoreApplyStatus(){
    $.ajax({
    url: baseURL + 'action/auth/user/normal/MerchantShopAuditHistoryAction/get',
    data:{
    },
    success: function(data) {
    if (data.c =='0'){
        parseDataWithView(data.d)
        
   
    }else{
       showError(data.m)
     }
    }
   })
}
function parseDataWithView(list){
    console.log(list);
    $("#storeName").text(list.shopName)
    $("#storeOwner").text(list.userRealName)
    $("#storeType").text(list.typeName)
    $("#shopCreateTime").hide()
    if(list.auditState==Node.CertificationState_applying){
        $(".wh-shopStatus").text('当前店铺正在审核中')
    }else if (list.auditState==Node.CertificationState_succece){
        $(".wh-shopStatus").text(list.promt)
         $(".wh-clickUrl").show()
         $("#wh-JumpUrl").text(baseURL)
    }else if(list.auditState == Node.CertificationState_fail){
        $(".wh-shopStatus").text('当前店铺审核失败，点击下方按钮重新进行审核')
        $(".wh-saveBtn").show()
        
    } 
}
function copyArticle(event) {
    const range = document.createRange();
    range.selectNode(document.getElementById('wh-JumpUrl'));

    const selection = window.getSelection();
    if(selection.rangeCount > 0) selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
    alert("复制成功！");
}

