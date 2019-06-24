var baseURL = "https://tongmeng.haigoubeibei.com/hiGou/";
var wjx_none = '☆'; // 空心五角星
var wjx_sel = '★'; // 实心五角星
$(function () {
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
        $("li .current").text(wjx_sel).prevAll().text(wjx_sel).end().nextAll().text(wjx_none);
    }
});
//鼠标点击保持当前状态
$(".comment li").on("click", function () {
    $(this).attr("class", "current").siblings().removeClass("current");
    $("#aaa").val($(this).val());
});
$(".wh-addImg-ul>li").click(function () {
    var takePicture = document.getElementById('takepicture');
    takePicture.click();
   
    // $(".wh-addImg-ul").prepend('<li> <img alt="" src="../Public/img/takePhoto.png" class="wh-img-li" /> </li>');
})
})

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
                alert(3)
                if(data.c == '0'){
                //    console.log(data);
                alert(data.d.paths[0])
                   
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
