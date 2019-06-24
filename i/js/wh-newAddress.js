var baseURL = "https://tongmeng.haigoubeibei.com/hiGou/"
var provSelectId = ""
var citySelectId = ""
var districtSelectId = ""
var toggle = true
var toURL = ''
$(function() {
    var begin = window.location.href.indexOf('//////');
    var end = window.location.href.indexOf('////////');
    if (begin>-1){
        toURL = window.location.href.substring(begin + 6, end); 
    }
    $("#localClass").address({
            prov: "北京",
            city: "北京",
            district: "朝阳区",
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
        if (toggle) {
          $(this).attr("src", "../Public/img/ico_unAdd.png")
        } else {
          $(this).attr("src", "../Public/img/icon_mark.png")
        }
        toggle = !toggle;
    })
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
                showError(data.m);
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
    });
}


 

