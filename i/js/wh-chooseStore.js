var baseURL = "https://tongmeng.haigoubeibei.com/hiGou/"
$(function () {
    getDataList()
})

function getDataList(){
   $.ajax({
   url: baseURL + 'action/auth/user/normal/MerchantShopTypeAction/list',
   success: function(data) {
        if (data.c =='0'){
           var list = data.d.list
           parseDataWithListView(list)
        }else{
           showError(data.m)
       }
    }
   })
}

function parseDataWithListView(list){
  $("#myIdList").empty()
  var categeryID = getQueryString("categaryId")
  var  appendText ='';
  for (let index = 0; index < list.length; index++) {
       const element = list[index]; 
      appendText +='<li class="wh-contaner" id ='+element.id +' name='+ element.name+'>';
      appendText +='<a class="wh-color">'+element.name+'</a>';
      appendText +='<div class="wh-setting">';
      if (!isStringEmpty(categeryID)){
         if (categeryID == element.id){
            appendText +='<img class="am-fr wh-imgfloat" alt="" src="../Public/img/channel_selection.png" />';
         }
      }
      appendText +='</div>';
      appendText +='</li>';
  }
  $("#myIdList").append(appendText) 

  $(".wh-contaner").click(function(){
      var categeryId = $(this).attr('id')
      var categeryName = $(this).attr('name')
      window.location.href= baseURL +'wxpages/i/wh-storeCertification.html?categaryId=' + categeryId +'&categeryName=' + categeryName
  })
}

