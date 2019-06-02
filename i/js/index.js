$(function() {
  getPersonalInfo();
});

//获取个人信息
function getPersonalInfo() {
  $.ajax({
    url: baseURL + "action/auth/csUser/HxCsUserAction/getBySession",
    success: function(data) {
      if (data.c == 0) {
        //console.log(data);
        $("#avatar").attr("src", baseURL + data.d.avatar);
        $("#nickName").text(data.d.nickname);
        var merchantState = "普通会员";
        switch (data.d.merchantState) {
          case 1:
            merchantState = "商家";
            break;
          case 2:
            merchantState = "申请商家中";
            break;
          case 3:
            merchantState = "普通会员";
            break;
        }
        $("#merchantState").text("会员等级：" + merchantState);
      }
    }
  });
}


