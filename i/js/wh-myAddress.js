
var abloutUrl = ''
var addressId  = ''
var toURL = ''
$(function() {
      var begin = window.location.href.indexOf('//////');
      var end = window.location.href.indexOf('////////');
      if (begin > -1){
        toURL = window.location.href.substring(begin + 6, end);
        console.log(toURL)
      }
     
     initAddressList()
     $(".wh-address").click(function (){
      if (toURL.length > 0){
        console.log(2)
        location.href ="wh-newAddress.html?callback=" + '//////' + toURL + '////////'
      }else{
        location.href="wh-newAddress.html"
      }
   })
  });
function initAddressList() {
    $.ajax({
      url: baseURL + "action/auth/user/normal/HxCsUserDeliveryAddressAction/listOfMine",
      success: function(data) {
        if (data.c == "0") {
        var list = data.d.list
        console.log(list);
        
        $(".wh-nav").empty()
        if (list.length<=0) {
          emptyView()
        } else {
          filterDataWithList(list)
        }
      }else{
        showError(data.m) 
      }
      $(".wh-customerDelete").click(function(data){
        var currentId= $(this).attr('address_id') 
        showDeltePop("删除地址","是否删除当前地址?",currentId)
     })
     
     $(".wh-customerEdit").click(function(data){
        var currentId= $(this).attr('address_id') 
        if (toURL.length >0){
          location.href ="wh-eidtAddress.html?addressId="+currentId+"&callback=" + '//////' + toURL + '////////'
        }else{
          location.href="wh-eidtAddress.html?addressId="+currentId
        }
     })
     $(".wh-customerUseAddress").click(function(){
      var address_id =$(this).attr('address_id')
      if(toURL.indexOf("orderPreview.html")>-1){
        abloutUrl  = toURL + "&deliveryAddressId=" + address_id
      }else {
        abloutUrl  = toURL
      }
      location.href= abloutUrl
     })
    }
    });
 }
//绘制空页面
function emptyView(){
  var appendText = "";
  appendText += '<li>';
  appendText += '<label class="wh-empty">您还没有添加收货地址，请先添加收货地址！</label>';
  appendText += "</li>";
  $(".wh-nav").append(appendText); 
}
  //填充数据绘制界面
function filterDataWithList(list){
  var appendText = "";
  for (let index = 0; index < list.length; index++) {
 
    const element = list[index];
    var typeId = getQueryString("callback");
    var isAdd  = true
    if (typeId){
      isAdd  = true
    }else{
      isAdd  =  false
    }
    var detailStr  = "收货地址: " + element.provinceName + element.cityName + element.districtName + element.detail
     appendText += '<li>';
     appendText += '<div class="wh-labalContaner">';
     appendText += '<label class="wh-leftLable">'+element.recipients +"</label>";
     appendText += '<label class="wh-rightLable">'+element.contactNumber +"</label>";
     appendText += "</div>";
     appendText += '<p class="wh-content">'+ detailStr +"</p>";
     appendText += '<div class="wh-item-foot">';
     appendText += '<div class="wh-div-tile">';
     if (element.isDefault=="1"){
       appendText += '<img class="wh-defuatIco" src="../Public/img/icon_mark.png" alt="" />'+ " 默认地址"+"</div>";
     }else{
       appendText += '<img  src="" alt="" /> </div>'; 
     }
     if(isAdd){
       appendText += '<a class="wh-customerUseAddress wh-customerSize" address_id="' + element.id + '"> 使用此地址 </a>';
     }
     appendText += '<a class="wh-customerDelete wh-customerSize" address_id="' + element.id + '">删除</a>';
     appendText += '<a class="wh-customerEdit wh-customerSize"  address_id="' + element.id + '"> 编辑 </a>';
     appendText += "</div>";
     appendText += "</li>";
    }
    $(".wh-nav").append(appendText); 
}
//删除弹窗
function showDeltePop(title,showMessage,addressId) {
    var errorForm = "";
    errorForm += '<div class="am-modal am-modal-confirm" tabindex="-1" id="errorForm">';
    errorForm += '<div class="am-modal-dialog">';
    errorForm += '<div class="am-modal-hd">'+title +'</div>';
    errorForm += '<div class="am-modal-bd">';
    errorForm += showMessage;
    errorForm += "</div>";
    errorForm += '<div class="am-modal-footer">';
    errorForm += '<span class="am-modal-btn" data-am-modal-cancel>取消</span>';
    errorForm += '<span class="am-modal-btn" style="color:#f0250f" data-am-modal-confirm>确定</span>';
    errorForm += "</div></div></div>";
    $("body").append(errorForm);
    $("#errorForm").modal({
      relatedTarget: this,
      onConfirm: function(options) {
      deleteSelctAddress(addressId)
      },
      onCancel: function() {
      }
    });
  }
  //删除
function deleteSelctAddress(addressId){
      $.ajax({
        url: baseURL + "action/auth/user/normal/HxCsUserDeliveryAddressAction/delete",
        data:{
           id : addressId
        },success:function(data){
           if(data.c ==0){
             console.log(data);
             window.location.reload();
             
           }
        }
      })
}  