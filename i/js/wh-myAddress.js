$(function() {
    
  });


function showDeltePop(title,showMessage) {
    var errorForm = "";
    errorForm += '<div class="am-modal am-modal-confirm" tabindex="-1" id="errorForm">';
    errorForm += '<div class="am-modal-dialog">';
    errorForm += '<div class="am-modal-hd">'+title +'</div>';
    errorForm += '<div class="am-modal-bd">';
    errorForm += showMessage;
    errorForm += "</div>";
    errorForm += '<div class="am-modal-footer">';
    errorForm += '<span class="am-modal-btn" data-am-modal-cancel>取消</span>';
    errorForm += '<span class="am-modal-btn" style="color:#f0250f" data-am-modal-confirm>确定</span>';
    errorForm += "</div></div></div>";
    $("body").append(errorForm);
    $("#errorForm").modal({
      relatedTarget: this,
      onConfirm: function(options) {
        window.location.reload();
      },
      onCancel: function() {
      }
    });
  }