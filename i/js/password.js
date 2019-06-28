var phone = '';
var i = 60;
$(function() {
    checkUserInfo();
});

function checkUserInfo() {
    $.ajax({
        url: baseURL + 'action/auth/user/normal/HxCsUserAction/getBySession',
        async: false,
        success: function(data) {
            if (data.c == 0) {
                if (isStringEmpty(data.d.account)) {
                    showError('还未绑定手机号', '去绑定手机号', 'bindPhone.html');
                } else {
                    phone = data.d.account;
                    getVerifyCode();
                }
            }
        },
        error: function(data) {
            showError(data.m);
        }
    });
}
//确认按钮事件
function confirmButtonEvent() {
    $('#confirmButton').attr('disabled', false);
    $('#confirmButton').click(function() {
        password = $('#password').val();
        code = $('#verifyCode').val();
        if (password.length == 6 && code != '') {
            $.ajax({
                url: baseURL + 'action/auth/user/normal/HxCsUserAction/resetPayPassword',
                data: {
                    newPayPassword: $.md5(password),
                    code: code
                },
                success: function(data) {
                    if (data.c == 0) {
                        alert('设置成功！');
                        $('#confirmButton').attr('disabled', true);
                    } else {
                        showError(data.m);
                    }
                },
                error: function(data) {
                    showError(data.m);
                }
            });
        } else {
            alert('支付密码格式不正确！<br />正确格式为：6位数字');
        }

    });
}

//发送验证码
function getVerifyCode() {
    if (phone == '' || phone.length != 11) {
        alert('请输入正确的手机号');
    } else {
        $.ajax({
            url: baseURL + 'action/LoginAction/sendSMSCode',
            data: {
                mobileNumber: phone,
                type: 3
            },
            success: function(data) {
                buttonDisabled();
                alert('已经成功发送验证码到您：' + phone + '手机，请注意查收短信！')
                if (data.c == 0) {
                    console.log(data);
                    confirmButtonEvent();
                } else {
                    alert(data.m);
                }

            },
            error: function(data) {
                console.log(data);
            }
        });
    }
}

//倒计时
function buttonDisabled() {
    $('#getVerifyCode').attr("disabled", true);
    i = i - 1;
    $('#getVerifyCode').text(i + "秒后重新发送");
    if (i == 0) {
        $('#getVerifyCode').attr("disabled", false);
        $('#getVerifyCode').text("获取验证码");
        i = 60;
        return;
    }
    setTimeout('buttonDisabled()', 1000);
}