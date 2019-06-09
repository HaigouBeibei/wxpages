var baseURL = "https://tongmeng.haigoubeibei.com/hiGou/"
$(function() {
     initAddressList()
     
  });

  function initAddressList() {
//     // 请求数据
    $.ajax({
      url: baseURL + "action/auth/user/normal/HxCsUserDeliveryAddressAction/listOfMine",
      success: function(data) {
        if (data.c == 0) {
        var list = data.d.list
        $(".wh-nav").empty()
        for (let index = 0; index < list.length; index++) {
               const element = list[index];
               console.log(element)
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
                  appendText += '<img class="wh-defuatIco" src="../Public/img/icon_mark.png" alt="" />'+ "默认地址"+"</div>";
                }else{
                  appendText += '<img  src="" alt="" /> </div>'; 
                }
                appendText += '<a class="wh-customerDelete" address_id="' + element.id + '">删除</a>';
                appendText += '<a class="wh-customerEdit"  address_id="' + element.id + '"> 编辑 </a>';
                appendText += "</div>";
                appendText += "</li>";
                $(".wh-nav").append(appendText); 
        }
        $(".wh-customerDelete").click(function(data){
           var currentId= $(this).attr('address_id') 
           showDeltePop("删除地址","是否删除当前地址?",currentId)
        })
        $(".wh-customerEdit").click(function(data){
           var currentId= $(this).attr('address_id') 
           location.href="wh-eidtAddress.html?addressId="+currentId
        })
        }else{
          showError(data.m) 
        }
      }
    });
  }

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
        // window.location.reload();
        deleteSelctAddress(addressId)
      },
      onCancel: function() {
      }
    });
  }
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