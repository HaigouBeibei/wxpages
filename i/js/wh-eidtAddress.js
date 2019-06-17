var baseURL = "https://tongmeng.haigoubeibei.com/hiGou/"
var provSelectId = ""
var citySelectId = ""
var districtSelectId = ""
var isDefault = "0"
var addressId = ""
var provName = ""
var cityName = ""
var districtName=""
var toggle  = true
var toURL = ''
$(function() {
    var begin = window.location.href.indexOf('//////');
    var end = window.location.href.indexOf('////////');
    toURL = window.location.href.substring(begin + 6, end);
     addressId = getQueryString("addressId");
     getAddressInfoData(addressId) //获取数据
    $(".container_content_save").click(function(){
       var detailText = $("#addressDetail").val()
       var contactNumber = $("#addressPhoneNumber").val()
       var recipientText  = $("#addressRecipients").val()
       if (detailText == "" || detailText == null){
           alert("详细地址不能为空!")
           return
       }
       if (contactNumber == "" || contactNumber == null){
           alert("手机号不能为空!")
           return
       }
       if (recipientText == "" ||recipientText == null){
           alert("收货人不能为空!")
           return
       }
       var isDefaultStr = toggle ? "1": "0"
       $.ajax({
           url:baseURL + "action/auth/user/normal/HxCsUserDeliveryAddressAction/saveOrUpdate",
           data:{
               id: addressId,
               province: provSelectId,
               city: citySelectId,
               district: districtSelectId,
               detail: detailText,
               isDefault: isDefaultStr,
               recipients: recipientText,
               contactNumber: contactNumber,
           },success:function(data){
             if (data.c ==0){
                if (toURL.length >0){
                    location.href ="wh-myAddress.html?callback=" + '//////' + toURL + '////////'
                  }else{
                    location.href="wh-myAddress.html"
                  }
             }else{
                 alert(data.c.m)
             }
           }
       })
       
   })  
 })
function getProviceId(provice_name,city_name,district_name){
    var provId  = ""
    $.ajax({
        url: baseURL + "action/auth/user/normal/AdministrativeDivisionAction/listProvince",
        success: function(data) {
            if (data.c == 0) {
                var provList  = data.d.listProvince
               for (let index = 0; index < provList.length; index++) {
                   const element = provList[index];
                   if(provice_name.indexOf(element.name) != -1){
                       provSelectId  = element.id
                       //获取市的id
                       getCityId(city_name,district_name)
                       //找到后立即结束循环，提高性能
                       break;
                   }
                   
               }        
        }
     }
    });
}
function getCityId(city_name,district_name){
    $.ajax({
        url: baseURL + "action/auth/user/normal/AdministrativeDivisionAction/listByPId",
        data:{
            pId : provSelectId
        },
        success: function(data){
            if (data.c == 0) {
            var list  = data.d.list
            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                if(city_name.indexOf(element.name) != -1){
                    citySelectId  = element.id
                    //获取区的id
                    getDistrictId(district_name)
                    break;
                }
            }
        }
     }
    });
}
function getDistrictId(district_name){
    $.ajax({
        url: baseURL + "action/auth/user/normal/AdministrativeDivisionAction/listByPId",
        data:{
            pId : citySelectId
        },
        success: function(data){
            if (data.c == 0) {
                var list  = data.d.list
                for (let index = 0; index < list.length; index++) {
                    const element = list[index];
                    if(district_name.indexOf(element.name) != -1 ){
                        districtSelectId  = element.id
                        break;
                    }
                }
            }    
     }
    })
}   
function getAddressInfoData(addressId){
    $.ajax({
        url: baseURL + "action/auth/user/normal/HxCsUserDeliveryAddressAction/get",
        data:{
            id: addressId 
        },
        success: function(data){
            if (data.c == 0) {
               var bean  = data.d.bean
               var detailStr = bean.provinceName + bean.cityName + bean.districtName
               provSelectId  = bean.province
               citySelectId = bean.city
               districtSelectId= bean.district
               isDefault  = bean.isDefault
               toggle  = isDefault== "0" ? false : true
               provName  = bean.provinceName
               cityName  = bean.cityName
               districtName= bean.districtName
               var imgPath  = isDefault== "0" ? "../Public/img/ico_unAdd.png": "../Public/img/icon_mark.png"
               $(".wh-editContaner").empty()
                var appendText = "";
                appendText += '<div class="wh-form-group">';
                appendText += '<label for="doc-vld-name-2">收货人:</label>';
                appendText += '<input class="wh-content" id="addressRecipients" type="text" placeholder="请输入名称" value="'+bean.recipients +'" />';
                appendText += "</div>";
                appendText += '<div class="wh-form-group">';
                appendText += '<label for="doc-vld-name-2">手机号码：</label>';
                appendText += '<input class="wh-content" id="addressPhoneNumber"  type="number" oninput="if(value.length>11)value=value.slice(0,11)" placeholder="请输入收货人手机号码" value="'+bean.contactNumber +'" />';
                appendText += "</div>";
                appendText += '<div class="wh-form-group" id="localClass">';
                appendText += ' <label for="doc-vld-name-2">所在地区：</label>';
                appendText += '<input class="wh-content" type="text" minlength="2" placeholder="请点击选择送货区域" value="'+ detailStr +'" readonly />';
                appendText += "</div>";
                appendText += '<div class="wh-form-group">';
                appendText += '<label for="doc-vld-name-2">详细地址：</label>';
                appendText += '<input class="wh-content" id="addressDetail" type="text" minlength="2" placeholder="请输入街道,小区等" value="'+ bean.detail +'" />';
                appendText += "</div>";
                appendText += '<div class="wh-form-group">';
                appendText += '<img class="wh-defuatIco" src="' + imgPath + '" alt="" />';
                appendText += '<span class="wh-default-name"> 默认地址 </span>';
                appendText += "</div>";
                $(".wh-editContaner").append(appendText); 
            }
            $("#localClass").address({
                prov: provName,
                city: cityName,
                district: districtName,
                scrollToCenter: true,
                footer: true,
                selectEnd: function (json) {
                   var  provText  = json.prov
                   var  cityText  = json.city
                   var  districtText  = json.district
                   getProviceId(provText,cityText,districtText)
                }
        });  
        $(".wh-defuatIco").click(function (event) {
            console.log(toggle);
           if (toggle) {
             $(this).attr("src", "../Public/img/ico_unAdd.png")
           } else {
             $(this).attr("src", "../Public/img/icon_mark.png")
           }
           toggle = !toggle;
       })  
     }
    });
}