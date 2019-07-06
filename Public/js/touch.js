/*******************************
var _touchSelector="#contentContainer";
var _leftCallBack=function(){
	console.log("leftCallBack");
}
var _rightCallBack=function(){
	console.log("rightCallBack");
}
var _upCallBack=function(){
	console.log("upCallBack");
}
var _downCallBack=function(){
	console.log("downCallBack");
}
var _topCallBack=function(){
	console.log("topCallBack");
}
var _bottomCallBack=function(){
	console.log("bottomCallBack");
}
hxTouch(_touchSelector,_leftCallBack,_rightCallBack,_upCallBack,_downCallBack,_topCallBack,_bottomCallBack);
*******************************/
function hxTouch(_touchSelector,_leftCallBack,_rightCallBack,_upCallBack,_downCallBack,_topCallBack,_bottomCallBack){
	$(_touchSelector).unbind("touchstart touchend scroll");
	var _sx=0;
	var _sy=0;
	var _topBaseValue = 10;
	var _bottomBaseValue = 300;
	var _scroll_monitor_=false;
	$(_touchSelector).bind("touchstart",function(event){
		_scroll_monitor_=false;
		if(event.originalEvent.changedTouches.length>0){
			_sx = event.originalEvent.changedTouches[0].pageX;
			_sy = event.originalEvent.changedTouches[0].pageY;
		}
	});
	$(_touchSelector).bind("touchend",function(event){
		if(event.originalEvent.changedTouches.length>0){
			if(Math.abs(_sy - event.originalEvent.changedTouches[0].pageY)<100){
				if((_sx - event.originalEvent.changedTouches[0].pageX) > 50){
					//console.log("向左滑动");
					try{_leftCallBack();}catch(e){}
				}else if((_sx - event.originalEvent.changedTouches[0].pageX) < -50 ){
					//console.log("向右滑动");
					try{_rightCallBack();}catch(e){}
				}
			}else if(Math.abs(_sx - event.originalEvent.changedTouches[0].pageX)<50){
				if((_sy - event.originalEvent.changedTouches[0].pageY) > 50){
					//console.log("向上滑动");
					try{_upCallBack();}catch(e){}
				}else if((_sy - event.originalEvent.changedTouches[0].pageY) < -50 ){
					//console.log("向下滑动");
					try{_downCallBack();}catch(e){}
				}
			}
			if($(_touchSelector).scrollTop()<_topBaseValue){
				//console.log("滑动到顶部");
				try{_topCallBack();}catch(e){}
				//减_bottomBaseValue适配不同浏览器
			}else if($(_touchSelector).scrollTop() + $(_touchSelector).height() >= $(_touchSelector)[0].scrollHeight - _bottomBaseValue){
				//console.log("滑动到底部");
				try{_bottomCallBack();}catch(e){}
			}else {
				_scroll_monitor_=true;
			}
		}
	});
	
	$(_touchSelector).bind("scroll",function(event){
		if(_scroll_monitor_){
			if($(this).scrollTop()<_topBaseValue){
				_scroll_monitor_ = false;
				//console.log("滑动到顶部");
				try{_topCallBack();}catch(e){}
				//减_bottomBaseValue适配不同浏览器
			}else if($(this).scrollTop() + $(this).height() >= $(this)[0].scrollHeight - _bottomBaseValue){
				_scroll_monitor_ = false;
				//console.log("滑动到底部");
				try{_bottomCallBack();}catch(e){}
			}
		}
	});
}
