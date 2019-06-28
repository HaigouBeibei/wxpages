var baseURL = "https://tongmeng.haigoubeibei.com/hiGou/";
var currentCapture;
$(function () {
    //上传营业执照
    var categeryID  = getQueryString("categaryId")
    var categeryName = getQueryString("categeryName")
    //如果不为空的设置分类名称
    if(!isStringEmpty(categeryName)){
      $("#wh-chooseStore").text(categeryName)  
    }
   $("#shopImg").click(function(){
       var takePicture = document.getElementById('takepicture');
       takePicture.click();
       currentCapture = $(this)
   })
   //上传身份证正面
   $("#identityCardFront").click(function(){
    var takePicture = document.getElementById('takepicture');
    takePicture.click();
    currentCapture = $(this)
   })
   //上传身份证反面
   $("#identityCardBack").click(function(){
    var takePicture = document.getElementById('takepicture');
    takePicture.click();
    currentCapture = $(this)
   })
   //选择店铺分类
   $("#wh-settingCategery").click(function(){
    var categeryID = getQueryString("categaryId")
    location.href = baseURL + "wxpages/i/wh-chooseStore.html?categaryId=" +  categeryID
   })
   $(".container_content_save").click(function(){
       save()
   })
})


function fileup(e) {
    if (e.target.files){
        var imgFile = e.target.files[0]; //获取图片文件
        var formData = new FormData();
        formData.append('file', imgFile); 
        $.ajax({
            url:baseURL+'action/auth/user/normal/HxSysUploadAction/uploadImgSmall',
            type:'POST',
            cache: false,
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                if(data.c == '0'){
                   if(!isStringEmpty(data.d)){
                    currentCapture.attr("src",baseURL+ data.d) 
                    currentCapture.attr("value",data.d)     
                   }else{
                    alert('图片上传失败请重新上传')   
                   }
                 
                }
             },
             error: function(err){
                alert(err)
            }
        }) 
    }
}

// @"shopName" : shopName,
// @"userRealName" : userRealName,
// @"idCardNumber" : idCardNumber,
// @"idCardInHandFrontSide" : idCardInHandFrontSide,
// @"idCardInHandBackSide" : idCardInHandBackSide,
// @"foodCirculationLicenseImg" : foodCirculationLicenseImg,
// @"businessLicenseImg" : businessLicenseImg,
// @"typeId":typeId,
//保存
function save (){

    var userRealName = $("#realName").val()
    if(isStringEmpty(userRealName)){
        alert('姓名不允许为空')
        return
    } 
    var cardNumber = $("#realNumber").val()
    if(isStringEmpty(cardNumber)){
        alert('身份证号不允许为空')
        return
    } 
    var storeName = $("#realShopName").val()
    if(isStringEmpty(storeName)){
        alert('店铺名称不允许为空')
        return
    } 
    cardFront = 'asasas'
    cardBack = 'asasa'
    shopImg  = 'sas'
    // var cardFront = $("#identityCardFront").attr('value')
    // var cardBack  = $("#identityCardBack").attr('value')
    // var shopImg =  $("##shopImg").attr('value')
    if (isStringEmpty(cardFront) || isStringEmpty(cardBack)){
        alert('请检查身份证是否全部上传成功')
        return
    }
    if(isStringEmpty(shopImg)){
        alert('请检查营业执照是否上传成功')
        return
    }
    var categeryID  = getQueryString("categaryId")
    if(isStringEmpty(categeryID)){
        alert('请先选择店铺分类！')
        return
    }
    $.ajax({
    url: baseURL + 'action/auth/user/normal/MerchantShopAuditHistoryAction/applyForShopOpen',
    data:{
        shopName: storeName,
        userRealName: userRealName,
        idCardNumber:cardNumber,
        idCardInHandFrontSide:cardFront,
        idCardInHandBackSide:cardBack,
        businessLicenseImg:shopImg,
        typeId:categeryID,
        foodCirculationLicenseImg:'111',
    },
    success: function(data) {
    if (data.c =='0'){
        
    }else{
    showError(data.m)
    }
    }
    })
}

