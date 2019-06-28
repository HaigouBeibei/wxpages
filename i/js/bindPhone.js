var i = 60;
$(function() {
    $('#getVerifyCode').click(function() {
        getVerifyCode();
    });
});

//确认按钮事件
function confirmButtonEvent() {
    $('#confirmButton').attr('disabled', false);
    $('#confirmButton').click(function() {
        phone = $('#phone').val();
        code = $('#verifyCode').val();
        if (!isStringEmpty(phone) && !isStringEmpty(code)) {
            $.ajax({
                url: baseURL + 'action/auth/user/normal/HxCsUserAction/bindMobileNumber',
                data: {
                    mobileNumber: phone,
                    code: code
                },
                success: function(data) {
                    if (data.c == 0) {
                        alert('绑定成功！');
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
            alert('请输入正确的手机号和验证码');
        }

    });
}

//发送验证码
function getVerifyCode() {
    var phone = $('#phone').val();
    if (phone == '' || phone.length != 11 || isNaN(phone)) {
        alert('请输入正确的手机号');
    } else {
        $.ajax({
            url: baseURL + 'action/LoginAction/sendSMSCode',
            data: {
                mobileNumber: phone,
                type: 2
            },
            success: function(data) {
                buttonDisabled();
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