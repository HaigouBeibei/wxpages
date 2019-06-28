var baseURL = "https://tongmeng.haigoubeibei.com/hiGou/";
var wjx_none = '☆'; // 空心五角星
var wjx_sel = '★'; // 实心五角星
var currentCapture;
var evaluateList = [];
$(function () {
   //获取待评价列表
   getEvaluateList()
   $(".container_content_save").click(function(){
       save()
   })
})

function save(){
    evaluateList = []
    var liList  = $("#evaluateList").children()
    for (let index = 0; index < liList.length; index++) {
        var element = liList[index];
        var orderDetailsId  = $(element).attr("orderDetailId")
        var rateScore  = $(element).attr("rateScore")
        if (!rateScore){
            alert("部分商品的描述相符为空，请为它打分！")
            return ;
        }
        var content = $(element).attr("content")
        // content  = content ? content : ''
        var imgs = $(element).attr("imgs")
        // imgs  =  imgs ? imgs : ''
        tempObj = {
            "orderDetailsId":orderDetailsId,
            "rateScore": rateScore,
            "content":content,
            "imgs": imgs,
        }
        evaluateList.push(JSON.stringify(tempObj));  
    }
    var evaluateJsonStr  = '[' + evaluateList.toString() + ']'
    console.log(evaluateJsonStr)

    var orderId  = getQueryString("orderId")
    $.ajax({
        url: baseURL + "action/auth/user/normal/MerchantShopOrderAction/orderEvaluation",
        data:{
            id: orderId ,
            rateArr:evaluateJsonStr,
        },
        success: function(data) {
            if(data.c == '0'){
                history.back(-1);
            }else{
               showError(data.m) 
            }
        }
    })

}

function fileup(e) {
    console.log(e)
    if (e.target.files){
        var imgFile = e.target.files[0]; //获取图片文件
        var formData = new FormData();
        formData.append('file', imgFile); 
        $.ajax({
            url:  baseURL+'action/auth/user/normal/HxSysUploadAction/uploadImgSmall',
            type: 'POST',
            cache: false,
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                if(data.c == '0'){
                 currentCapture.parents(".wh-addImg-ul").prepend('<li> <img alt="" src='+baseURL+data.d+' class="wh-img-li" /> </li>') 
                 var imgListStr = currentCapture.parents("#evaluateList li").attr("imgs")
                 //如果有就添加，没有就创建
                if(imgListStr){
                    var ids = [];
                    ids.push(imgListStr)
                    ids.push(data.d)
                    var idStr = ids.join(',')
                    currentCapture.parents("#evaluateList li").attr("imgs",idStr)    
                } else{
                    currentCapture.parents("#evaluateList li").attr("imgs",data.d)  
                }
                }else{
                   showError(data.m) 
                }
             },
             error: function(err){
                alert(err)
            }
         
        }) 
    }
}

function getEvaluateList(){
    var orderId  = getQueryString("orderId")
    $.ajax({
        url: baseURL + "action/auth/user/normal/MerchantShopOrderDetailsAction/listToBeEvaluated",
        data:{
            id: orderId ,
        },
        success: function(data) {
            if(data.c == '0'){
              var list  = data.d  
              parseDataWithView(list)
              console.log(data);
            }else{
               showError(data.m) 
            }
        }
    });
}

function parseDataWithView(list){
    $("#evaluateList").empty()
    for (let index = 0; index < list.length; index++) {
        var appendText = ''
        const element = list[index];
         appendText = '<li orderDetailId ='+element.orderDetailsId+'>';
         appendText +='<div class="wh-listContaner">';
         appendText +='<img class="am-fl wh-header-imgSet" alt="" src='+ baseURL+element.img +' />';
         appendText +='<div class="am-vertical-align-middle wh-header-contentSize">';
         appendText +='<p class="wh-titleSet"> 描述相符:</p>';
         appendText +='</div>';
         appendText +='<div class="box">';
         appendText +='<ul class="comment" name="startLevel">';
        for (let index = 1; index <=5 ; index++) {
         appendText +='<li value="'+ String(index)+ '">☆</li>' ;     
        }
        appendText +='</ul>';
        appendText +='</div>';
        appendText +='</div>';
        appendText +='<div class="wh-inputContaner">';
        appendText +='<div>';
        appendText +='<textarea class="wh-inputContent" cols="8" rows="20" placeholder="宝贝满足你的期待吗？说说你的使用心得，分享结想买的朋友们！"></textarea>' ;
        appendText +='</div>';
        appendText +='<div class="wh-addImgContaner">';
        appendText +='<ul class="wh-addImg-ul">';
        appendText +='<li class="wh-img-li">';
        appendText +='<img alt="" src="../Public/img/takePhoto.png" class="wh-img-li" />';
        appendText +='</li>';
        appendText +='</ul>';
        appendText +='</div>';
        appendText +='</div>';
        appendText +='</li>';
        $("#evaluateList").append(appendText)
    }
    //鼠标移进变实星
   $(".comment li").on("mouseover", function () {
    $(this).text(wjx_sel).prevAll("li").
        text(wjx_sel).end().nextAll().text(wjx_none);
    // $("#aaa").val($(this).val());
    });
    //鼠标移出变空星
    $(".comment li").on("mouseout", function () {
        if ($("li.current").length === 0) {
            $(".comment li").text(wjx_none);
        } else {
            $("li.current").text(wjx_sel).prevAll().text(wjx_sel).end().nextAll().text(wjx_none);
        }
    });
    //鼠标点击保持当前状态 获取星级
    $(".comment li").on("click", function () {
        $(this).attr("class", "current").siblings().removeClass("current");
        $("#aaa").val($(this).val());
        var startLevel = $(this).val()
        $(this).parents("#evaluateList li").attr("rateScore",startLevel)
        
    });
    //获取文本值
    $('.wh-inputContent').bind('input propertychange','textarea',function(){
        var cotentStr =$(this).val();
        console.log(cotentStr)
        $(this).parents("#evaluateList li").attr("content",cotentStr)
     });
 
    $(".wh-addImg-ul>li").click(function () {
        var takePicture = document.getElementById('takepicture');
        takePicture.click();
        currentCapture  = $(this)
    })
}
