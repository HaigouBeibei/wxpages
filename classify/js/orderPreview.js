$(function() {
    getOrderData();
});

function getOrderData() {
    $.ajax({
        url: baseURL + 'action/auth/user/normal/MerchantGoodsAction/orderPreview',
        data: {
            skuId: getQueryString('skuID'),
            count: getQueryString('count'),
            deliveryAddressId: getQueryString('deliveryAddressId')
        },
        success: function(data) {
            console.log(data);
            if (data.c == 0) {

            } else {
                showError(data.m);
            }
        },
        error: function(data) {
            showError(data.m);
        }
    });
}