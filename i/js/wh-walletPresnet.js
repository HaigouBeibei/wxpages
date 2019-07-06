
var orderSn = '';
$(function () {
    initKeyboard()
    //获取手机号
    $('#presentNumber').bind('input propertychange','input',function(){
        var cotentStr =$(this).val();
         if(cotentStr.length ==11){
          getAccountName(cotentStr)
        }
     });
     //保存
     $(".container_content_save").click(function(){
          save()
     })
     //全部转赠
     $(".wh-blanceBtn").click(function(){
        $("#presentPrice").attr("value",handlePrice(totalPrice));
     })
     var totalPrice= getQueryString("totalPrice")
     $("#totalAccount").text(handlePrice(totalPrice)+'元')
})

function getAccountName(phoneNUmber){
       $.ajax({
       url: baseURL+'action/auth/user/normal/HxCsUserAction/getPayee',
       data:{
        account:phoneNUmber,
       },
       success: function(data) {
            if (data.c =='0'){
                console.log(data);
               var name = '当前用户为: ' + data.d.nickname 
               orderSn  = data.d.noncestr
               setAccoutName(name)
            }else{
               var name  = '用户不存在'
               setAccoutName(name)
          }
        }
    })
}
function setAccoutName(name){
  $("#accountName").text(name)
}
//键盘事件绑定
function initKeyboard() {
    var keyboard = document.querySelector('.keyboard').querySelectorAll('li');
    for (var i = 0; i < keyboard.length; i++) {
        keyboard[i].addEventListener('click', function() {
            set_num(this.innerHTML)
        }, false);
}

function set_num(num) {
    var spans = document.querySelector('.password').querySelectorAll('span');
    if (/[0-9]/.test(num)) {
        var index = 0;
        for (var i = 0; i < spans.length; i++) {
            var val = spans[i].innerHTML;
            index = i;
            if (!val) {
                spans[i].innerHTML = num;
                spans[i].setAttribute('data-num', num);
                setTimeout(function() {
                    spans[i].innerHTML = '*';
                }, 200);
                break;
            }
        }
        if (index == 5) {
            var password = '';
            for (var j = 0; j < spans.length; j++) {
                var val = spans[j].getAttribute('data-num');
                password += val;
            }
            //在这触发
            balancePay(orderSn, password);
            setTimeout(function() {
                for (var k = 0; k < spans.length; k++) {
                    spans[k].innerHTML = '';
                    spans[k].setAttribute('data-num', '');
                }
            }, 300);
        }
    } else if (num == '删除') {
        var index = 0;
        for (var i = 0; i < spans.length; i++) {
            var val = spans[i].innerHTML;
            if (val) {
                index = i;
            }
        }
        spans[index].innerHTML = '';
        spans[index].setAttribute('data-num', '');
    }
 }
}
function save(){
    var phoneNumber = $('#presentNumber').val() 
    var presentPrice = $("#presentPrice").val()
    if(isStringEmpty(phoneNumber)){
        alert('请输入获赠人手机号!')
        return
    }
    if (phoneNumber.length != 11){
        alert('请输入手机号不足11位')
        return;
    }
    if(isStringEmpty(presentPrice)){
       alert('转赠金额不能为0!')
    }
    $('#keyboard').modal('open');
}

//余额支付
function balancePay(orderSn, payPwd) {
    var phoneNumber = $('#presentNumber').val() 
    var presentPrice = $("#presentPrice").val()
    console.log(presentPrice);
    
    finalPassword = $.md5(orderSn + '007' + $.md5(payPwd));
    $.ajax({
        url: baseURL + 'action/auth/user/normal/HxCsUserAction/transfer',
        data: {
            payeeAccount:phoneNumber,
            amount:Number(presentPrice)*100,
            payPassword: finalPassword,
        },
        success: function(data) {
            console.log(data);
            $('#keyboard').modal('close');
            if (data.c == '0') {
                history.go(-1);
            }else if (data.c == '1') {
                showError('设置支付密码', '去设置密码>>>', '../i/password.html');
            } 
            else {
                alert(data.m);
            }
        },
        error: function(data) {
            $('#keyboard').modal('close');
            showError(data.m);
        }
    });
}
