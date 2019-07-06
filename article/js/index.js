$(function() {
    initData();
});


function initData() {
    $.ajax({
        url: baseURL + 'action/GlobalSettingsAnnouncementAction/list',
        success: function(data) {
            console.log(data);
            if (data.c == 0) {
                var appendContent = '';
                for (const key in data.d.list) {
                    if (data.d.list.hasOwnProperty(key)) {
                        appendContent += '<div class="am-u-sm-12">';
                        appendContent += '<article class="am-article">';
                        appendContent += '<div class="am-article-hd">';
                        appendContent += '<h1 class="am-article-title am-margin-xs am-text-lg"><strong>' + data.d.list[key].title + '</strong></h1>';
                        appendContent += '<p class="am-article-meta am-margin-xs">' + data.d.list[key].createdTime + '</p>';
                        appendContent += '</div>';
                        appendContent += '<div class="am-article-bd">';
                        appendContent += '<p class="am-article-lead">';
                        appendContent += '<img src="' + baseURL + data.d.list[key].img + '" class="am-img-responsive" /> ' + data.d.list[key].details.replace(/<[^>]+>/g, "");
                        //appendContent += '<img src="' + baseURL + data.d.list[key].img + '" class="am-img-responsive" /> ' + data.d.list[key].details;
                        appendContent += '</p>';
                        appendContent += '</div>';
                        appendContent += '</article>';
                        appendContent += '</div>';
                    }
                }
                $('#articleList').empty().append(appendContent);
            }
        },
        error: function(data) {
            console.log(data);
            showError(data.m);
        }
    });
}