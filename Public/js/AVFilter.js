/**
 * <script type="text/javascript" src="../js/AVFilter.js"></script>
 */
function avfilter(){
	$("audio").attr("controls","controls");
	$("audio").attr("controlsList","nodownload");
	$("audio").attr("preload","metadata");
	$("audio").css({"width":"100%","display":"block"});
	
	$("video").attr("controls","controls");
	$("video").attr("controlsList","nodownload");
	$("video").attr("preload","metadata");
	$("video").css({"width":"100%","display":"block"});
}
