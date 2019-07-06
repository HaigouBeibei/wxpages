$(function() {
    getData();
});

function getData() {
    $.ajax({
        url: baseURL + 'action/GlobalSettingsAction/getCustomerService',
        success: function(data) {
            if (data.c == 0) {
                $('#cs').attr('src', baseURL + data.d.wechatUrl);
                $('#csPhone').text('客服电话：' + data.d.contactNumber);
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}