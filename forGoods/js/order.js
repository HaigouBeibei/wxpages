
var page = 0;
$(function () {
    scroll()
})

function scroll() {
    $('#upLoading').scrollspy({
        animation: 'slide-bottom',
        delay: 200,
        repeat: true,
    });
    $('#upLoading').on('inview.scrollspy.amui', function() {
        page++;
        loadListData()
    }).on('outview.scrollspy.amui', function() {
        $('#upLoading').show()
        $('#upLoading').html('<p class="am-text-center am-link-muted">上拉加载更多...</p>');
    });
}
function loadListData(){
    $.ajax({
    url: baseURL + 'action/auth/user/normal/PurchasingAreaGoodsOrderWholesaleAction/list',
    data:{
        page:page,
        limit:'20',
    },
    success: function(data) {
        if (data.c =='0'){
            console.log(data);
              parseDataWithView(data.d)
        }else{
        showError(data.m)
        }
     }
    })  
 }
 
 function parseDataWithView(list){
    $('#upLoading').show()
    if (page == 1) {
        $("#orderList").empty();
    }
    if (list.length < 20) {
        $('#upLoading').html('<p class="am-text-center am-link-muted">我是有底线的！</p>');
    }
    if ((list.length <= 0) && (page ==1)) {
        // $("#emptyOrderList").show()
        $('#upLoading').hide()
    } else {
        $("#emptyOrderList").hide()
        var appendText = "";
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            appendText += '<table class="wh-orderHeader wh-priceSize cartProductArea am-table am-table-centered am-table-compact am-center am-margin-top-xs">';
            appendText += '<tbody >';
            appendText += '<tr>';
            appendText += '<td class="wh-tdHeight am-text-middle wh-cancelBorder wh-td-margin">';
            appendText += '<div class="wh-th-postion am-cf am-margin-top-xs am-margin-bottom-xs">';
            appendText += '<p class="wh-goodImg_set am-align-left am-margin-bottom-0">';
            if(element.goodsImg){
                appendText += '<img src="' + baseURL + element.goodsImg + '" class="am-margin-top-xs" width="70" height="70" alt="" />';  
            }else{
                appendText += '<img src="../Public/img/shopcart-product.png" class="am-margin-top-xs" width="90" height="90" alt="" />'; 
            }
            appendText += '</p>';
            appendText += '<div class="wh-contentSet">';
            appendText += '<p class="wh-textalign line-clamp am-margin-0 wh-sm-text wh-headerMargin">' + element.goodsName + '</p>';
            appendText += '<p class="wh-textalign  am-margin-0 wh-sm-text" >' + element.createdTime + '</p>';  
            if(element.state ==2  && element.countRemain>0){
                appendText += '<span class="wh-textalign wh-enquiry-customer am-margin-0 wh-sm-text" id ="showAction" value='+ element.id  +'>' + '核销码' + '</span>';  
            }
            appendText += '</div>';
            appendText += '<div class="wh-rightContaner wh-rightMargin">';
            appendText += '<p class="wh-footer-marigin am-text-danger">' + "￥" + handlePrice(element.price) + '</p>';
            appendText += '<p class="wh-footer-marigin wh-th-color">' + 'x' + element.count+'</p>';
            appendText += '<span class="wh-footer-status wh-th-color">'+ element.stateText +'</span>';
            appendText += '</div>';
            appendText += '</div>';
            appendText += '</td>';
            appendText += '</tr>';
            appendText += '</tbody>';
            appendText += ' </table>';
        }
        $("#orderList").append(appendText);
        //展示核销码
        $("#showAction").click(function(){
            var value = $(this).attr('value')
            window.location.href = baseURL + "wxpages/forGoods/wh-QrCode.html?orderId=" + value;
        })
    }
   
 }
