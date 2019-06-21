var baseURL = "https://tongmeng.haigoubeibei.com/hiGou/";
      
$(function () {
    initDataList()
})

//初始化数据
function initDataList(){
        $.ajax({
            url:baseURL + "action/auth/user/normal/HxCsUserAction/infoOfMyFirstLevel",
            success:function(data){
              console.log(data);    
              if (data.c =="0"){
                  var list = data.d.list;
                  parseDataWithView(list)
              }else{
                 showError(data.m)
              }
            }
        })
}

function parseDataWithView(list){
    $(".am-list").empty()
    for (let index = 0; index < list.length; index++) {
        const element = list[index];
        var appendText = "";
        appendText += '<li class="wh-contaner wh-coutmerLi">'; 
        appendText += '<div class="wh-imgContaner">';
        if(element.avatar){
            appendText += '<img class="am-fr wh-imgSize" alt=""  src="'+ baseURL +element.avatar + '" />';   
        } else{
            appendText += '<img class="am-fr wh-imgSize" alt="" src="../Public/img/portrait_loading.png" />';    
        }
        appendText += "</div>";
        appendText +='<div class="wh-content">';
        appendText += '<ul class="wh-contentUl">';
        appendText += '<li class="wh-content-label wh-fontSet">'+ element.nickname + "</li>";
        appendText += '<li class="wh-content-label wh-itemtColorSet">'+ element.createdTime + "</li>";
        appendText += "</ul>";
        appendText += "</div>";
        appendText += '<img class="wh-imgPhone" alt="" src="../Public/img/ico_phone_white.png" width="15" height="15"/>';
        appendText += "</li>";
        $(".am-list").append(appendText);
    }

}
