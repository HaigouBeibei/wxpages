
$(function () {
    getDataList()
})

function getDataList(){
   $.ajax({
   url: baseURL + 'action/auth/user/normal/MerchantShopTypeAction/list',
   success: function(data) {
        if (data.c =='0'){
           var list = data.d.list
           console.log(list);
           parseDataWithListView(list)
        }else{
         alert(data.m)
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
      appendText +='<li class="wh-contaner" id ='+element.id +' name='+ element.name+' storeType='+ element.isFood+' >';
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
      var categeryType = $(this).attr('storeType')
      window.location.href= baseURL +'wxpages/i/wh-storeCertification.html?categaryId=' + categeryId +'&categeryName=' + categeryName +'&categeryType=' + categeryType
  })
}

