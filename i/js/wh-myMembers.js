var baseURL = "https://tongmeng.haigoubeibei.com/hiGou/";
$(function () {
    loadDataList()
})

function loadDataList(){
    $.ajax({
        url:baseURL + "action/auth/user/normal/HxCsUserAction/numberOfMyUser",
        success:function(data){
          console.log(data);    
          if (data.c =="0"){
             var  dic  = data.d;
             parseDataWithView(dic);
             paresNewTotalWithView(dic);
             paresNewTotalWithFooterView(dic);
             $(".wh-setting#firstTest").click(function () {
              location.href = "wh-myHighStarMembers.html"
            })
          }else{
             showError(data.m)
          }
        }
    })
}
//headView
function parseDataWithView(dic){
       
    $("#myIdList").empty();
    var appendText = "";
    appendText += '<li class="wh-contaner">';
    appendText += '<a class="wh-color">一星会员</a>';
    appendText += '<div class="wh-setting" id="firstTest">';
    appendText += '<img class="am-fr wh-imgfloat" alt="" src="../Public/img/invite_friends_next.png"  />'
    appendText += '<span class="am-fr wh-color wh-personNumberFontSet">'+dic.userFirstLevelCount+'人'+'</span>';
    appendText += '</div>';
    appendText += '</li>';
    appendText += '<li class="wh-contaner">';
    appendText += '<a class="wh-color">二星会员</a>';
    appendText += '<div class="wh-setting">';
    appendText += '<span class="am-fr wh-rightAlign wh-color wh-personNumberFontSet">'+dic.userSecondLevelCount+'人'+'</span>';
    appendText += '</div>';
    appendText += '</li>';
    $("#myIdList").append(appendText);
}

//总人数
function paresNewTotalWithView(dic){
  $("#newAddTotalPerson").empty()
  var appendText = "";
  appendText +='<h3 class="wh-addMembers">'+ '今日新增('+ dic.newUserTotalCount +'人)'+ '</h3>';
  $("#newAddTotalPerson").append(appendText);
}

//底部视图
function paresNewTotalWithFooterView(dic){
  $("#myAddList").empty()
  var appendText = "";
    appendText += '<li class="wh-contaner">';
    appendText += '<a class="wh-color">一星会员</a>';
    appendText += '<div class="wh-setting">';
    appendText += '<span class="am-fr wh-rightAlign wh-color wh-personNumberFontSet ">'+dic.newUserFirstLevelCount+'人'+'</span>';
    appendText += '</div>';
    appendText += '</li>';
    appendText += '<li class="wh-contaner">';
    appendText += '<a class="wh-color">二星会员</a>';
    appendText += '<div class="wh-setting">';
    appendText += '<span class="am-fr wh-rightAlign wh-color wh-personNumberFontSet">'+dic.newUserSecondLevelCount+'人'+'</span>';
    appendText += '</div>';
    appendText += '</li>';
    $("#myAddList").append(appendText);
}

