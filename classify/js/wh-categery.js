var page = 0;
var condition = "time";
var direction = "desc";
var typeId = '';
var isSpecialType = false;
$(function () {
  var cateGaryTypeId  = getQueryString("smtype")
  if (cateGaryTypeId == '9.9CNY'){
    $("#divscroller").hide()  
    $("#specialPrice").show()
    isSpecialType = true;
    var cateGaryTypeNmae  = getQueryString("smname")
    $("#specialPrice").text(cateGaryTypeNmae)
    typeId  =  getQueryString("smid")
    scroll()
  }else{
    $("#divscroller").show()  
    $("#specialPrice").hide()
     initContaner();
  }
  initBodyContanerView();
})

function scroll() {
    $('#upLoading').scrollspy({
        animation: 'slide-bottom',
        delay: 200,
        repeat: true
    });
    $('#upLoading').on('inview.scrollspy.amui', function() {
        page++;
        getGoodListView()
    }).on('outview.scrollspy.amui', function() {
        $('#upLoading').html('<p class="am-text-center am-link-muted">上拉加载更多...</p>');
    });
}
function timeClick(isTime, type) {
    page = 1;
    if (isTime) {
        condition = "time";
        direction = type;
    } else {
        condition = "price";
        direction = type;
    }
    getGoodListView()
}

function initContaner(){
   
    var smTypeId  = getQueryString("smid")
    console.log(typeId);
     $.ajax({
     url: baseURL + 'action/GlobalSettingsShortcutMenuAction/getTypeIdList',
     data:{
        menuId : smTypeId,
     },
     success: function(data) {
        if (data.c =='0'){
            var list  = data.d
            console.log(list);
            parseDataWithHeadView(list)
        }else{
        alert(data.m)
        }
     },error: function(data) {
        showError(data);
    }
    })
}
//上部导航栏
function parseDataWithHeadView(list){
    // $(".box123").empyty
    $(".box123").empty()
    var appendText ='';
    for (let index = 0; index < list.length; index++) {
        const element = list[index];
        appendText += '<li value='+ element.id+'>';
        appendText += '<span >'+ element.name+'</span>';
        appendText += '</li>';
    }
    $(".box123").append(appendText)
    originHeaderCLick()
    $(".box123 li").click(function () {
        $(this).addClass('wh-selectLi')
        $(this).siblings().removeClass("wh-selectLi")
        typeId  = $(this).attr('value')
        page = 1;
        getGoodListView()

    })  
}
 //初始化数据
function originHeaderCLick(){
    $(".box123 li:first").addClass("wh-selectLi")
    typeId  = $(".box123 li:first").attr('value')
    scroll()
}
//获取分类下商品列表
function getGoodListView(){
    console.log(typeId,condition,direction,page);
    if(isSpecialType){
        $.ajax({
        url: baseURL + 'action/MerchantGoodsAction/list10CNY' ,
        data:{
            page: page,
            limit : 20,
            condition : condition,
            direction : direction,
        },
        success: function(data) {
        if (data.c =='0'){
            var list = data.d.list;
            getGoodList(list);
            $('#upLoading').show()
            if(page ==1){
                $(".am-g").empty();    
            }
            if (list.length < 20) {
                $('#upLoading').html('<p class="am-text-center am-link-muted">我是有底线的！</p>');
            }
            getGoodList(list);
        }else{
          showError(data.m)
         }
        }
      })

    }else{
    $.ajax({
    url: baseURL + 'action/MerchantGoodsAction/listByTypeId',
    data:{
        page: page,
        limit : 20,
        typeId : typeId,
        condition : condition,
        direction : direction,
    },
    success: function(data) {
        if (data.c =='0'){
            console.log(data);
            var list = data.d.list;
            getGoodList(list);
            $('#upLoading').show()
            if(page ==1){
                $(".am-g").empty();    
            }
            if (list.length < 20) {
                $('#upLoading').html('<p class="am-text-center am-link-muted">我是有底线的！</p>');
            }
            getGoodList(list);
        }else{
        showError(data.m)
        }
     },error: function(data) {
        showError(data);
    }
    })
 }  
}

function getGoodList(datas) {
    for (const key in datas) {
        if (datas.hasOwnProperty(key)) {
            var appendText = "";
            appendText += '<div class="am-u-sm-6 wh-gooditemheigh">';
            appendText += '<div class="am-thumbnail">';
            appendText += '<a href="' + baseURL + 'wxpages/classify/goods_detail.html?gid=' + datas[key].id + '">';
            appendText += '<img class="wh-imgHeight" src="' + baseURL + datas[key].imgListPage + '" alt="" /></a>';
            appendText += '<a href="' + baseURL + 'wxpages/classify/goods_detail.html?gid=' + datas[key].id + '" class="am-link-muted">'
            appendText += '<div class="am-thumbnail-caption am-padding-xs">';
            appendText += '<h4 class="am-margin-bottom-0  line-clamp">' + datas[key].name + "</h4>";
            appendText += '<span class="price am-text-lg wh-priceColor" >￥' + handlePrice(datas[key].listPagePriceCurrent) + "</span>";
            appendText += '<span class="oldPrice am-text-xs"><del>￥' + handlePrice(datas[key].listPagePriceOriginal) + "</del></span>";
            appendText += '<br /><a class="am-badge am-badge-warning am-round"></a>';
            appendText += "</div>";
            appendText += "</a>";
            appendText += "</div>";
            appendText += '<div class="wh-cleanFloat"></div>'
            appendText += "</div>";
            $(".am-g").append(appendText);
        }
    }
}

function setCurrentSelectImag() {
    $("ul.wh-nav li a img#timeUp").attr("src", "../Public/img/icon_up.png");
    $("ul.wh-nav li a img#timeDown").attr("src", "../Public/img/icon_down.png");
    $("ul.wh-nav li a img#priceUp").attr("src", "../Public/img/icon_up.png");
    $("ul.wh-nav li a img#priceDown").attr("src", "../Public/img/icon_down.png");
}
//设置的条件容器
function initBodyContanerView(){
   //时间排序
   $("ul.wh-nav li a#timeItem").click(function(event) {
    event.stopPropagation();
    setCurrentSelectImag(); //初始化设置
    $("ul.wh-nav li a img#timeUp").attr("src", "../Public/img/icon_up_cor.png")
    timeClick(true, 'asc') //请求方法

})
$("ul.wh-nav li a img#timeUp").click(function(event) {
    // 获取子点击
    event.stopPropagation();
    setCurrentSelectImag(); //初始化设置
    $(this).attr("src", "../Public/img/icon_up_cor.png");
    //遍历获取除当前节点的所有子节点
    timeClick(true, "asc");
})
$("ul.wh-nav li a img#timeDown").click(function(event) {
        // 获取子点击
        event.stopPropagation();
        setCurrentSelectImag(); //初始化设置
        $(this).attr("src", "../Public/img/icon_down_cor.png");
        //遍历获取除当前节点的所有子节点
        timeClick(true, "desc");

    })
    //价格排序
$("ul.wh-nav li a#priceItem").click(function(event) {
    // 获取子点击
    event.stopPropagation();
    setCurrentSelectImag(); //初始化设置
    $("ul.wh-nav li a img#priceUp").attr("src", "../Public/img/icon_up_cor.png");
    timeClick(false, "asc");


})
$("ul.wh-nav li a img#priceUp").click(function(event) {
    // 获取子点击
    event.stopPropagation()
    setCurrentSelectImag(); //初始化设置
    $(this).attr("src", "../Public/img/icon_up_cor.png");
    timeClick(false, "asc");
    //遍历获取除当前节点的所有子节点

})
$("ul.wh-nav li a img#priceDown").click(function(event) {
        // 获取子点击
        event.stopPropagation();
        setCurrentSelectImag(); //初始化设置
        $(this).attr("src", "../Public/img/icon_down_cor.png");
        timeClick(false, "desc");
        //遍历获取除当前节点的所有子节点
    })
}   