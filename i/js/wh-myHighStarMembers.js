
var  page = 0;      
$(function () {
    // initDataList()
    scroll()
})
function scroll() {
    $('#upLoading').scrollspy({
        animation: 'slide-bottom',
        delay: 200,
        repeat: true
    });
    $('#upLoading').on('inview.scrollspy.amui', function() {
        page++;
        console.log(page);
        initDataList()
    }).on('outview.scrollspy.amui', function() {
        $('#upLoading').html('<p class="am-text-center am-link-muted">上拉加载更多...</p>');
    });
}

//初始化数据
function initDataList(){
        $.ajax({
            url:baseURL + "action/auth/user/normal/HxCsUserAction/listSon",
            data:{
              page:page,
              limit:'20',
            },
            success:function(data){   
              if (data.c =="0"){
                  console.log(data);
                  var list = data.d;
                  parseDataWithView(list)
              }else{
                alert(data.m)
              }
            }
     })
}

function parseDataWithView(list){
    if(page==1){
        $(".am-list").empty()  
    }
    if (list.length < 20) {
        $('#upLoading').html('<p class="am-text-center am-link-muted">我是有底线的！</p>');
    }
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
        // appendText += '<img class="wh-imgPhone" alt="" src="../Public/img/ico_phone_white.png" width="15" height="15"/>';
        appendText += "</li>";
        $(".am-list").append(appendText);
    }

}
