
var currentCapture;
var categeryID;
var auditComment;
var isReplay = false;
$(function () {
    //上传营业执照
    categeryID  = getQueryString("categaryId")
    var categeryName = getQueryString("categeryName")
    var isFoodShow  = getQueryString("categeryType")
    //是否隐藏食品许可证
    if (isFoodShow=='Y'){
        $("#foodPermit").show()
    }else{
        $("#foodPermit").hide()
    }
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
    //食品流通证
    $("#foodImg").click(function(){
        var takePicture = document.getElementById('takepicture');
        takePicture.click();
        currentCapture = $(this)
    })
   //选择店铺分类
   $("#wh-settingCategery").click(function(){
    location.href = baseURL + "wxpages/i/wh-chooseStore.html?categaryId=" +  categeryID
   })
   //保存
   $(".container_content_save").click(function(){
       save()
   })
   //获取个人信息
   getPersonInfo()
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


//保存
function save (){
   //条件判断
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
   
    var cardFront = $("#identityCardFront").attr('value')
    var cardBack  = $("#identityCardBack").attr('value')
    var shopImg =  $("#shopImg").attr('value')
    if (isStringEmpty(cardFront) || isStringEmpty(cardBack)){
        alert('请检查身份证是否全部上传成功')
        return
    }
    
    if(isStringEmpty(shopImg)){
        alert('请检查营业执照是否上传成功')
        return
    }
    if(isStringEmpty(categeryID)){
        alert('请先选择店铺分类！')
        return
    }
    // var goodImg;
     var isFoodShow  = getQueryString("categeryType")
     var goodImg =  $("#foodImg").attr('value') 
    if (isFoodShow=='Y'){
    if(isStringEmpty(goodImg)){
        alert('请上传食品流通许可证')
        return
     }  
    }
    //请求
    if (isReplay){
        $.ajax({
            url: baseURL + 'action/auth/user/normal/MerchantShopAuditHistoryAction/reapply',
            data:{
                shopName: storeName,
                userRealName: userRealName,
                idCardNumber:cardNumber,
                idCardInHandFrontSide:cardFront,
                idCardInHandBackSide:cardBack,
                businessLicenseImg:shopImg,
                typeId:categeryID,
                foodCirculationLicenseImg:goodImg,
            },
            success: function(data) {
            if (data.c =='0'){
                location.href =  baseURL + "wxpages/i/index.html"
            }else{
                showError(data.m)
             }
            }
           })

    } else {
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
            foodCirculationLicenseImg:goodImg,
        },
        success: function(data) {
        if (data.c =='0'){
            location.href =  baseURL + "wxpages/i/index.html"
        }else{
            alert(data.m)
        }
        }
    })
 }
}

//获取店铺认证信息
function getPersonInfo(){
    $.ajax({
        url: baseURL + 'action/auth/user/normal/MerchantShopAuditHistoryAction/get' ,
        data:{
        },
        success: function(data) {
        if (data.c =='0'){
            isReplay  = true
            console.log(data);
            categeryID = data.d.typeId;
            $("#realShopName").val(data.d.shopName)
            $("#identityCardFront").attr("src",baseURL+data.d.idCardInHandFrontSide)
            $("#identityCardFront").attr("value",data.d.idCardInHandFrontSide)
            $("#identityCardBack").attr("src",baseURL+ data.d.idCardInHandBackSide)
            $("#identityCardBack").attr("value", data.d.idCardInHandBackSide)
            $("#realName").val(data.d.userRealName)
            $("#realNumber").val(data.d.idCardNumber)
            $("#wh-chooseStore").text(data.d.typeName)  
            $("#shopImg").attr('value',data.d.businessLicenseImg)
            $("#shopImg").attr('src',  baseURL+data.d.businessLicenseImg)
            $(".container_content_save").text("重新保存")
            if(!isStringEmpty(data.d.foodCirculationLicenseImg) ){
                $("#foodPermit").show() 
                $("#foodImg").attr('src',baseURL+data.d.foodCirculationLicenseImg)
                $("#foodImg").attr('value',data.d.foodCirculationLicenseImg)  
            }else{
                $("#foodPermit").hide()   
            }
        }
     }
    })
}

