var baseURL = "https://tongmeng.haigoubeibei.com/hiGou/"
$(function() {
     initAddressList()
     $(".wh-address").click(function (){
      location.href="wh-newAddress.html"
   })
  });

function initAddressList() {
    $.ajax({
      url: baseURL + "action/auth/user/normal/HxCsUserDeliveryAddressAction/listOfMine",
      success: function(data) {
        if (data.c == 0) {
        var list = data.d.list
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
        location.href="wh-eidtAddress.html?addressId="+currentId
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
  for (let index = 0; index < list.length; index++) {
    const element = list[index];
    var typeId = getQueryString("callback");
    var isAdd  = true
    if (typeId){
      isAdd  = true
    }else{
      isAdd  =  false
    }
    console.log(isAdd)
    var detailStr  = "收货地址: " + element.provinceName + element.cityName + element.districtName + element.detail
    var appendText = "";
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
       appendText += '<a class="wh-customerEdit wh-customerSize" address_id="' + element.id + '"> 使用此地址 </a>';
     }
     appendText += '<a class="wh-customerDelete wh-customerSize" address_id="' + element.id + '">删除</a>';
     appendText += '<a class="wh-customerEdit wh-customerSize"  address_id="' + element.id + '"> 编辑 </a>';
     appendText += "</div>";
     appendText += "</li>";
     $(".wh-nav").append(appendText); 
    }
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