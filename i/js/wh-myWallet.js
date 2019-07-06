
var page= 0;
var currentType = ''; 
var totalPrice = '';

$(function () {
    getFristData()
    //收入支出切换
    $(".wh-header").click(function(){
        $(this).addClass("wh-headerBorder")
        $(this).siblings().removeClass("wh-headerBorder")
        page = 1 
        currentType = $(this).attr('value')
        getLoadListWithType()
    })
    $("#walletPresent").click(function(){
        window.location.href = baseURL + "wxpages/i/wh-walletPresnet.html?totalPrice=" + totalPrice
    })
    $("#walletApply").click(function(){
        alert("该功能正在开发中，敬请期待!")
    })
})
//上拉加载下拉刷新
function scroll() {
    $('#upLoading').scrollspy({
        animation: 'slide-bottom',
        delay: 200,
        repeat: true,
    });
    $('#upLoading').on('inview.scrollspy.amui', function() {
        page++;
        getLoadListWithType(currentType)
    }).on('outview.scrollspy.amui', function() {
        $('#upLoading').html('<p class="am-text-center am-link-muted">上拉加载更多...</p>');
    });
}
//初始化默认数据
function getFristData() {
    var list = $(".wh-header").eq(0)
    currentType = list.attr('value')
    list.addClass("wh-headerBorder")
    list.siblings().removeClass("wh-headerBorder")
    scroll()
}

function getLoadListWithType(){
    $.ajax({
        url: baseURL + "action/auth/user/normal/HxCsUserWalletHistoryAction/list",
        data: {
            state: currentType,
            page: page,
            limit: '20',
        },
        success: function(data) {
            if (data.c == '0') {
                var list = data.d
                console.log(list);
                parseDataWithHeaderView(list)
                 parseDataWithListView(list)
            } else {
                alert(data.m)
            }
        }
    })
}

function parseDataWithHeaderView(list){
   $("#walletPrice").text(handlePrice(list.balance))
   totalPrice  = list.balance
}

function parseDataWithListView(list){
    if (page == 1) {
        $(".wh-nav").empty()
    }
    if (list.list.length < 20) {
        $('#upLoading').html('<p class="am-text-center am-link-muted">我是有底线的！</p>');
    }
     var appendText = '';
     for (let index = 0; index < list.list.length; index++) {
         const element = list.list[index];
         appendText +='<li>';
         appendText +='<p class="wh-leftLi wh-rightSize">'+element.type+'</p>'; 
         appendText +='<div class="wh-rightLi ">';
         appendText +='<p class="wh-rightLine wh-rightSize">'+ handlePrice(element.amountChange) +'元'+'</p>';
         appendText +='<p class="wh-rightLine">'+element.createdTime+'</p>';
         appendText +='</div>';
         appendText +='</li>';
     }
     $(".wh-nav").append(appendText)
}
